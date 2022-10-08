<?php

function get_webpress_subhead($post)
{
   $post = get_post($post);
   $subhead = get_post_meta($post->ID, "_webpress_subhead", true);
   return apply_filters("webpress_subhead", $subhead, $post);
}

/**
 * Add subhead meta box 
 */
add_action("add_meta_boxes", function () {
   global $current_screen;
   if (method_exists($current_screen, "is_block_editor") && $current_screen->is_block_editor()) {
      add_meta_box(
         "webpress_subhead_meta_box",
         __("Subhead", "webpress"),
         "webpress_subhead_meta_box_content",
         "post",
         "side"
      );
   }
});

function webpress_subhead_meta_box_content($post)
{
   $subhead = get_webpress_subhead($post);
   $subhead = esc_html($subhead);
   $title           = __("Subhead", "webpress");
   $placeholder     = $title . "...";
?>
<textarea type="text" id="webpress-subhead-title" class="components-text-control__input" name="webpress_subhead"
    placeholder="<?php echo $placeholder; ?>"><?php echo $subhead; ?></textarea>
<?php
}


/**
 * Register subhead post meta  
 */
add_action("init", function () {
   register_meta(
      "any",
      "_webpress_subhead",
      [
         "type"         => "string",
         "single"       => true,
         "show_in_rest" => true
      ]
   );
});


/**
 * Sanitize and save subhead
 */
add_action("save_post", function ($post_id) {
   if (!isset($_POST["webpress_subhead"])) {
      return false;
   }
   /** Don't save on autosave */
   if (defined("DOING_AUTOSAVE") && DOING_AUTOSAVE) {
      return false;
   }
   /** Don't save if user doesn't have necessary permissions */
   if (isset($_POST["post_type"]) && "page" === $_POST["post_type"]) {
      if (!current_user_can("edit_page", $post_id)) {
         return false;
      }
   } else if (!current_user_can("edit_post", $post_id)) {
      return false;
   }

   echo update_post_meta(
      $post_id,
      "_webpress_subhead",
      stripslashes(esc_attr($_POST["webpress_subhead"]))
   );
});


add_action('rest_api_init', function () {
   register_rest_field('post', 'subhead', array(
      'get_callback' => function ($post_arr) {
         $post = get_post($post_arr['id']);
         return get_webpress_subhead($post);
      },
      'update_callback' => function () {
         // no write
      },
      'schema' => array(
         'description' => __('Subhead'),
         'type'        => 'string'
      ),
   ));
});