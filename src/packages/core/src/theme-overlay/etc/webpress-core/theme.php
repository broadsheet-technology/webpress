<?php

class WPGlobals {
    var $theme;
    var $serverInfo;
}

class WPTheme {
    var $menus;
    var $dir;
    var $root;
    function __construct($root) {
        $this->root = $root;
        $this->menus = get_nav_menu_locations();
        $this->dir = get_template_directory_uri();
    }
}

$json = file_get_contents( __DIR__ . "/../theme-definition.json");
$decoded = json_decode($json);
    
$WPContext = new WPGlobals();

function loadWebpressTheme() {
    global $WPContext;

    $json = file_get_contents( __DIR__ . "/../theme-definition.json");
    $decoded = json_decode($json);
    
    parseMenus($decoded->menus);
    parseFeatures($decoded->themeSupport);
    $WPContext->theme = new WPTheme($decoded->root);
    $WPContext->serverInfo = [ 
        "apiUrl" => get_home_url() . '/wp-json'
    ];
}
add_action( 'init' , 'loadWebpressTheme' );

function parseMenus($menus) {
    foreach( $menus as $menu ) {
        register_nav_menu( $menu, "adf" );
    }
}

function parseFeatures($features) {
    foreach( $features as $feature ) {
        add_theme_support( $feature );
    }
}

add_action( 'rest_api_init', function () {
    register_rest_field( 'post', 'permalink', array(
        'get_callback' => function( $post ) {
            $permalink = get_permalink( $post['id'] );
            return $permalink;
        },
        'update_callback' => function( $karma, $comment_obj ) {
                return new WP_Error(
                  'rest_comment_karma_failed',
                  __( 'failed' ),
                  array( 'status' => 500 ));
        },
        'schema' => array(
            'description' => __( 'Post permalink.' ),
            'type'        => 'string'
        ),
    ) );
} );