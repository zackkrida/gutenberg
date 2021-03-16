/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { create as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';

const { name } = metadata;
export { metadata, name };

export const settings = {
	title: _x( 'Block Placeholder', 'block placeholder' ),
	description: __(
		'A block placeholder to quickly add blocks. Click on it to replace it with a specific block.'
	),
	icon,
	edit,
};
