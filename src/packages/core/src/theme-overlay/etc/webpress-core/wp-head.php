<?php 

function _webpress_print_wp_head() {
    $context = get_webpress_context();

    $compileTime = filemtime( __DIR__ . "/srv/stencil-stats.json" );
    if ( ! $context = wp_cache_get("webpress-context-" . $compileTime) ) {
        $context = new WPGlobals();
        $json = file_get_contents( __DIR__ . "/srv/stencil-stats.json");
        $decoded = json_decode($json);
    
        parseMenus($decoded->menus);
        parseFeatures($decoded->themeSupport);

        $context->theme = new WPTheme($decoded->root);
        $context->serverInfo = [ 
            "apiUrl" => get_home_url() . '/wp-json'
        ];
    
        wp_cache_set("webpress-context-" . $compileTime, $context, '', 0);
    }

    $json = file_get_contents( "/srv/stencil-stats.json");
   
    ?>

<script type="text/javascript">
var webpress = <?php echo json_encode($context) ?>
</script>

<script type="module"
    src="<?php echo get_template_directory_uri() . '/app/' . WEBPRESS_STENCIL_NAMESPACE . '.esm.js' . $varParam ?>">
</script>
<script nomodule
    src="<?php echo get_template_directory_uri() . '/app/' . WEBPRESS_STENCIL_NAMESPACE . '.js' . $varParam ?>">
</script>

<?php
}
add_action('wp_head', '_webpress_print_wp_head');
add_action('admin_head', '_webpress_print_wp_head');