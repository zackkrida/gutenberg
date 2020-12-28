/**
 * WordPress dependencies
 */
import { html as icon } from '@wordpress/icons';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

export { metadata, name };

export const settings = {
	title: _x( 'Custom HTML', 'block title' ),
	description: __( 'Add custom HTML code and preview it as you edit.' ),
	icon,
	keywords: [ __( 'embed' ) ],
	example: {
		attributes: {
			content:
				'<marquee>' +
				__( 'Welcome to the wonderful world of blocks…' ) +
				'</marquee>',
		},
	},
	edit,
	save,
	transforms,
};
