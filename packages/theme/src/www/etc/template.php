<?php

require 'classes/UrlToQuery.php';
require 'classes/UrlToQueryItem.php';

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
	$resolver = new UrlToQuery();
	$args = $resolver->resolve( $url );

	$query = new WP_Query($args);
	print_r($query);
}

  

