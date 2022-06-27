/**
 * Edit function for Datavis block.
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	TabPanel,
	TextControl,
	PanelBody,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import ControlledJsonEditor from '../../components/ControlledJsonEditor';
import DatasetEditor from '../../components/DatasetEditor';
import VegaChart from '../../components/VegaChart';
import { getDatasetByUrl } from '../../util/datasets';

import defaultSpecification from './specification.json';
import './edit-datavis-block.scss';

const markOptions = [
	{
		label: __( 'Area', 'datavis' ),
		value: 'area',
	},
	{
		label: __( 'Bar', 'datavis' ),
		value: 'bar',
	},
	{
		label: __( 'Circle', 'datavis' ),
		value: 'circle',
	},
	{
		label: __( 'Line', 'datavis' ),
		value: 'line',
	},
	{
		label: __( 'Point', 'datavis' ),
		value: 'point',
	},
	{
		label: __( 'Rect', 'datavis' ),
		value: 'rect',
	},
	{
		label: __( 'Rule', 'datavis' ),
		value: 'rule',
	},
	{
		label: __( 'Square', 'datavis' ),
		value: 'square',
	},
	{
		label: __( 'Text', 'datavis' ),
		value: 'text',
	},
	{
		label: __( 'Tick', 'datavis' ),
		value: 'tick',
	},
];

/**
 * Sidebar panels
 *
 * @param {object} props                 React component props.
 * @param {object} props.json            Vega Lite specification.
 * @param {Function} props.setAttributes Block editor setAttributes function.
 * @returns {React.ReactNode} Rendered sidebar panel.
 */
const SidebarEditor = ( { json, setAttributes } ) => {

	const [ data, setData ] = useState( [] );

	useEffect( () => {
		if ( ! json?.data?.url ) {
			return;
		}

		getDatasetByUrl( json.data.url ).then( setData );
	}, [ json?.data?.url, setData ] );

	const fieldOptions = useMemo( () => {
		return ( Array.isArray( data ) && data.length > 1 )
			? Object.keys( data[0] ).map( ( field ) => ( {
				label: field,
				value: field,
				field,
				type: ! isNaN( parseFloat( data[1][field] ) ) ? 'quantitative' : 'nominal',
			} ) )
			: [];
	}, [ data ] );

	const getType = useCallback( ( field ) => {
		const matchingField = fieldOptions.find( ( option ) => option.field === field );
		return matchingField?.type || 'quantitative';
	}, [ fieldOptions ] );

	return (
		<InspectorControls>
			<PanelBody
				initialOpen
				title={ __( 'General', 'datavis' ) }
			>
				<TextControl
					label={ __( 'Name', 'datavis' ) }
					value={ json['name'] }
					onChange={ ( name ) => {
						setAttributes( {
							json: {
								...json,
								name,
							},
						} );
					} }
					help={ __( 'Name of the visualization for later reference.', 'datavis' ) }
				/>
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
				<TextControl
					label={ __( 'Description', 'datavis' ) }
					value={ json['description'] }
					onChange={ ( description ) => {
						setAttributes( {
							json: {
								...json,
								description,
							},
						} );
					} }
					help={ __( 'Description of this mark for commenting purpose.', 'datavis' ) }
				/>
			</PanelBody>
			<PanelBody title={ __( 'Layout', 'datavis' ) }>
				<SelectControl
					label={ __( 'Mark', 'datavis' ) }
					value={ json.mark?.type || json.mark }
					options={ markOptions }
					onChange={ ( mark ) => {
						setAttributes( {
							json: {
								...json,
								mark: {
									...( typeof json.mark === 'object' ? json.mark : {} ),
									type: mark,
									tooltip: true,
								},
							},
						} );
					} }
				/>
				{ data.length < 1 ? null : (
					<>
						<SelectControl
							label={ __( 'X Axis Field', 'datavis' ) }
							value={ json?.encoding?.x?.field }
							options={ fieldOptions }
							onChange={ ( field ) => {
								setAttributes( {
									json: {
										...json,
										encoding: {
											...json.encoding,
											x: {
												...json.x,
												field,
												type: getType( field ),
											},
										},
									},
								} );
							} }
						/>
						<SelectControl
							label={ __( 'Y Axis Field', 'datavis' ) }
							value={ json?.encoding?.y?.field }
							options={ fieldOptions }
							onChange={ ( field ) => {
								setAttributes( {
									json: {
										...json,
										encoding: {
											...json.encoding,
											y: {
												...json.y,
												field,
												type: getType( field ),
											},
										},
									},
								} );
							} }
						/>
						<SelectControl
							label={ __( 'Color', 'datavis' ) }
							value={ json?.encoding?.color?.field || 'none' }
							options={ [ {
								label: 'None',
								value: 'none',
							} ].concat( fieldOptions ) }
							onChange={ ( field ) => {
								setAttributes( {
									json: {
										...json,
										encoding: {
											...json.encoding,
											color: field !== 'none'
												? {
													...json.color,
													field,
													type: getType( field ),
													legend: null,
												}
												: undefined,
										},
									},
								} );
							} }
						/>
					</>
				) }
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
 * @returns {React.ReactNode} Rendered editorial UI.
 * @class
 */
const EditDatavisBlock = ( { attributes, setAttributes, isSelected } ) => {
	const blockProps = useBlockProps();
	const json = attributes.json || defaultSpecification;

	return (
		<div { ...blockProps }>
			<VegaChart spec={ json } />
			{ isSelected ? (
				<>
					<TabPanel
						className="datavis-block-tabs"
						activeClass="active-tab"
						tabs={ tabs }
					>
						{ ( activeTab ) => {
							// if ( activeTab.name === 'spec' ) {
							// 	return (
							// 		<ControlledJsonEditor
							// 			value={ json }
							// 			onChange={ ( json ) => setAttributes( { json } ) }
							// 		/>
							// 	);
							// }
							// if ( activeTab.name === 'data' ) {
							return (
								<DatasetEditor
									json={ json }
									setAttributes={ setAttributes }
								/>
							);
							// }
							// return null;
						} }
					</TabPanel>
					<SidebarEditor json={ json } setAttributes={ setAttributes } />
				</>
			) : null }
		</div>
	);
};

export default EditDatavisBlock;
