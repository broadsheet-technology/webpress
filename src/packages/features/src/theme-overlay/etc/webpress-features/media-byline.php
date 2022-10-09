<?php

/**
 * Returns byline author's name for the passed $attachment identifier
 */
function get_webpress_media_byline_author_name($attachment)
{
    $attachment = get_post($attachment);
    return get_post_meta($attachment->ID, "_webpress_byline_author", true);
}

/**
 * Returns byline author's id for the passed $attachment identifier
 */
function get_webpress_media_byline_author_id($attachment)
{
    $media = get_post($attachment);
    return get_post_meta($attachment->ID, "_webpress_byline_author_id", true);
}

/**
 * Returns credit line for the passed $attachment identifier
 */
function get_webpress_media_byline_credit_line($attachment)
{
    $media = get_post($attachment);
    return get_post_meta($attachment->ID, "_webpress_byline_credit_line", true);
}

/**
 * Filters core/image block dom returned by Rest API to include wrapper component
 * used to inject the media byline
 */
function _webpress_media_byline_wrap_core_image_block($block_content, $block)
{
    if ('core/image' !== $block['blockName']) {
        return $block_content;
    }

    // Override the image block to add media credit
    //	$return  = '<wp-block-image-decorator class="webpress-contextual">';
    $return = $block_content;
    //	$return .= '</wp-block-image-decorator>';

    return $return;
}
add_filter('render_block', '_webpress_media_byline_wrap_core_image_block', 10, 2);


/**
 * Registers @webpress/features javascript for use on the back end
 */
function _webpress_media_byline_enqueue_features_js()
{
    wp_register_script(
        'webpress-features',
        get_template_directory_uri() . '/etc/features.js',
        array('wp-blocks', 'wp-element', 'wp-editor')
    );

    // This dummy block currently ensures the script is enqueued when gutenberg is initiated.
    // and there is probably a better way to do this
    register_block_type('myguten-block/test-block', array(
        'editor_script' => 'webpress-features',
        'editor_style' => 'my-custom-block-editor-style',
        'style' => 'my-custom-block-frontend-style',
    ));

    $userObjects = get_users(
        array(
            'fields' => array('ID', 'display_name'),
        )
    );

    $users = [];

    foreach ($userObjects as $u) {
        $users[] = array(
            'label' => $u->display_name,
            'value' => $u->ID
        );
    }
    wp_localize_script('webpress-features', 'webpress_users', array('users' => $users));
}
add_action('init', '_webpress_media_byline_enqueue_features_js');

/**
 * Register byline meta to be returned on the Rest API
 */
function _webpress_media_byline_meta()
{
    register_meta(
        "media",
        "_webpress_byline_author",
        [
            "type"         => "string",
            "single"       => true,
            "show_in_rest" => true
        ]
    );
    register_meta(
        "media",
        "_webpress_byline_credit_line",
        [
            "type"         => "string",
            "single"       => true,
            "show_in_rest" => true
        ]
    );
}
add_action("rest_api_init", "_webpress_media_byline_meta");


/**
 * Admin AJAX for loading a post
 * 
 * Used by client-side by the gutenberg editor (in feature code) to store AND load byline
 * details from the database
 */
function _webpress_media_byline_ajax_save()
{

    $attachment_id = $_POST["id"];

    if (!$attachment_id) {
        $attachment_id = _webpress_media_byline_get_attachment_id($_POST["src"]);
    }

    $byline_user_id = $_POST["byline_author"];
    $byline_credit_line = $_POST["byline_credit_line"];
    $byline_author = $byline_user_id ? get_userdata($byline_user_id)->display_name : null;

    $readonly = $_POST["readonly"];

    if ($readonly != "1") {
        // Update post meta on the attachment
        update_post_meta($attachment_id, '_webpress_byline_author', $byline_author);
        update_post_meta($attachment_id, '_webpress_byline_author_user_id', $byline_user_id);
        update_post_meta($attachment_id, '_webpress_byline_credit_line', $byline_credit_line);

        // Update the author of the media itself
        if ($byline_user_id != null) {
            $the_post = array();
            $the_post['ID'] = $attachment_id;
            $the_post['post_author'] = $byline_user_id;
            wp_update_post($the_post);
        }
    } else if ($attachment_id) {
        $byline_author = get_post_meta($attachment_id, '_webpress_byline_author', 1);
        $byline_user_id = get_post_meta($attachment_id, '_webpress_byline_author_user_id', 1);
        $byline_credit_line = get_post_meta($attachment_id, '_webpress_byline_credit_line', 1);
    }

    wp_send_json(array(
        "media" => $attachment_id,
        "author" => is_null($byline_author) ? "" : $byline_author,
        "author_id" => is_null($byline_user_id) ? "" : $byline_user_id,
        "creditLine" => is_null($byline_credit_line) ? "" : $byline_credit_line
    ));

    die();
}
add_action('wp_ajax_webpress_save_byline', '_webpress_media_byline_ajax_save');

/**
 * Returns attachment_id for an image src, including
 * post thumbnails
 */
function _webpress_media_byline_get_attachment_id($url)
{
    $dir = wp_upload_dir();
    // baseurl never has a trailing slash
    if (false === strpos($url, $dir['baseurl'] . '/')) {
        // URL points to a place outside of upload directory
        return false;
    }
    $file  = basename($url);
    $query = array(
        'post_type'  => 'attachment',
        'fields'     => 'ids',
        'meta_query' => array(
            array(
                'key'     => '_wp_attached_file',
                'value'   => $file,
                'compare' => 'LIKE',
            ),
        )
    );
    // query attachments
    $ids = get_posts($query);
    if (!empty($ids)) {
        foreach ($ids as $id) {
            // first entry of returned array is the URL
            if ($url === array_shift(wp_get_attachment_image_src($id, 'full')))
                return $id;
        }
    }
    $query['meta_query'][0]['key'] = '_wp_attachment_metadata';
    // query attachments again
    $ids = get_posts($query);
    if (empty($ids))
        return false;
    foreach ($ids as $id) {
        $meta = wp_get_attachment_metadata($id);
        foreach ($meta['sizes'] as $size => $values) {
            if ($values['file'] === $file && $url === array_shift(wp_get_attachment_image_src($id, $size)))
                return $id;
        }
    }
    return false;
}