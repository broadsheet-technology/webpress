<?php 

include 'etc/template.php';
include 'etc/theme.php';
include 'etc/menus.php';
include 'etc/social.php';
include 'etc/subheads.php';

if ( file_exists( dirname(__FILE__) . '/functions/functions.php' ) ) {
    include 'functions/functions.php'; 
}

add_action('wp_head', function() {
    global $WPContext;
    ?>
    <script type="text/javascript">var webpress = <?php echo json_encode($WPContext) ?></script>
    <script type="module" src="<?php echo get_template_directory_uri() . '/app/' . WEBPRESS_STENCIL_NAMESPACE . '.esm.js' ?>"></script>
    <script nomodule src="<?php echo get_template_directory_uri() . '/app/' . WEBPRESS_STENCIL_NAMESPACE . '.js' ?>"></script>
    <?php
});

