/**
 * Edit function for Datavis block.
 */
import classNames from 'classnames';
import React from 'react';

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	TabPanel,
	TextControl,
	PanelBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import SelectChartType from '../../chart-transforms/chart-type';
import { ConditionalEncodingFields } from '../../chart-transforms/encoding';
import ControlledJsonEditor from '../../components/ControlledJsonEditor';
import DatasetEditor from '../../components/DatasetEditor';
import VegaChart from '../../components/VegaChart';

import defaultSpecification from './specification.json';
import './edit-datavis-block.scss';

/**
 * Sidebar panels
 *
 * @param {object} props                 React component props.
 * @param {object} props.json            Vega Lite specification.
 * @param {Function} props.setAttributes Block editor setAttributes function.
 * @param {object} props.attributes      Blocks attributes.
 * @returns {React.ReactNode} Rendered sidebar panel.
 */
const SidebarEditor = ( { json, setAttributes, attributes } ) => {
	// TODO: Load a dataset into the store by URL if the URL in the json isn't in our store already.

	const {
		maxWidth,
		minWidth,
	} = attributes;

	return (
		<InspectorControls>
			<PanelBody
				initialOpen
				title={ __( 'General', 'datavis' ) }
			>
				<TextControl
					label={ __( 'Title', 'datavis' ) }
					value={ json['title'] }
					onChange={ ( title ) => {
						setAttributes( {
							json: {
								...json,
								title,
							},
						} );
					} }
					help={ __( 'Title for the plot.', 'datavis' ) }
				/>
				<SelectChartType json={ json } setAttributes={ setAttributes } />
			</PanelBody>
			<PanelBody title={ __( 'Layout', 'datavis' ) }>
				<ConditionalEncodingFields json={ json } setAttributes={ setAttributes } />
			</PanelBody>
			<PanelBody title={ __( 'Viewport', 'datavis' ) } >
				<TextControl
					label={ __( 'Max Width', 'datavis' ) }
					value={ maxWidth }
					onChange={ ( maxWidth ) => setAttributes( { maxWidth } ) }
					help={ __( 'Max screen width for this chart. Empty is full width.', 'datavis' ) }
				/>
				<TextControl
					label={ __( 'Min Width', 'datavis' ) }
					value={ minWidth }
					onChange={ ( minWidth ) => setAttributes( { minWidth } ) }
					help={ __( 'Min screen width for this chart. Empty is full width.', 'datavis' ) }
				/>
			</PanelBody>
		</InspectorControls>
	);
};

// Tabs to use in the editor view.
const tabs = [
	{
		name: 'spec',
		title: __( 'Chart Specification', 'datavis' ),
		className: 'edit-post-sidebar__panel-tab',
	},
	{
		name: 'data',
		title: __( 'Data', 'datavis' ),
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
 * @param {object}   props.context        Context for the block.
 * @returns {React.ReactNode} Rendered editorial UI.
 * @class
 */
const EditDatavisBlock = ( { attributes, setAttributes, isSelected, context = {} } ) => {
	const blockProps = useBlockProps(),
		{ viewport } = attributes,
		json = attributes.json || defaultSpecification;

	return (
		<div
			{ ...blockProps }
			className={ classNames( blockProps.className, { 'hide-block': ( context[ 'datavis-block/currentViewport' ] !== viewport ) } ) }
		>
			<VegaChart spec={ json } />
			{ isSelected ? (
				<>
					<TabPanel
						className="datavis-block-tabs"
						activeClass="active-tab"
						tabs={ tabs }
					>
						{ ( activeTab ) => {
							if ( activeTab.name === 'spec' ) {
								return (
									<ControlledJsonEditor
										value={ json }
										onChange={ ( json ) => setAttributes( { json } ) }
									/>
								);
							}
							if ( activeTab.name === 'data' ) {
								return (
									<DatasetEditor
										json={ json }
										setAttributes={ setAttributes }
									/>
								);
							}
							return null;
						} }
					</TabPanel>
					<SidebarEditor json={ json } setAttributes={ setAttributes } attributes={ attributes } />
				</>
			) : null }
		</div>
	);
};

export default EditDatavisBlock;
