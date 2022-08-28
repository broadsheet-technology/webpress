<?php

Global $StencilStats;

/**
 * The server representation of theme
 * loaded from theme-definition.json
 */
class StencilStats {
    public string $namespace;  
    public string $buildHash;
    function __construct($namespace, $buildHash) {
        $this->namespace = $namespace;
        $this->buildHash = $buildHash;
    }
}

function webpress_get_stencil_stats() : ?StencilStats {
    Global $StencilStats;
    
    /// Resolve first from global—
    if ( $StencilStats != null ) {
        return $StencilStats;
    }

    /// Resolve a cache busting timestamp—
    $cacheBuster = file_exists( "/srv/stencil-stats.json" ) ? filemtime( "/srv/stencil-stats.json" ) : false;

    /// filemtime returns false if the file isn't found.
    if ( !$cacheBuster ) {
        return null;
    }

    /// Find in wp cache—
    if ( ! $stats = wp_cache_get("webpress-stencil-stats-" . $cacheBuster) ) {

        /// Otherwise load from disk—
        $stats = _webpress_try_load_stencil_stats();
        wp_cache_set("webpress-stencil-stats-" . $cacheBuster, $stats, "", 0);
    }

    $StencilStats = $stats;

    return $StencilStats;
}

/**
 * Tries to load the ThemeDefinition off disk
 */
function _webpress_try_load_stencil_stats() : ?StencilStats {
    $json = file_get_contents( "/srv/stencil-stats.json");
    $decoded = json_decode($json);

    $namespace = $decoded->app->namespace;
    $buildHash = substr(md5($decoded->timestamp),0,8);

    return new StencilStats($namespace, $buildHash);
};