import React from 'react';

import {
	useBlockProps,
} from '@wordpress/block-editor';

/**
 *
 */
const SaveDatavisBlock = ( { attributes } ) => {
	const blockProps = useBlockProps.save(),
		datavis = 'datavis' + blockProps.id,
		config = 'config' + blockProps.id;

	return (
		<div { ...blockProps }
			className="datavis-block"
			data-datavis={ datavis }
			data-config={ config }
		>
			<script id={ config }
			        type="application/json">{ attributes.json }</script>
			<div id={ datavis }>
			</div>
		</div>
	);
};

export default SaveDatavisBlock;
