<?php

function webpress_gutenberg_css()
{
    add_theme_support('editor-styles');
    add_editor_style('style-editor.css');
}
add_action('after_setup_theme', 'webpress_gutenberg_css');


/**
 * Enable a subset of blocks that are known to work
 */
function webpress_gutenberg_filter_allowed_block_types($allowed_block_types, $post)
{
    return array('core/paragraph', 'core/image', 'core/heading', 'core/separator');

    // immediate todos: pullquote, shortcode, gallery, List, etc
}
add_filter('allowed_block_types', 'webpress_gutenberg_filter_allowed_block_types', 10, 2);

/**
 * Disable the custom color picker.
 */
function _webpress_gutenberg_disable_custom_color_picker()
{
    add_theme_support('disable-custom-colors');
    add_theme_support('disable-custom-font-sizes');
    add_theme_support('disable-custom-gradients');
}
add_action('after_setup_theme', '_webpress_gutenberg_disable_custom_color_picker');

/**
 * Disable drop cap
 */
function _webpress_gutenberg_disable_drop_cap(array $editor_settings): array
{
    $editor_settings['__experimentalFeatures']['defaults']['typography']['dropCap'] = false;
    return $editor_settings;
}
add_filter('block_editor_settings', '_webpress_gutenberg_disable_drop_cap');


/**
 * Remove the UI element that allows users to resize images in gutenberg
 */
function _webpress_gutenberg_hack_to_remove_image_resizing_ui($hook)
{
?>
<style>
/** Restrict image sizes to known/defined sizes */
.block-editor-image-size-control {
    display: none;
}
</style>
<?php
}
add_action('admin_head', '_webpress_gutenberg_hack_to_remove_image_resizing_ui');