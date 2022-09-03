<?php 

function _webpress_print_wp_head() {
    $context = get_webpress_context();
    $context->preloaded = apply_filters("webpress_preloaded",[])
    ?>

<script type="text/javascript">
var webpress = <?php echo json_encode($context); ?>
</script>

<script type="module"
    src="<?php echo get_template_directory_uri() . '/app/' . $context->namespace . '.esm.js?v=' . $context->buildHash ?>">
</script>
<script nomodule
    src="<?php echo get_template_directory_uri() . '/app/' . $context->namespace . '.js?v=' . $context->buildHash ?>">
</script>

<?php
}
add_action('wp_head', '_webpress_print_wp_head');
add_action('admin_head', '_webpress_print_wp_head');