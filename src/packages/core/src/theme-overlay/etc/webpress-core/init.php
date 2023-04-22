<?php

/**
 * Registers theme menus and features from
 * theme-defition.json
 */
function _init_webpress()
{
    $theme = webpress_get_theme_definition();

    foreach ($theme->menus as $menu) {
        register_nav_menu($menu->location, $menu->description);
    }

    foreach ($theme->features as $feature) {
        add_theme_support($feature);
    }
}
add_action('after_setup_theme', 'register_my_menu');