/* eslint-disable no-console */
import React, { useCallback, useEffect, useState, useMemo } from 'react';

// eslint-disable-next-line
import { TextControl, SelectControl, TextareaControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { getDataset, getDatasets, updateDataset } from '../util/datasets';

const INLINE = 'inline';

const defaultDatasets = [];

/**
 * Render an editor for a specific CSV file.
 *
 * @param {object} props          React component props.
 * @param {string} props.filename Filename of CSV being edited.
 * @param {number} props.postId   ID of post being edited.
 * @returns {React.ReactNode} Rendered react UI.
 */
const CSVEditor = ( { filename, postId } ) => {
	const [ datasetContent, setDatasetContent ] = useState( '' );

	useEffect( () => {
		if ( filename !== INLINE && ! datasetContent ) {
			getDataset( postId, filename ).then( ( dataset ) => {
				if ( dataset.content ) {
					setDatasetContent( dataset.content );
				}
			} );
		}
	}, [ datasetContent, postId, filename, setDatasetContent ] );

	useEffect( () => {
		if ( datasetContent && filename ) {
			updateDataset( {
				filename,
				content: datasetContent,
			}, { id: postId } );
		}
	}, [ datasetContent, postId, filename ] );

	return (
		<TextareaControl
			label="Text"
			help="Enter some text"
			value={ datasetContent }
			onChange={ setDatasetContent }
		/>
	);
};

/**
 * Render the Data Editor form.
 *
 * @param {object} props               React component props.
 * @param {object} props.json          Vega spec being edited.
 * @param {object} props.setAttributes Block editor setAttributes method.
 * @returns {React.ReactNode} Rendered form.
 */
const DatasetEditor = ( { json, setAttributes } ) => {
	const [ datasets, setDatasets ] = useState( defaultDatasets );
	const [ selectedDataset, setSelectedDataset ] = useState( INLINE );

	const { postId } = useSelect( ( select ) => ( {
		postId: select( 'core/editor' ).getEditedPostAttribute( 'id' ),
	} ) );

	useEffect( () => {
		if ( ! datasets.length ) {
			getDatasets( { id: postId } ).then( ( datasetList ) => {
				setDatasets( datasetList );
			} );
		}
	}, [ datasets, postId ] );

	const options = useMemo( () => {
		return [ {
			label: __( 'Inline data' ),
			value: INLINE,
		} ].concat( datasets.map( ( dataset ) => ( {
			label: dataset.filename,
			value: dataset.filename,
		} ) ) ).filter( Boolean );
	}, [ datasets ] );

	const onChangeSelected = useCallback( ( selected ) => {
		setSelectedDataset( selected );
		const selectedDatasetObj = datasets.find( ( dataset ) => dataset.filename === selected );
		if ( selected === INLINE || ! selectedDatasetObj || ! selectedDatasetObj.url ) {
			if ( json.data?.url ) {
				// Wipe out any URL property to set back to inline mode.
				json.data = [];
				setAttributes( { json: { ...json } } );
			}
			return;
		}

		json.data = { url: selectedDatasetObj.url };
		setAttributes( { json: { ...json } } );
	}, [ datasets, json, setAttributes ] );

	return (
		<div>
			<SelectControl
				label={ __( 'Datasets' ) }
				value={ selectedDataset }
				options={ options }
				onChange={ onChangeSelected }
			/>
			<small><em>Todo: "new" button (which would show a form to enter the [required] 'filename'); "delete" button (low priority)</em></small>

			{ selectedDataset !== INLINE ? (
				<CSVEditor
					postId={ postId }
					filename={ selectedDataset }
				/>
			) : (
				<p>Edit values in the Specification Editor</p>
			) }

			<p>Selected: { selectedDataset }</p>
		</div>
	);
};

export default DatasetEditor;