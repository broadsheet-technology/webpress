<?php

Global $ThemeDefinition;

function webpress_get_theme_definition() : ThemeDefinition {
    Global $ThemeDefinition;
    
    /// Resolve first from global—
    if ( $ThemeDefinition != null ) {
        return $ThemeDefinition;
    }

    /// Resolve a cache busting timestamp—
    $cacheBuster = @filemtime( __DIR__ . "/../../theme-definition.json" );

    if ( ! $theme = wp_cache_get("webpress-theme-definition-" . $cacheBuster) ) {
        $theme = _webpress_try_load_theme_definition();
        wp_cache_set("webpress-theme-definition-" . $cacheBuster, $theme, "", 0);
    }

    $ThemeDefinition = $theme;

    return $ThemeDefinition;
}

/**
 * The server representation of theme
 * loaded from theme-definition.json
 */
class ThemeDefinition {
    public ?array $menus;
    public ?array $features;
    public string $root;

    function __construct($root, $menus) {
        $this->root = $root;
        $this->menus = $menus;
        $this->features = $features;
    }
}


class MenuDefinition {
    public string $name;
    public string $autoLoad;
    function __construct($name, $autoLoad) {
        $this->name = $name;
        $this->autoLoad = $autoLoad;
    }
}


/**
 * Tries to load the ThemeDefinition off disk
 */
function _webpress_try_load_theme_definition() : ?ThemeDefinition {
    $json = file_get_contents( __DIR__ . "/../../theme-definition.json");
    $decoded = json_decode($json);

    $root = $decoded->root;
    $menus = $decoded->menus;
    $features = $decoded->features;

    return new ThemeDefinition($root, $features);
};


function _webpress_parse_menus($json) : array { 
    $toRet = [];
    foreach ($json as $menu) {
        $toRet[] = new MenuDefinition($menu->name, $menu->autoLoad);
    }
    return $toRet;
};