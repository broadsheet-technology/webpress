<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0">
  <title><?php echo wp_title("&middot;",true,"right"); ?></title>
  <?php wp_head(); ?>
</head>
<?php jp_debug_rewrite_rules(); ?>
<body <?php body_class(); ?>>
  <wjh-dev first="Stencil" last="'Don't call me a framework' JS"></wjh-dev>
</body>
</html>
