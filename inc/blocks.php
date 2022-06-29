<?php
/**
 * Register blocks on the PHP side.
 */

namespace Datavis_Block\Blocks;

/**
 * Connect namespace functions to actions & hooks.
 */
function bootstrap() : void {
	add_action( 'init', __NAMESPACE__ . '\\register_blocks' );
}

/**
 * Register our block with the PHP framework.
 */
function register_blocks() : void {
	register_block_type(
		'datavis-block/datavis-block',
		[
			'render_callback' => __NAMESPACE__ . '\\render_datavis_block',
			'attributes' => [
				'json' => [
					'type'    => 'object',
					'default' => [],
				],
			],
		]
	);
}

/**
 * Render function for block.
 *
 * @param array $attributes Block attributes.
 *
 * @return string
 */
function render_datavis_block( array $attributes ) : string {
	$json     = $attributes['json'] ?? false;
	$maxWidth = $attributes['maxWidth'] ?? false;
	$minWidth = $attributes['minWidth'] ?? false;
	$viewport = $attributes['viewport'] ?? false;
	$chart_id = uniqid( 'chart-' );

	// Do not continue if we do not have a json string.
	if ( empty( $json ) ) {
		return '';
	}

	$datavis = sprintf( '%1$s-datavis', $chart_id );
	$config   = sprintf( '%1$s-config', $chart_id );

	$classes = [
		'datavis-block',
		$datavis,
	];
	if ( $viewport ) {
		$classes[] = sprintf( 'datavis-%1$s', $viewport );
	}

	ob_start();
	?>
	<style>
		<?php if ( ! empty( $maxWidth ) || ! empty( $minWidth ) ) : ?>
			.<?php echo esc_html( $datavis ) ?> {
				display: none;
			}
		<?php endif; ?>

		<?php if ( ! empty( $maxWidth ) && ! empty( $minWidth ) ) : ?>
			@media screen and (max-width: <?php echo esc_attr( $maxWidth ); ?>px) and (min-width: <?php echo esc_attr( $minWidth ); ?>px) {
				.<?php echo esc_html( $datavis ) ?> {
					display: block;
				}
			}
		<?php elseif ( ! empty( $maxWidth ) ) : ?>
			@media screen and (max-width: <?php echo esc_attr( $maxWidth ); ?>px) {
				.<?php echo esc_html( $datavis ) ?> {
					display: block;
				}
			}
		<?php elseif ( ! empty( $minWidth ) ) : ?>
			@media screen and (min-width: <?php echo esc_attr( $minWidth ); ?>px) {
				.<?php echo esc_html( $datavis ) ?> {
					display: block;
				}
			}
		<?php endif; ?>
	</style>
	<div
		class="<?php echo implode( ' ', $classes ); ?>"
		data-datavis="<?php echo esc_attr( $datavis ); ?>"
		data-config="<?php echo esc_attr( $config ); ?>"
	>
		<script id="<?php echo esc_attr( $config ); ?>" type="application/json"><?php echo wp_kses_post( wp_json_encode( $json ) ); ?></script>
		<div id="<?php echo esc_attr( $datavis ); ?>"></div>
	</div>
	<?php
	return (string) ob_get_clean();
}
