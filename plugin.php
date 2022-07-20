<?php
/**
 * Plugin Name: Datavis Block
 * Description: Provide a block to render graphics using Vega Lite.
 * Author: Human Made
 * Author URI: https://humanmade.com
 * Version: 0.1.0
 */

namespace Datavis_Block;

require_once __DIR__ . '/inc/assets.php';
require_once __DIR__ . '/inc/blocks.php';
require_once __DIR__ . '/inc/datasets/endpoints.php';
require_once __DIR__ . '/inc/datasets/metadata.php';
require_once __DIR__ . '/inc/datasets/namespace.php';

Assets\bootstrap();
Blocks\bootstrap();
Datasets\bootstrap();
Datasets\Endpoints\bootstrap();
Datasets\Metadata\bootstrap();
