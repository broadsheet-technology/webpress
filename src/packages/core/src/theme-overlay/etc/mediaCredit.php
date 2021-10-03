<?php

function get_webpress_byline_author($media) {
    $media = get_post($media);
    return get_post_meta( $media->ID, "_webpress_byline_author", true );
}

function get_webpress_byline_credit_line($media) {
    $media = get_post($media);
    return get_post_meta( $media->ID, "_webpress_byline_credit_line", true );
}

function _webpress_byline_meta() {
    register_meta(
       "post",
       "_webpress_byline_author",
       [
          "type"         => "string",
          "single"       => true,
          "show_in_rest" => true
       ]
    );
     register_meta(
        "post",
        "_webpress_byline_credit_line",
        [
           "type"         => "string",
           "single"       => true,
           "show_in_rest" => true
        ]
     );
}
add_action("rest_api_init", "_webpress_byline_meta");

function _webpress_byline_save() {
    // Retrieve JSON payload
    $data = json_decode(file_get_contents('php://input'));

    $attachment_id = $data->id;
    $byline_user_id = $data->byline_author;
    $byline_credit_line = $data->byline_credit_line;
    $byline_author = $byline_user_id ? get_userdata($byline_user_id)->display_name : null;

    $readonly = $data->readonly;

    if(!$readonly) {
        // Update post meta on the attachment
        update_post_meta($attachment_id, '_webpress_byline_author', $byline_author);
        update_post_meta($attachment_id, '_webpress_byline_author_user_id', $byline_user_id);
        update_post_meta($attachment_id, '_webpress_byline_credit_line', $byline_credit_line);

        // Update the author of the media itself
        if ($byline_user_id != null) {
            $the_post = array();
            $the_post['ID'] = $attachment_id;
            $the_post['post_author'] = $byline_user_id;
            wp_update_post( $the_post );
        }
    } else {
        $byline_author = get_post_meta($attachment_id, '_webpress_byline_author');
        $byline_user_id = get_post_meta($attachment_id, '_webpress_byline_author_user_id');
        $byline_credit_line = get_post_meta($attachment_id, '_webpress_byline_credit_line');
    }

    wp_send_json(array(
        "media" => $attachment_id,
        "author" => $byline_author,
        "author_id" => $byline_user_id,
        "creditLine" => $byline_credit_line
    ));

    die();
}
add_action('wp_ajax_webpress_save_byline', '_webpress_byline_save');