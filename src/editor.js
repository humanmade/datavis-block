/**
 * Entrypoint for the editor-side bundle. The block-editor-hmr npm package is
 * used to automatically detect and load any block files inside the blocks/
 * directory with hot-reloading enabled.
 */
import { autoloadBlocks } from '@humanmade/webpack-helpers/hmr';

import './store';

import './styles.scss';

/**
 * Callback function to handle DevServer hot updates.
 *
 * @param {object}   context     Webpack ContextModule.
 * @param {Function} loadModules Callback to run on modules in context.
 */
const reloadOnHMRUpdate = ( context, loadModules ) => {
	if ( module.hot ) {
		module.hot.accept( context.id, loadModules );
		console.log( `Accepting updated ${ context.id }` ); // eslint-disable-line
	}
};

autoloadBlocks(
	{
		/**
		 * Load in all files matching ./blocks/{folder name}/index.js
		 *
		 * @returns {object} Webpack ContextModule for matched files.
		 */
		getContext() {
			return require.context( './blocks', true, /index\.js$/ );
		},
	},
	reloadOnHMRUpdate
);
