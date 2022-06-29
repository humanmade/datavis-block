const { externals, helpers, presets } = require( '@humanmade/webpack-helpers' );
const vegaExternals = require( './vega-externals' );

const { choosePort, cleanOnExit, filePath } = helpers;

cleanOnExit( [
	filePath( 'build', 'development-asset-manifest.json' ),
] );

module.exports = choosePort( 9090 ).then( ( port ) => [
	presets.development( {
		name: 'datavis-block-editor',
		devServer: {
			host: 'localhost',
			client: {
				overlay: false,
			},
			port,
		},
		externals: {
			...externals,
			...vegaExternals,
		},
		entry: {
			'datavis-block-editor': filePath( 'src/editor.js' ),
		},
	} ),
	presets.development( {
		name: 'datavis-block-frontend',
		devServer: {
			host: 'localhost',
			client: {
				overlay: false,
			},
			port,
		},
		externals: vegaExternals,
		entry: {
			'datavis-block-frontend': filePath( 'src/frontend.js' ),
		},
	} ),
] ).then( configs => {
	configs.forEach( ( config, idx ) => {
		if ( idx !== 0 ) {
			Reflect.deleteProperty( config, 'devServer' );
			if ( config.output.path === configs[0].output.path ) {
				config.output.publicPath = configs[0].output.publicPath;
			}
		}
	} );
	return configs;
} );
