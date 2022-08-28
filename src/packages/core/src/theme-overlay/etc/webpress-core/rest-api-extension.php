<?php

/**
 * Add `permalink` to post objects
 */
add_action( 'rest_api_init', function () {
    register_rest_field( 'post', 'permalink', array(
        'get_callback' => function( $post ) {
            $permalink = get_permalink( $post['id'] );
            return $permalink;
        },
        'update_callback' => function( $karma, $comment_obj ) {
                return new WP_Error(
                  'rest_comment_karma_failed',
                  __( 'failed' ),
                  array( 'status' => 500 ));
        },
        'schema' => array(
            'description' => __( 'Post permalink.' ),
            'type'        => 'string'
        ),
    ) );
});