<?php 

function _webpress_print_wp_head() {
    global $WPContext;
    ?>

<script type="text/javascript">
var webpress = <?php echo json_encode($WPContext) ?>
</script>
<script type="module"
    src="<?php echo get_template_directory_uri() . '/app/' . WEBPRESS_STENCIL_NAMESPACE . '.esm.js' ?>"></script>
<script nomodule src="<?php echo get_template_directory_uri() . '/app/' . WEBPRESS_STENCIL_NAMESPACE . '.js' ?>">
</script>

<?php
}
add_action('wp_head', '_webpress_print_wp_head');
add_action('admin_head', '_webpress_print_wp_head');