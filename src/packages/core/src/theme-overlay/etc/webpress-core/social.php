<?php

/**
 * Add OpenGraph meta tags to wp_head
 *
 * @package webpress
 * @since v0.0.1
 * @see http://ogp.me
 */

add_action('wp_head', function() {
	global $post;

	if ( !$post ) {
        return;
    }

	$output = "";

	/* 1. Title (string) */

	$title = single_post_title( null, false );
	$output .= "<meta property='og:title' content='$title' />\n";

	/* 2. Description (string) */

	$excerpt = htmlspecialchars(get_the_excerpt( $post ));
	$output .= '<meta property="og:description" content="'.$excerpt.'" />'."\n";

	/* 3. Site (string) */

	$site = get_bloginfo( 'name' );
	$output .= "<meta property='og:site_name' content='$site' />\n";

	/* 4. Type (enum) */
	
	// is_single: When any single Post (or attachment, or custom Post Type) page is being displayed. 
	// (todo) type of profile is also valid.

	if( is_single() ) {

		// type (enum)
		$output .= "<meta property='og:type' content='article' />\n";

		// article:published_time (datetime)
		$published = new DateTime($post->post_date_gmt,new DateTimeZone('GMT'));
		$published->setTimeZone( new DateTimeZone("America/Chicago") );
		$output .= "<meta property='og:article:published_time' content='{$published->format(DateTime::ISO8601)}' />\n";

		// article:modfied_time (datetime)
		$modified = new DateTime($post->post_modified_gmt,new DateTimeZone('GMT'));
		$modified->setTimeZone( new DateTimeZone("America/Chicago") );
		$output .= "<meta property='og:article:modified_time' content='{$modified->format(DateTime::ISO8601)}' />\n";

		// article:section (string)
		$section = get_the_category();
		if( $section ) {
			$section = $section[0]->name;
			$section = $section == 'oped' ? $section = 'opinion' : $section;
			$output .= "<meta property='og:article:section' content='$section' />\n";
		}

		// article:tag (string array)
		$tags = wp_get_post_terms($post->ID,'topic');
		if( $tags ) {
			foreach ($tags as $tag) {
				$output .= "<meta property='og:article:tag' content='{$tag->name}' />\n";
			}
		}
		// Currently unused (profile tag) (todo)
		// $output .= "<meta property='og:article:author' content='' />\n";

	} else {
		// type (enum)
		$output .= "<meta property='og:type' content='website' />\n";
	}

	/* 5. Url */

	$url = get_permalink($post->ID);
	$output .= "<meta property='og:url' content='$url' />\n";

	/* 6. Image */

	$img = wp_get_attachment_url( get_post_thumbnail_id($post->ID) );
	if( $img ) {
		$output .= "<meta property='og:image' content='$img' />\n";
	} else {
		$img = get_template_directory_uri() . "/assets/img/misc/social-thumb.png";
		$output .= "<meta property='og:image' content='$img' />\n";
	}

	/* 7. Finish up */

	$output .= "\n";
	echo $output;
});


/**
 * Add Twitter card meta tags to wp_head
 *
 * @package webpress
 * @since v0.0.1
 * @see https://dev.twitter.com/cards/
 */
add_action('wp_head', function() {

	global $post;

	if(!$post)
		return;

	$output = '';

	// Currently, we only print cards on 
	// single post pages.
	if( is_single() ) :

	$output .= "";

	/* 1. Card type, and image */

	$img = wp_get_attachment_url( get_post_thumbnail_id($post->ID) );

	if( $img ) {
		$output .= "<meta name='twitter:card' content='summary_large_image' />\n";
		$output .= "<meta name='twitter:image:src' content='$img' />\n";
	} else {
		$output .= "<meta name='twitter:card' content='summary' />\n";
	}

	/* 2. Title */

	$title = single_post_title( "", false );
	$output .= "<meta name='twitter:title' content='$title' />\n";

	/* 3. Excerpt */

	$excerpt = htmlspecialchars(get_the_excerpt());
	$output .= '<meta name="twitter:description" content="' . $excerpt . '" />' . "\n";
	
	/* 4. Site 

    $output .= "<meta name='twitter:site' content='@todoaddhandle' />\n";
    
    */
	
	/* 5. Creator 

	if(	webpress_author_has("webpress_twitter_handle") ) {
		$twitter = // todo
		$output .= "<meta name='twitter:creator' content='@$twitter' />\n";
    }
    
    */
	
	endif;

	/* 6. Finish up */

	$output .= "\n";
	echo $output;

});