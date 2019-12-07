<?php

class WPContext {
    var $root;
    var $server;
    var $theme;
}

class WPTheme {
    var $menus;
    var $dir;
    function __construct() {
        $this->menus = get_nav_menu_locations();
        $this->dir = get_template_directory_uri();
    }
}

$json = file_get_contents( __DIR__ . "/../theme-definition.json");
$decoded = json_decode($json);
    
$WPContext = new WPContext();

function loadWebpressTheme() {
    global $WPContext;

    $json = file_get_contents( __DIR__ . "/../theme-definition.json");
    $decoded = json_decode($json);
    
    parseMenus($decoded->menus);
    $WPContext->theme = new WPTheme();
    $WPContext->root = $decoded->root;
    $WPContext->server = [ 
        "apiUrl" => get_home_url() . '/wp-json'
    ];
}
add_action( 'init' , 'loadWebpressTheme');

function parseMenus($menus) {
    foreach( $menus as $menu ) {
        register_nav_menu( $menu, "adf" );
    }
}
