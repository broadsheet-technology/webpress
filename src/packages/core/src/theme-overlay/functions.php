<?php 

/// theme functions:
if ( file_exists( __DIR__ . '/functions/functions.php' ) ) {
    require_once __DIR__ .  '/functions/functions.php';
}

/// webpress-core functions:
require_once 'etc/webpress-core.php';

/// bootstrap donate functions:
if ( file_exists( __DIR__ . '/etc/donate.php' ) ) {
    require_once __DIR__ .  '/etc/donate.php';
}

/// bootstrap analytics-bridge functions:
if ( file_exists( __DIR__ . '/etc/analytics-bridge.php' ) ) {
    require_once __DIR__ .  '/etc/analytics-bridge.php';
}