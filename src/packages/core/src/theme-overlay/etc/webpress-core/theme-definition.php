<?php

function webpress_get_theme_definition(): ThemeDefinition
{
    static $ThemeDefinition;

    /// Resolve first from global—
    if ($ThemeDefinition != null) {
        return $ThemeDefinition;
    }

    /// Resolve a cache busting timestamp—
    $cacheBuster = file_exists(__DIR__ . "/../../theme-definition.json") ? filemtime(__DIR__ . "/../../theme-definition.json") : false;

    if (!$theme = wp_cache_get("webpress-theme-definition-" . $cacheBuster)) {
        $theme = _webpress_try_load_theme_definition();
        wp_cache_set("webpress-theme-definition-" . $cacheBuster, $theme, "", 0);
    }

    $ThemeDefinition = $theme;

    return $ThemeDefinition;
}

class WebpressFeatureConfiguration
{
    public bool $socialTags;
}

/**
 * The server representation of theme
 * loaded from theme-definition.json
 */
class ThemeDefinition
{
    public string $root;
    public array $menus;
    public $features;

    function __construct($root, $menus, $features)
    {
        $this->root = $root;
        $this->menus = $menus;
        $this->features = $features;
    }
}


class MenuDefinition
{
    public string $location;
    public string $description;
    public bool $autoLoad;
    function __construct(string $location, ?string $description, ?bool $autoLoad = true)
    {
        $this->location = $location;
        $this->description = $description ? $description : $location;
        $this->autoLoad = $autoLoad;
    }
}


/**
 * Tries to load the ThemeDefinition off disk
 */
function _webpress_try_load_theme_definition(): ?ThemeDefinition
{
    $json = file_get_contents(__DIR__ . "/../../theme-definition.json");
    $decoded = json_decode($json, true);

    $root = $decoded['root'];
    $menus = _webpress_parse_menus($decoded['menus']);
    $features = $decoded['features'];

    return new ThemeDefinition($root, $menus, $features);
};


function _webpress_parse_menus($menus): array
{
    $toRet = [];
    foreach ($menus as $menu) {
        $toRet[] = new MenuDefinition($menu['location'], $menu['description'], array_key_exists('autoLoad', $menu) ? $menu['autoLoad'] : true);
    }
    return $toRet;
};