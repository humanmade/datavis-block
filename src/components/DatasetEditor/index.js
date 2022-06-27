/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useCallback, useEffect, useState, useMemo } from 'react';

// eslint-disable-next-line
import { Icon, TextControl, Button, PanelRow, SelectControl, TextareaControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

// eslint-disable-next-line
import { createDataset, deleteDataset, getDataset, getDatasets, updateDataset } from '../../util/datasets';
import { getSelectedDatasetFromSpec } from '../../util/spec';
import './dataset-editor.scss';
import FileDropZone from '../FileDropZone';

const INLINE = 'inline';

const defaultDatasets = [];

/** No-op function for use as argument default. */
const noop = () => {};

/**
 * Render an editor for a specific CSV file.
 *
 * TODO: Refactor to receive a full dataset object instead of only the content string.
 *
 * @param {object}   props          React component props.
 * @param {string}   props.filename Filename of CSV being edited.
 * @param {Function} props.onSave   Callback to run when CSV changes.
 * @returns {React.ReactNode} Rendered react UI.
 */
const CSVEditor = ( { filename, onSave = noop } ) => {
	const dataset = useSelect( ( select ) => select( 'csv-datasets' ).getDataset( filename ) );
	const { updateDataset } = useDispatch( 'csv-datasets' );
	const [ content, setCsvContent ] = useState( dataset?.content || '' );

	const onDrop = useCallback( ( { content } ) => {
		setCsvContent( content );
	}, [] );

	const onSaveButton = useCallback( () => {
		if ( filename ) {
			updateDataset( {
				filename,
				content: content,
			} ).then( onSave );
		}
	}, [ filename, content, updateDataset, onSave ] );

	return (
		<FileDropZone
			message={ __( 'Drop CSV to load data', 'datavis' ) }
			onDrop={ onDrop }
		>
			<TextareaControl
				label={ __( 'Edit CSV dataset', 'datavis' ) }
				value={ content || '' }
				onChange={ setCsvContent }
			/>
			<Button className="is-primary" onClick={ onSaveButton }>
				{ __( 'Save', 'datavis' ) }
			</Button>
		</FileDropZone>
	);
};

/**
 * Render a New Dataset form.
 *
 * @param {object} props              React component props.
 * @param {object} props.onAddDataset Callback after new dataset gets saved.
 * @returns {React.ReactNode} Rendered form.
 */
const NewDatasetForm = ( { onAddDataset } ) => {
	const [ filename, setFilename ] = useState( '' );
	const [ hasFormError, setHasFormError ] = useState( false );
	const { createDataset } = useDispatch( 'csv-datasets' );

	const onChangeContent = useCallback( ( content ) => {
		setFilename( content );
		setHasFormError( false );
	}, [ setFilename, setHasFormError ] );

	const onSubmit = useCallback( () => {
		if ( ! filename.trim() ) {
			setHasFormError( true );
			return;
		}
		createDataset( { filename } ).then( onAddDataset );
	}, [ filename, createDataset, onAddDataset ] );

	const submitOnEnter = useCallback( ( evt ) => {
		if ( evt.code === 'Enter' ) {
			onSubmit();
		}
	}, [ onSubmit ] );

	return (
		<>
			<PanelRow className="datasets-control-row">
				<TextControl
					label={ __( 'CSV dataset name', 'datavis' ) }
					value={ filename }
					onChange={ onChangeContent }
					onKeyDown={ submitOnEnter }
				/>
				<Button
					className="dataset-control-button is-primary"
					onClick={ onSubmit }
				>{ __( 'Save dataset', 'dataset' ) }</Button>
			</PanelRow>
			{ hasFormError ? (
				<p class="dataset-form-error"><em>Name is required when creating a dataset.</em></p>
			) : null }
		</>
	);
};

const inlineDataOption = {
	label: __( 'Inline data', 'datavis' ),
	value: INLINE,
};

/**
 * Render a dropdown UI for selecting or adding datasets.
 *
 * @param {object}   props          React component props.
 * @param {object[]} props.options  Selectable options.
 * @param {object}   props.selected Selected option object (by reference)
 * @param {Function} props.onSelect Callback which gets passed the selected option object.
 * @param {Function} props.onDelete Callback which gets passed the dataset to be deleted.
 * @param {Function} props.onAddNew Callback which gets called when the "new" button is clicked.
 * @returns {React.ReactNode} Rendered component.
 */
const DatasetSelector = ( { options, selected, onSelect, onDelete, onAddNew } ) => {
	const onSelectOption = useCallback( ( selectedOption ) => {
		onSelect( options.find( ( { value } ) => value === selectedOption ) );
	}, [ options, onSelect ] );

	// eslint-disable-next-line
	console.log( { options, selected, onSelect, onDelete, onAddNew, onSelectOption } );

	return (
		<PanelRow className="datasets-control-row">
			<SelectControl
				label={ __( 'Datasets', 'datavis' ) }
				value={ selected.value }
				options={ options }
				onChange={ onSelectOption }
			/>
			{ selected !== INLINE ? (
				<Button
					className="dataset-control-button is-tertiary is-destructive"
					onClick={ onDelete }
				>
					<Icon icon="trash" />
					<span className="screen-reader-text">
						{ __( 'Delete dataset', 'datavis' ) }
					</span>
				</Button>
			) : null }
			<Button
				className="dataset-control-button is-primary"
				onClick={ onAddNew }
			>
				{ __( 'New dataset', 'datavis' ) }
			</Button>
		</PanelRow>
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
	// const [ selectedDataset, setSelectedDataset ] = useState( INLINE );
	const [ isAddingNewDataset, setIsAddingNewDataset ] = useState( false );

	const datasets = useSelect( ( select ) => select( 'csv-datasets' ).getDatasets() );
	const { createDataset, updateDataset, deleteDataset } = useDispatch( 'csv-datasets' );
	const options = useMemo( () => [ inlineDataOption ].concat( datasets ), [ datasets ] );
	const [ dataset, setDataset ] = useState( getSelectedDatasetFromSpec( datasets, json, inlineDataOption ) );

	// eslint-disable-next-line
	console.log( { datasets, options, dataset } );

	const onAddNew = useCallback( async ( filename ) => {
		await createDataset( { filename } );
	}, [ createDataset ] );

	return (
		<div>
			{ isAddingNewDataset ? (
				<NewDatasetForm onAddDataset={ ( newDataset ) => console.log( { newDataset } ) } />
			) : (
				<DatasetSelector
					options={ options }
					selected={ dataset }
					onSelect={ setDataset }
					onDelete={ () => console.log( { dataset } ) }
					onAddNew={ () => setIsAddingNewDataset( true ) }
				/>
			) }

			{ isAddingNewDataset ? null : (
				dataset.value !== INLINE ? (
					<CSVEditor
						filename={ dataset.filename }
						onSave={ () => console.log( 'dataset updated' ) }
					/>
				) : (
					<p>{ __( 'Edit data values as JSON in the Chart Specification tab.', 'datavis' ) }</p>
				)
			) }
		</div>
	);

	// // Select the appropriate
	// useEffect( () => {
	// 	if ( json?.data?.url ) {
	// 		const activeDataset = datasets.find( ( { url } ) => url === json.data.url );
	// 		if ( activeDataset ) {
	// 			setOption( activeDataset );
	// 		}
	// 	}
	// }, [ datasets, json?.data?.url ] );

	// // TODO: When content is empty, switching from another dataset does not refresh the text area.

	// const onChangeSelected = useCallback( ( selected ) => {
	// 	setSelectedDataset( selected );
	// 	const selectedDatasetObj = datasets.find( ( dataset ) => dataset.filename === selected );
	// 	if ( selected === INLINE || ! selectedDatasetObj || ! selectedDatasetObj.url ) {
	// 		if ( json.data?.url ) {
	// 			// Wipe out any URL property to set back to inline mode.
	// 			json.data = [];
	// 			setAttributes( { json: { ...json } } );
	// 		}
	// 		return;
	// 	}

	// 	json.data = { url: selectedDatasetObj.url };
	// 	setAttributes( { json: { ...json } } );
	// }, [ datasets, json, setAttributes ] );

	// const forceChartUpdate = useCallback( () => {
	// 	setAttributes( {
	// 		json: { ...json },
	// 	} );
	// }, [ json, setAttributes ] );

	// const onAddNewDataset = useCallback( ( result ) => {
	// 	setIsAddingNewDataset( false );
	// 	if ( result && result.filename ) {
	// 		setSelectedDataset( result.filename );
	// 	}
	// }, [ setIsAddingNewDataset, setSelectedDataset ] );

	// const { deleteDataset } = useDispatch( 'csv-datasets' );
	// const onDeleteDataset = useCallback( () => {
	// 	if ( selectedDataset !== INLINE ) {
	// 		deleteDataset( { filename: selectedDataset } );
	// 		setSelectedDataset( INLINE );
	// 	}
	// }, [ selectedDataset, deleteDataset ] );

	// return (
	// 	<div>
	// 		{ isAddingNewDataset ? (
	// 			<NewDatasetForm onAddDataset={ onAddNewDataset } />
	// 		) : (
	// 			<PanelRow className="datasets-control-row">
	// 				<SelectControl
	// 					label={ __( 'Datasets', 'datavis' ) }
	// 					value={ selectedDataset }
	// 					options={ options }
	// 					onChange={ onChangeSelected }
	// 				/>
	// 				{ selectedDataset !== INLINE ? (
	// 					<Button
	// 						className="dataset-control-button is-tertiary is-destructive"
	// 						onClick={ onDeleteDataset }
	// 					>
	// 						<Icon icon="trash" />
	// 						<span className="screen-reader-text">
	// 							{ __( 'Delete dataset', 'datavis' ) }
	// 						</span>
	// 					</Button>
	// 				) : null }
	// 				<Button
	// 					className="dataset-control-button is-primary"
	// 					onClick={ () => setIsAddingNewDataset( true ) }
	// 				>
	// 					{ __( 'New dataset', 'datavis' ) }
	// 				</Button>
	// 			</PanelRow>
	// 		) }

	// 		{ /* { isAddingNewDataset ? null : (
	// 			selectedDataset !== INLINE ? (
	// 				<CSVEditor
	// 					filename={ selectedDataset }
	// 					onSave={ forceChartUpdate }
	// 				/>
	// 			) : (
	// 				<p>{ __( 'Edit data values as JSON in the Chart Specification tab.', 'datavis' ) }</p>
	// 			)
	// 		) } */ }
	// 	</div>
	// );
};

/**
 * Transform a Vega Lite spec to set a new data source.
 *
 * @param {object} json Vega Lite spec object.
 * @param {string} datasetUrl URL of a remote dataset.
 * @returns {object} Transformed vega spec (new object reference).
 */
const setSpecDataset = ( json, datasetUrl ) => {
	if ( datasetUrl && datasetUrl !== INLINE ) {
		json.data = { url: datasetUrl };
	} else {
		// No URL. Switch to inline data.
		if ( json.data?.url ) {
			// Wipe out any URL property to set back to inline mode.
			json.data = [];
		}
	}
	return { ...json };
};

/**
 * Render the Data Editor selector.
 *
 * This component doesn't use local state: all changes are persisted directly to
 * the Vega Lite JSON spec being edited.
 *
 * @param {object} props               React component props.
 * @param {object} props.json          Vega spec being edited.
 * @param {object} props.setAttributes Block editor setAttributes method.
 * @returns {React.ReactNode} Rendered form.
 */
const SelectDataset = ( { json, setAttributes } ) => {
	const datasets = useSelect( ( select ) => select( 'csv-datasets' ).getDatasets() );
	const selectedDataset = getSelectedDatasetFromSpec( datasets, json, inlineDataOption );
	const options = useMemo( () => [ inlineDataOption ].concat( datasets ), [ datasets ] );

	const onChangeSelected = useCallback( ( filename ) => {
		const selectedDataset = options.find( ( { value } ) => value === filename );
		const updatedSpec = setSpecDataset( json, selectedDataset?.url || INLINE );
		setAttributes( { json: updatedSpec } );
	}, [ options, json, setAttributes ] );

	return (
		<SelectControl
			label={ __( 'Datasets', 'datavis' ) }
			value={ selectedDataset?.value }
			options={ options }
			onChange={ onChangeSelected }
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
const SimplerDatasetEditor = ( { json, setAttributes } ) => {
	const [ isAddingNewDataset, setIsAddingNewDataset ] = useState( false );

	const onAddDataset = useCallback( ( newDataset ) => {
		const updatedSpec = setSpecDataset( json, newDataset?.url || INLINE );
		setAttributes( { json: updatedSpec } );
		setIsAddingNewDataset( false );
	}, [ json, setAttributes ] );

	return (
		<>
			{ isAddingNewDataset ? (
				<NewDatasetForm onAddDataset={ onAddDataset } />
			) : (
				<PanelRow className="datasets-control-row">
					<SelectDataset json={ json } setAttributes={ setAttributes } />
					<Button
						className="dataset-control-button is-primary"
						onClick={ () => setIsAddingNewDataset( true ) }
					>
						{ __( 'New dataset', 'datavis' ) }
					</Button>
				</PanelRow>
			) }
		</>
	);
};

export default SimplerDatasetEditor;
