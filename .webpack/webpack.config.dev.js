const { externals, helpers, presets } = require( '@humanmade/webpack-helpers' );
const vegaExternals = require( './vega-externals' );

const { choosePort, cleanOnExit, filePath } = helpers;

cleanOnExit( [
	filePath( 'build', 'development-asset-manifest.json' ),
] );

module.exports = choosePort( 9090 ).then( ( port ) => presets.development( {
	name: 'datavis-block-editor',
	devServer: {
		server: 'https',
		port,
	},
	externals: {
		...externals,
		...vegaExternals,
	},
	entry: {
		'datavis-block-editor': filePath( 'src/editor.js' ),
		'datavis-block-frontend': filePath( 'src/frontend.js' ),
	},
} ) );
