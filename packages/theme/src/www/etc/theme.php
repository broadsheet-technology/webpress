<?php

class WPTheme {
    var $root;
    var $server;
}

$json = file_get_contents( __DIR__ . "/../theme-definition.json");
$decoded = json_decode($json);
    


$WPTheme = new WPTheme();

function loadWebpressTheme() {
    global $WPTheme;

    $json = file_get_contents( __DIR__ . "/../theme-definition.json");
    $decoded = json_decode($json);
    
    // parseMenus($decoded->menus);

    $WPTheme->root = $decoded->root;
    $WPTheme->server = [ 
        "apiUrl" => get_home_url() . '/wp-json'
    ];
}
add_action( 'init' , 'loadWebpressTheme');

function parseMenus($menus) {
    foreach( $menus as $menu ) {
        register_nav_menu( $menu, "adf" );
    }
}
