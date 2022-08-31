<?php

/// Don't use directly. Call `get_webpress_context()`
$WebpressContext;

/**
 * The client representation of webpress context
 * localized with the webpress application javascript
 */
class WebpressContext {
    public string $namespace;
    public array $theme;
    public array $serverInfo;
    public string $buildHash;

    public WebpressAutoload $autoloaded;

    function __construct(ThemeDefinition $theme, ?StencilStats $stats) {
        $this->namespace = $stats->namespace ? $stats->namespace : WEBPRESS_STENCIL_NAMESPACE;
        $this->theme = [ 
            "dir" => get_template_directory_uri(),
            "root" => $theme->root
        ];
        $this->serverInfo = [ 
            "apiUrl" => get_home_url() . '/wp-json'
        ];
        $this->buildHash = $stats->buildHash;
    }
}

/**
 * Returns the webpress contextual
 * object
 */
function get_webpress_context() : WebpressContext {
    global $WebpressContext;

    /// Resolve first from global—
    if ( $WebpressContext != null ) {
        return $WebpressContext;
    }

    $theme = webpress_get_theme_definition();
    $stats = webpress_get_stencil_stats();

    $WebpressContext = new WebpressContext($theme, $stats);

    return $WebpressContext;
}