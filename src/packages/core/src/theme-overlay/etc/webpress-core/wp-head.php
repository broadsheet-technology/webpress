<?php 

function _webpress_print_wp_head() {
    global $WPContext;

    $json = file_get_contents( "/srv/stencil-stats.json");
    $varParam;
    if ($json) {
        $decoded = json_decode($json);
        $varParam = "?v=" . substr(md5($decoded->timestamp),0,8);
    } else {
        $varParam = "";
    }
    ?>

<script type="text/javascript">
var webpress = <?php echo json_encode($WPContext) ?>
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