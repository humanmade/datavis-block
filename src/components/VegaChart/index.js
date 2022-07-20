import React, { useEffect, useMemo, useRef } from 'react';
import vegaEmbed from 'vega-embed';

import sufficientlyUniqueId from '../../util/sufficiently-unique-id';

/**
 * Display a Vega Lite chart.
 *
 * @param {object} props      React component props.
 * @param {object} props.spec Vega Lite specification object.
 * @returns {React.ReactNode} Node for a container into which chart will be rendered.
 */
const VegaChart = ( { spec } ) => {
	const container = useRef( null );

	const id = useMemo( () => sufficientlyUniqueId(), [] );

	useEffect( () => {
		vegaEmbed( `#${ id }`, {
			$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
			...spec,
		} );
	}, [ container, id, spec ] );

	return (
		<div className="vega-chart" ref={ container }>
			<div id={ id }></div>
		</div>
	);
};

export default VegaChart;
