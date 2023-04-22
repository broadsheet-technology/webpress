<?php

require 'url-query/UrlToQuery.php';
require 'url-query/UrlToQueryItem.php';

/**
 * Register read-only /template/ route for REST API
 */
function webpress_register_template_routes()
{
	register_rest_route('webpress/v1', 'template/', array(
		'methods'             => WP_REST_Server::READABLE,
		'callback'            => 'webpress_template_request'
	));
}
add_action("rest_api_init", "webpress_register_template_routes");

/**
 * Get a collection of items
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function webpress_template_request($request)
{
	$path = $request["path"];

	$cache_ns = wp_cache_get("webpress-template-ns", 'webpress-core') ?: 0;
	$cache_key = "webpress-template-" . $cache_ns . "_" . $path;
	if ($data = wp_cache_get($cache_key, 'webpress-core')) {
		return $data;
	}
	$isHome = false;
	$args = [];
	if ($path == "/") {
		$isHome = true;
		if (webpress_home_is_static()) {
			$args = [
				'p' => get_option('page_on_front'),
				'post_type' => 'any'
			];
		} else {
			$args = ['type' => 'post'];
		}
	} else {
		$resolver = new UrlToQuery();
		$args = $resolver->resolve($path);
	}
	$query = new WP_Query($args);

	if ($isHome) {
		if (webpress_home_is_static()) {
			$query->is_home = true;
			$query->is_page = true;
			$query->is_single = true;
		} else {
			$query->is_home = true;
		}
	}

	$data = array(new WebpressTemplate($query, $args));
	wp_cache_set($cache_key, $data, 'webpress-core', 0);

	return $data;
}

/**
 * Bust template cache when any post is saved
 */
add_action('save_post', function ($post_id) {
	// If this is a revision, get real post ID
	if ($parent_id = wp_is_post_revision($post_id))
		$post_id = $parent_id;

	if (get_post_status($post_id) !== 'publish') {
		return;
	}

	$cache_ns = wp_cache_get("webpress-template-ns", 'webpress-core') ?: 0;
	wp_cache_set("webpress-template-ns", $cache_ns + 1, 'webpress-core');
});

function webpress_home_is_static()
{
	return 'page' == get_option('show_on_front');
}

class WebpressTemplate
{
	var $properties;
	var $queryArgs;

	function __construct(\WP_Query $query, $args)
	{
		$this->properties = new WebpressTemplateArgs($query, $args);
		$this->queryArgs = WebpressTemplate::requestFromArgs($args, $query);
	}

	private static function requestFromArgs($args, \WP_Query $query)
	{
		$req = [];

		// By slug
		if (!$query->is_posts_page) {
			$req['slug'] = array_key_exists('pagename', $args) ? $args['pagename'] : null;
			if (array_key_exists('name', $args)) {
				$req['slug'] = $args['name'];
			} else if (webpress_home_is_static() && $query->is_home) {
				$req['id'] = get_option('page_on_front');
			}
		}

		// By other...
		$req['author'] = array_key_exists('author', $args) ? $args['author'] : null;
		$req['author_exclude'] = array_key_exists('author_exclude', $args) ? $args['author_exclude'] : null;
		$req['exclude'] = array_key_exists('exclude', $args) ? $args['exclude'] : null;
		$req['include'] = array_key_exists('include', $args) ? $args['include'] : null;
		$req['menu_order'] = array_key_exists('menu_order', $args) ? $args['menu_order'] : null;
		$req['offset'] = array_key_exists('offset', $args) ? $args['offset'] : null;
		$req['order'] = array_key_exists('order', $args) ? $args['order'] : null;
		$req['orderby'] = array_key_exists('orderby', $args) ? $args['orderby'] : null;
		$req['parent'] = array_key_exists('parent', $args) ? $args['parent'] : null;
		$req['parent_exclude'] = array_key_exists('parent_exclude', $args) ? $args['parent_exclude'] : null;
		$req['search'] = array_key_exists('search', $args) ? $args['search'] : null;
		$req['page'] = array_key_exists('page', $args) ? $args['page'] : null;
		$req['status'] = array_key_exists('status', $args) ? $args['status'] : null;

		return $req;
	}
}

class WebpressQuery
{
	var $posts;

	function __construct(\WP_Query $query)
	{
		$this->posts = $query->posts;
	}
}

class WebpressTemplateArgs
{

	var $slug;
	var $type; /* {
		FrontPage = 1,
		Search = 2,
		Archive = 3,
		Blog = 4, ?? 
		Single = 5,
		PageNotFound = 0
	} */

	var $singleType; /* {
		Page = 1,
		Post = 2,
		Attachment = 3,
		Custom = 4,
		None = 0,
	} */

	var $frontPageType;

	/* todo...
    archiveType?: TemplateArchiveType 
    archiveDateType?: TemplateArchiveDateType 

    slug?: string
    postType?: string
    nicename?: string
    id?: string
    taxonomy?: string 
	taxonomyTerm?: string
	*/

	function __construct(\WP_Query $query, $args)
	{
		$this->type = WebpressTemplateArgs::resolveType($query);
		$this->singleType = WebpressTemplateArgs::resolveSingleType($query);
		$this->frontPageType = WebpressTemplateArgs::resolveFrontPageType($query);

		if (array_key_exists('pagename', $args)) {
			$this->slug = $args['pagename'];
		}
	}

	private static function resolveType(\WP_Query $query)
	{
		if ($query->is_404()) {
			return -1;
		}
		if ($query->is_posts_page) {
			return 4;
		} else if ($query->is_home()) {
			return 1;
		} else if ($query->is_search()) {
			return 2;
		} else if ($query->is_archive()) {
			return 3;
		} else if ($query->is_singular()) {
			return 5;
		}
		return -1;
	}

	private static function resolveSingleType(\WP_Query $query)
	{
		if ($query->is_page()) {
			return 1;
		} else if ($query->is_single()) {
			if ($query->post->post_type == "post") {
				return 2;
			} else {
				return 4;
			}
		} else if ($query->is_attachment()) {
			return 3;
		}
		return 0;
	}

	private static function resolveFrontPageType(\WP_Query $query)
	{
		if (!$query->is_home || $query->is_posts_page) {
			return 0;
		} else if (webpress_home_is_static()) {
			return 2;
		} else {
			return 1;
		}
	}
}

class WebpressMenus
{
}