/**
 * Implement Datavis block.
 */
import React from 'react';

import {
	InnerBlocks,
} from '@wordpress/block-editor';

import blockData from './block.json';
import EditViewportBlock from './EditViewportBlock';

export const name = blockData.name;

export const settings = {
	// Apply the block settings from the JSON configuration file.
	...blockData,

	/**
	 * Render the editor UI for this block.
	 *
	 * @returns {React.ReactNode} Editorial interface to display in block editor.
	 */
	edit: EditViewportBlock,

	/**
	 * Return null on save so rendering can be done in PHP.
	 *
	 * @returns {null} Empty so that server can complete rendering.
	 */
	save: ( { ...props } ) => {
		const { attributes, innerBlocks } = props;
		const { items } = attributes;

		return <InnerBlocks.Content />;
	},
};
