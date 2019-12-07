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
	$isHome;
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
		FrontPage = 0,
		Search = 1,
		Archive = 2,
		Blog = 3, ?? 
		Single = 4,
		PageNotFound = 99
	} */

	var $singleType; /* {
		Page = 0,
		Post = 1,
		Attachment = 2,
		Custom = 3,
		None = 99,
	} */

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
	}

	private static function resolveType(\WP_Query $query) {
		if( $query->is_home() ) {
			return 0;
		} else if( $query->is_search() ) {
			return 1;
		} else if( $query->is_archive() ) {
			return 2;
		} else if( $query->is_singular() ) {
			return 4;
		}
		return 99;
	}

	private static function resolveSingleType(\WP_Query $query) {
		if( $query->is_page() ) {
			return 0;
		} else if( $query->is_single() ) {
			if( $query->post->post_type == "post") {
				return 1;
			} else {
				return 3;
			}
		} else if( $query->is_attachment() ) {
			return 2;
		}
		return 99;
	}
}

class WebpressMenus {

}
  
  
