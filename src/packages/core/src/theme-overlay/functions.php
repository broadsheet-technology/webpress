<?php

/// theme functions:
if (file_exists(__DIR__ . '/functions/functions.php')) {
    require_once __DIR__ .  '/functions/functions.php';
}

/// webpress-core functions:
require_once 'etc/webpress-core.php';

if (file_exists(__DIR__ . '/etc/webpress-features.php')) {
    require_once __DIR__ .  '/etc/webpress-features.php';
}

/// bootstrap donate functions:
if (file_exists(__DIR__ . '/etc/donate.php')) {
    require_once __DIR__ .  '/etc/donate.php';
}

if (file_exists(__DIR__ . '/etc/features/index.asset.php')) {
    require_once __DIR__ .  '/etc/features/index.asset.php';
}

/// bootstrap analytics-bridge functions:
if (file_exists(__DIR__ . '/etc/analytics-bridge.php')) {
    require_once __DIR__ .  '/etc/analytics-bridge.php';
}