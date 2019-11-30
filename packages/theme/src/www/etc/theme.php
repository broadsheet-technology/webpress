<?php

function register_webpress_theme_definition() {
    $json = file_get_contents( __DIR__ . "/../theme-definition.json");
    $decoded = json_decode($json);
    parseMenus($decoded->menus);
}
add_action( 'init', 'register_webpress_theme_definition' );

function parseMenus($menus) {
    foreach( $menus as $menu ) {
        register_nav_menu( $menu, "adf" );
    }
}