<?php 

include 'etc/template.php';

add_action('wp_head', function() {
    ?>
    <script type="text/javascript">
        var exa = { 
            'api_url': "<?php echo get_home_url() . '/wp-json' ?>",
        }
    </script>
    <script type="module" src="<?php echo get_template_directory_uri() . '/app/' . WEBPRESS_STENCIL_NAMESPACE . '.esm.js' ?>"></script>
    <script nomodule src="<?php echo get_template_directory_uri() . '/app/' . WEBPRESS_STENCIL_NAMESPACE . '.js' ?>"></script>
    <?php
});


