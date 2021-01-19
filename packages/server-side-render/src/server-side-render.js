/**
 * External dependencies
 */
import { debounce, isEqual } from 'lodash';

/**
 * WordPress dependencies
 */
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { usePrevious } from '@wordpress/compose';
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
		EmptyResponsePlaceholder = DefaultEmptyResponsePlaceholder,
		ErrorResponsePlaceholder = DefaultErrorResponsePlaceholder,
		LoadingResponsePlaceholder = DefaultLoadingResponsePlaceholder,
	} = props;

	const [ response, setResponse ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( false );
	const isMounted = useRef( true );
	const fetchRequestRef = useRef( null );

	useEffect( () => {
		fetchData();

		fetchData = debounce( fetchData, 500 );
		return () => {
			isMounted.current = false;
		};
	}, [] );

	const prevProps = usePrevious( props );
	useEffect( () => {
		if ( ! isEqual( prevProps, props ) ) {
			fetchData();
		}
	} );

	function fetchData() {
		if ( ! isMounted.current ) {
			return;
		}
		setIsLoading( true );
		const {
			block,
			attributes = null,
			httpMethod = 'GET',
			urlQueryArgs = {},
		} = props;

		// If httpMethod is 'POST', send the attributes in the request body instead of the URL.
		// This allows sending a larger attributes object than in a GET request, where the attributes are in the URL.
		const isPostRequest = 'POST' === httpMethod;
		const urlAttributes = isPostRequest ? null : attributes;
		const path = rendererPath( block, urlAttributes, urlQueryArgs );
		const data = isPostRequest ? { attributes } : null;

		// Store the latest fetch request so that when we process it, we can
		// check if it is the current request, to avoid race conditions on slow networks.
		const fetchRequest = ( fetchRequestRef.current = apiFetch( {
			path,
			data,
			method: isPostRequest ? 'POST' : 'GET',
		} )
			.then( ( fetchResponse ) => {
				if (
					isMounted.current &&
					fetchRequest === fetchRequestRef.current &&
					fetchResponse
				) {
					setResponse( fetchResponse.rendered );
					setIsLoading( false );
				}
			} )
			.catch( ( error ) => {
				if (
					isMounted.current &&
					fetchRequest === fetchRequestRef.current
				) {
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
				<RawHTML className={ className }>{ response }</RawHTML>
			</LoadingResponsePlaceholder>
		);
	}
	if ( response?.error ) {
		return <ErrorResponsePlaceholder response={ response } { ...props } />;
	}

	return <RawHTML className={ className }>{ response }</RawHTML>;
}

export function DefaultEmptyResponsePlaceholder( { className } ) {
	return (
		<Placeholder className={ className }>
			{ __( 'Block rendered as empty.' ) }
		</Placeholder>
	);
}

export function DefaultErrorResponsePlaceholder( { response, className } ) {
	const errorMessage = sprintf(
		// translators: %s: error message describing the problem
		__( 'Error loading block: %s' ),
		response.errorMsg
	);
	return <Placeholder className={ className }>{ errorMessage }</Placeholder>;
}

export function DefaultLoadingResponsePlaceholder( { children } ) {
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
}

export default ServerSideRender;
