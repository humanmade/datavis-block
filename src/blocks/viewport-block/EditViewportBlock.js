/**
 * Edit function for Datavis block.
 */
import React from 'react';

import {
	useBlockProps,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Tabs to use in the editor view.
const viewportTabs = [
	{
		name: 'desktop',
		title: __( 'Desktop', 'datavis' ),
		className: 'edit-post-sidebar__panel-tab',
	},
	{
		name: 'tablet',
		title: __( 'Tablet', 'datavis' ),
		className: 'edit-post-sidebar__panel-tab',
	},
];

/**
 * Editor UI component for the datavis block.
 *
 * @param {object}   props               React component props.
 * @param {object}   props.attributes    The attributes for the selected block.
 * @param {Function} props.setAttributes The attributes setter for the selected block.
 * @param {boolean}  props.isSelected    Whether the block is selected in the editor.
 * @returns {React.ReactNode} Rendered editorial UI.
 * @class
 */
const EditViewportBlock = ( { attributes, setAttributes, isSelected } ) => {
	const blockProps = useBlockProps();

	const VIEWPORT_TEMPLATE = [
		[ 'datavis-block/datavis-block', { class: 'test' } ],
		[ 'datavis-block/datavis-block' ],
		[ 'datavis-block/datavis-block' ],
	];

	return (
		<div { ...blockProps }>
			<TabPanel
				className="datavis-block-tabs"
				activeClass="active-tab-viewport"
				tabs={ viewportTabs }
			>
				{ ( activeTabViewport ) => {
					switch ( activeTabViewport.name ) {
						case 'desktop':
							return ;
						case 'tablet':
							return null;
						default:
							return null;
					}
				} }
			</TabPanel>
			<InnerBlocks
				allowedBlocks={ [ 'datavis-block/datavis-block' ] }
				template={ VIEWPORT_TEMPLATE }
				templateLock="all"
			/>
		</div>
	);
};

export default EditViewportBlock;
