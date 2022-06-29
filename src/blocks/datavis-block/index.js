/**
 * Implement Datavis block.
 */
import React from 'react';

import blockData from './block.json';
import EditDatavisBlock from './EditDatavisBlock';

export const name = blockData.name;

export const settings = {
	// Apply the block settings from the JSON configuration file.
	...blockData,

	/**
	 * Render the editor UI for this block.
	 *
	 * @returns {React.ReactNode} Editorial interface to display in block editor.
	 */
	edit: EditDatavisBlock,

	/**
	 * Return null on save so rendering can be done in PHP.
	 *
	 * @returns {null} Empty so that server can complete rendering.
	 */
	save() {
		return null;
	},
};
