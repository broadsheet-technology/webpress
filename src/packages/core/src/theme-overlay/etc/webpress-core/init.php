<?php

/**
 * Registers theme menus and features from
 * theme-defition.json
 */
function _webpress_after_setup_theme()
{
    $theme = webpress_get_theme_definition();

    foreach ($theme->menus as $menu) {
        register_nav_menu($menu->location, $menu->description);
    }

    foreach ($theme->features as $feature) {
        add_theme_support($feature);
    }
}
add_action('after_setup_theme', '_webpress_after_setup_theme');