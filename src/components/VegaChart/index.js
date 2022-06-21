import React, { useEffect, useMemo, useRef } from 'react';
import vegaEmbed from 'vega-embed';

import sufficientlyUniqueId from '../../util/sufficiently-unique-id';

/**
 * Display a Vega Lite chart.
 *
 * @param {object} props        React component props.
 * @param {object} props.spec   Vega Lite specification object.
 * @param {Array}  [props.data] Optional data property.
 * @returns {React.ReactNode} Node for a container into which chart will be rendered.
 */
const VegaChart = ( { data, spec } ) => {
	const container = useRef( null );

	const id = useMemo( () => sufficientlyUniqueId(), [] );

	useEffect( () => {
		vegaEmbed( `#${ id }`, {
			$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
			...( Array.isArray( data ) ? {
				data: {
					values: data,
				},
			} : ( data ? { data } : {} ) ),
			...spec,
		} );
	}, [ container, id, data, spec ] );

	return (
		<div ref={ container }>
			<div id={ id }></div>
		</div>
	);
};

export default VegaChart;
