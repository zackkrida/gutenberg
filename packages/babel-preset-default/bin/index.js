#!/usr/bin/env node

require( 'core-js-builder' )( {
	modules: [ 'es', 'web' ],
	// core-js is extremely conservative in which polyfills to include.
	// Knowing about tiny browser implementation bugs that anyone rarely cares about,
	// we prevent some features from having the full polyfill included.
	// @see https://github.com/WordPress/gutenberg/pull/31279
	exclude: [ 'es.promise' ],
	targets: require( '@wordpress/browserslist-config' ),
	filename: './dist/polyfill.js',
} ).catch( ( error ) => {
	// eslint-disable-next-line no-console
	console.log( error );
	process.exit( 1 );
} );
