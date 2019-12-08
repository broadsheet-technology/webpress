<?php

require 'url-query/UrlToQuery.php';
require 'url-query/UrlToQueryItem.php';

/**
 * Register read-only /template/ route for REST API
 */
function webpress_register_template_routes() {
	register_rest_route( 'webpress/v1', 'template/', array(
		'methods'             => WP_REST_Server::READABLE,
		'callback'            => 'webpress_template_request'
	) );
}
add_action( "rest_api_init", "webpress_register_template_routes" );
 
/**
 * Get a collection of items
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function webpress_template_request( $request ) {
	$url = $request["url"];
	$isHome = false;
	$args;
	if( $url == "/" ) {
		$isHome = true;
		if( webpress_home_is_static() ) {
			$args = ['p' => get_option('page_on_front'), 'post_type'=> 'any'];
		} else {
			$args = ['type' => 'post'];
		}
	} else {
		$resolver = new UrlToQuery();
		$args = $resolver->resolve( $url );
	}
	$query = new WP_Query($args);

	if($isHome) {
		if(webpress_home_is_static()) {
			$query->is_home = true;
			$query->is_page = true;
			$query->is_single = true;
		} else {
			$query->is_home = true;
		}
	}	
	return new WebpressTemplate($query);
}

function webpress_home_is_static() {
	return 'page' == get_option('show_on_front');
}

class WebpressTemplate {
	var $query;
	var $args;

	function __construct(\WP_Query $query) {
		$this->query = new WebpressQuery($query);
		$this->args = new WebpressTemplateArgs($query);
	}
}

class WebpressQuery {
	var $posts;

	function __construct(\WP_Query $query) {
		$this->posts = $query->posts;
	}
}

class WebpressTemplateArgs {
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

	function __construct(\WP_Query $query) {
		$this->type = WebpressTemplateArgs::resolveType($query);
		$this->singleType = WebpressTemplateArgs::resolveSingleType($query); 
		$this->frontPageType = WebpressTemplateArgs::resolveFrontPageType($query); 
	}

	private static function resolveType(\WP_Query $query) {
		if( $query->is_home() ) {
			return 1;
		} else if( $query->is_search() ) {
			return 2;
		} else if( $query->is_archive() ) {
			return 3;
		} else if( $query->is_singular() ) {
			return 5;
		}
		return 0;
	}

	private static function resolveSingleType(\WP_Query $query) {
		if( $query->is_page() ) {
			return 1;
		} else if( $query->is_single() ) {
			if( $query->post->post_type == "post") {
				return 2;
			} else {
				return 4;
			}
		} else if( $query->is_attachment() ) {
			return 3;
		}
		return 0;
	}

	private static function resolveFrontPageType(\WP_Query $query) {
		if( !$query->is_home ) {
			return 0;
		} else if( $query->is_page ) {
			return 2;
		} else {
			return 1;
		}
	}
}

class WebpressMenus {

}
  
  
