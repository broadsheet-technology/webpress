<?php

include("webpress-features/feature-video.php");

if (defined('WEBPRESS_MEDIA_BYLINE_FEATURE') && constant("WEBPRESS_MEDIA_BYLINE_FEATURE")) {
    include("webpress-features/media-byline.php");
}