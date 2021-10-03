<?php
 
function webpress_gutenberg_css(){
	add_theme_support( 'editor-styles' );
	add_editor_style( 'style-editor.css' );
}
add_action( 'after_setup_theme', 'webpress_gutenberg_css' );

function webpress_gutenberg() {
    echo "<wp-gutenberg>";
}
add_action( 'admin-header', 'webpress_gutenberg' );

function webpress_gutenberg_end() {
    echo "</wp-gutenberg>";
}
add_action( 'admin-footer', 'webpress_gutenberg_end' );
