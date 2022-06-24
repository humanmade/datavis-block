import apiFetch from '@wordpress/api-fetch';
// import { dispatch } from '@wordpress/data';

import asyncThrottle from './throttle';

// const initializeDatasetEntities() {}

/**
 * Get a list of available datasets.
 *
 * @param {object} post Post for which to list datasets.
 * @returns {Promise<object[]>} Promise resolving to array of available datasets.
 */
export const getDatasets = ( post ) => apiFetch( {
	// TODO: Get the collection slug for the relevant post type by using the post object.
	path: `/wp/v2/posts/${ post.id }/datasets`,
} );

/**
 * Get a specific dataset.
 *
 * @param {number} postId   Post on which to find this dataset.
 * @param {string} filename Filename of dataset to load.
 * @returns {Promise<object>} Promise resolving to dataset JSON object.
 */
export const getDataset = ( postId, filename ) => apiFetch( {
	// TODO: Get the collection slug for the relevant post type by using the post object.
	path: `/wp/v2/posts/${ postId }/datasets/${ filename }?format=json`,
} );

/**
 * Get the CSV content of a dataset as a JSON object.
 *
 * @param {string} url URL of remove CSV dataset.
 * @returns {object[]} JSON array representation of the CSV.
 */
export const getCsvAsJson = ( url ) => window.fetch( url )
	.then( ( result ) => result.text() )
	.then( ( csv ) => {
		const [ columns, ...rows ] = csv.split( '\n' ).map( ( row ) => row.split( /,\s*/ ) );
		return rows.map( ( row ) => {
			return row.reduce(
				( memo, val, idx ) => {
					const column = columns[ idx ];
					return {
						...memo,
						[ column ]: val,
					};
				},
				{}
			);
		} );
	} );

/**
 * Create a dataset in the API.
 *
 * @param {object} dataset          Dataset object.
 * @param {string} dataset.filename Dataset filename.
 * @param {string} dataset.content  Dataset CSV contents as string.
 * @param {object} post             Post on which to create the dataset.
 * @param {string} post.type        Type of post object.
 * @returns {Promise<object>} Promise resolving to the created dataset object.
 */
export const createDataset = ( { filename, content }, post ) => apiFetch( {
	// TODO: Get the collection slug for the relevant post type by using the post object.
	path: `/wp/v2/posts/${ post.id }/datasets`,
	method: 'POST',
	data: {
		filename,
		content,
	},
} );

/**
 * Update a dataset in the API.
 *
 * @param {object} dataset          Dataset object.
 * @param {string} dataset.filename Dataset filename.
 * @param {string} dataset.content  Dataset CSV contents as string.
 * @param {object} post             Post on which to create the dataset.
 * @param {string} post.type        Type of post object.
 * @returns {Promise<object>} Promise resolving to the created dataset object.
 */
export const updateDataset = ( { filename, content }, post ) => apiFetch( {
	// TODO: Get the collection slug for the relevant post type by using the post object.
	path: `/wp/v2/posts/${ post.id }/datasets/${ filename }`,
	method: 'POST',
	data: {
		filename,
		content,
	},
} );

/**
 * Delete a dataset in the API.
 *
 * @param {object} dataset          Dataset object.
 * @param {string} dataset.filename Dataset filename.
 * @param {object} post             Post from which to delete the dataset.
 * @param {string} post.id          ID of post object.
 * @returns {Promise<boolean>} Promise resolving to whether dataset got deleted.
 */
export const deleteDataset = ( { filename }, post ) => apiFetch( {
	// TODO: Get the collection slug for the relevant post type by using the post object.
	path: `/wp/v2/posts/${ post.id }/datasets/${ filename }`,
	method: 'DELETE',
} );

// Create debounced versions of all public methods.
[
	getDatasets,
	getDataset,
	createDataset,
	updateDataset,
	deleteDataset,
].forEach( ( method ) => {
	method.throttled = asyncThrottle( method, 200 );
} );
