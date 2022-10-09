<?php

/**
 * Register post meta for featured image focal point
 */
add_action('init', function () {
    register_meta(
        "post",
        "_featured_image_is_video",
        [
            "type"         => 'boolean',
            "description" => 'If true, overrides feature image to display a YouTube video.',
            "single"       => true,
            "show_in_rest" => true,
            "auth_callback" => function () {
                return current_user_can('edit_posts');
            }
        ]
    );

    register_meta(
        "post",
        "_featured_image_video_url",
        [
            "type"         => 'string',
            "description" => 'If true, overrides feature image to display a YouTube video.',
            "single"       => true,
            "show_in_rest" => true,
            "auth_callback" => function () {
                return current_user_can('edit_posts');
            }
        ]
    );
});