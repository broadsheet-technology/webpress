<?php


function _init_webpress() {
    $theme = webpress_get_theme_definition();

    foreach( $theme->menus as $menu ) {
        register_nav_menu( $menu, "TODO" );
    }

    foreach( $features as $feature ) {
        add_theme_support( $feature );
    }
    
}
add_action( 'init' , '_init_webpress' );
add_action( 'admin_init' , '_init_webpress' );