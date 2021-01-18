/**
 * External dependencies
 */
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { Placeholder, Spinner } from '@wordpress/components';

export function rendererPath( block, attributes = null, urlQueryArgs = {} ) {
	return addQueryArgs( `/wp/v2/block-renderer/${ block }`, {
		context: 'edit',
		...( null !== attributes ? { attributes } : {} ),
		...urlQueryArgs,
	} );
}

export function ServerSideRender( props ) {
	const {
		className,
		EmptyResponsePlaceholder,
		ErrorResponsePlaceholder,
		LoadingResponsePlaceholder,
	} = props;

	const [ response, setResponse ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( false );
	const isMounted = useRef( true );

	useEffect( () => {
		fetchData( props );

		fetchData = debounce( fetchData, 500 );
		return () => {
			isMounted.current = false;
		};
	}, [] );

	useEffect( () => {
		fetchData( props );
	}, [ props ] );

	function fetchData( options ) {
		if ( ! isMounted ) {
			return;
		}
		setIsLoading( true );
		const {
			block,
			attributes = null,
			httpMethod = 'GET',
			urlQueryArgs = {},
		} = options;

		// If httpMethod is 'POST', send the attributes in the request body instead of the URL.
		// This allows sending a larger attributes object than in a GET request, where the attributes are in the URL.
		const isPostRequest = 'POST' === httpMethod;
		const urlAttributes = isPostRequest ? null : attributes;
		const path = rendererPath( block, urlAttributes, urlQueryArgs );
		const data = isPostRequest ? { attributes } : null;
		let currentFetchRequest = null;

		// Store the latest fetch request so that when we process it, we can
		// check if it is the current request, to avoid race conditions on slow networks.
		const fetchRequest = ( currentFetchRequest = apiFetch( {
			path,
			data,
			method: isPostRequest ? 'POST' : 'GET',
		} )
			.then( ( fetchResponse ) => {
				if (
					isMounted &&
					fetchRequest === currentFetchRequest &&
					fetchResponse
				) {
					setResponse( fetchResponse.rendered );
					setIsLoading( false );
				}
			} )
			.catch( ( error ) => {
				if ( isMounted && fetchRequest === currentFetchRequest ) {
					setResponse( {
						error: true,
						errorMsg: error.message,
					} );
					setIsLoading( false );
				}
			} ) );
		return fetchRequest;
	}

	if ( response === '' ) {
		return <EmptyResponsePlaceholder response={ response } { ...props } />;
	}
	if ( isLoading ) {
		return (
			<LoadingResponsePlaceholder>
				<RawHTML key="html" className={ className }>
					{ response }
				</RawHTML>
			</LoadingResponsePlaceholder>
		);
	}
	if ( response?.error ) {
		return <ErrorResponsePlaceholder response={ response } { ...props } />;
	}

	return (
		<RawHTML key="html" className={ className }>
			{ response }
		</RawHTML>
	);
}

ServerSideRender.defaultProps = {
	spinnerLocation: { right: 0, top: 10, unit: 'px' },
	EmptyResponsePlaceholder: ( { className } ) => (
		<Placeholder className={ className }>
			{ __( 'Block rendered as empty.' ) }
		</Placeholder>
	),
	ErrorResponsePlaceholder: ( { response, className } ) => {
		const errorMessage = sprintf(
			// translators: %s: error message describing the problem
			__( 'Error loading block: %s' ),
			response.errorMsg
		);
		return (
			<Placeholder className={ className }>{ errorMessage }</Placeholder>
		);
	},
	LoadingResponsePlaceholder: ( { children } ) => {
		return (
			<div style={ { position: 'relative' } }>
				<div
					style={ {
						position: 'absolute',
						top: '10px',
						right: '0',
					} }
				>
					<Spinner />
				</div>
				{ children }
			</div>
		);
	},
};

export default ServerSideRender;
