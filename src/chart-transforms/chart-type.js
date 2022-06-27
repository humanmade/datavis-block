import React, { useCallback } from 'react';

import { __ } from '@wordpress/i18n';
import toDictionary from '../util/to-dictionary';

const options = [
	{
		label: __( 'X/Y plot', 'datavis' ),
		value: 'xy',
		/**
		 * Transform a spec to become an X-Y plot, if not already.
		 *
		 * @param {object} json Vega Lite spec.
		 * @returns {object} Transformed chart spec.
		 */
		transform: ( json ) => {
			if ( ( json?.mark?.type || json?.mark ) !== 'arc' && json?.encoding?.x && json?.encoding?.y ) {
				return json;
			}

			if ( json?.mark?.type || json.mark === 'arc' ) {
				json.mark = { type: 'bar' };
			}

			if ( json.encoding?.theta ) {
				Reflect.deleteProperty( json.encoding, 'theta' );
				if ( ! json.encoding?.x ) {
					json.encoding.x = {
						field: 'unknown',
						type: 'quantitative',
					};
				}
				if ( ! json.encoding?.y ) {
					json.encoding.y = {
						field: 'unknown',
						type: 'quantitative',
					};
				}
			}
		},
		/**
		 * Determine whether this option is currently active in a given spec.
		 *
		 * @param {object} json Vega Lite spec
		 * @returns {boolean} Whether this option is selected in this spec.
		 */
		isActive: ( json ) => {
			if ( ( json?.mark?.type || json?.mark ) === 'arc' ) {
				return false;
			}
			if ( ! json?.encoding?.x || ! json?.encoding?.y ) {
				return false;
			}
			return true;
		},
	},
	{
		label: __( 'Radial plot', 'datavis' ),
		value: 'radial',
		/**
		 * Transform a spec to become a radial plot, if not already.
		 *
		 * @param {object} json Vega Lite spec.
		 * @returns {object} Transformed chart spec.
		 */
		transform: ( json ) => {
			if ( ( json?.mark?.type || json?.mark ) === 'arc' && json?.encoding?.theta ) {
				return json;
			}

			if ( ( json.mark?.type && json.mark?.type !== 'arc' ) || json.mark !== 'arc' ) {
				json.mark = { type: 'arc' };
			}

			if ( json.encoding?.x ) {
				Reflect.deleteProperty( json.encoding, 'x' );
			}

			if ( json.encoding?.y ) {
				Reflect.deleteProperty( json.encoding, 'y' );
			}

			if ( ! json.encoding?.theta ) {
				json.encoding.theta = {
					field: 'unknown',
					type: 'quantitiative',
				};
			}

			// New object ref to alert React to re-render.
			return { ...json };
		},
		setDefault: ( json ) => ( {
			...json,
			mark: {
				type: 'arc',
			},
		} ),
		isActive: ( json ) => ( json.mark?.type || json?.mark ) === 'arc',
	},
];

const optionsByValue = toDictionary( options, 'value' );

/**
 * Helper to determine the type of chart given a JSON spec.
 *
 * @param {object} json Vega Lite specification.
 * @returns {object} The matching option object, or undefined if no match.
 */
export const getChartType = ( json ) => {
	const matchingOption = options.find( ( option ) => option.isActive( json ) );
	return matchingOption?.value || 'error';
};

const SelectChartType = ( { setAttributes, json } ) => {
	const onChange = useCallback( ( chartType ) => {
		const selectedOption = options.find( ( { value } ) => value === chartType );
		if ( ! selectedOption.isActive( json ) ) {

		}
		setAttributes( {
			json:
		} );
	}, [ setAttributes, json ] );
	return (
		<SelectControl
			label={ __( 'Chart type', 'datavis' ) }
			value={ getChartType( json ) }
			options={ options }
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
	);
};
