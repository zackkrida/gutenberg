/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import {
	RichText,
	AlignmentControl,
	InspectorControls,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToggleControl, PanelBody } from '@wordpress/components';
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import LevelControl from './level-toolbar';

export default function SiteTitleEdit( {
	attributes,
	setAttributes,
	insertBlocksAfter,
} ) {
	const { level, textAlign, isLink, linkTarget } = attributes;
	const [ title, setTitle ] = useEntityProp( 'root', 'site', 'title' );
	const TagName = level === 0 ? 'p' : `h${ level }`;
	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	let titleElement = (
		<RichText
			style={ { display: 'inline-block' } }
			aria-label={ __( 'Site title text') }
			placeholder={ __('Write site title…') }
			value={ title }
			onChange={ setTitle }
			allowedFormats={ [] }
			disableLineBreaks
			__unstableOnSplitAtEnd={ () =>
				insertBlocksAfter(
					createBlock( getDefaultBlockName() )
				)
			}
		/>
	);

	if ( isLink ) {
		titleElement = (
			<RichText
				tagName="a"
				href="#site-title-pseudo-link"
				style={ { display: 'inline-block' } }
				aria-label={ __( 'Site title text' ) }
				placeholder={ __( 'Write site title…' ) }
				value={ title }
				onChange={ setTitle }
				allowedFormats={ [] }
				disableLineBreaks
				__unstableOnSplitAtEnd={ () =>
					insertBlocksAfter(
						createBlock( getDefaultBlockName() )
					)
				}
			/>
		);
	}

	return (
		<>
			<BlockControls group="block">
				<LevelControl
					level={ level }
					onChange={ ( newLevel ) =>
						setAttributes( { level: newLevel } )
					}
				/>
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Link settings' ) }>
					<ToggleControl
						label={ __( 'Make title a link to home' ) }
						onChange={ () => setAttributes( { isLink: ! isLink } ) }
						checked={ isLink }
					/>
					{ isLink && (
						<>
							<ToggleControl
								label={ __( 'Open in new tab' ) }
								onChange={ ( value ) =>
									setAttributes( {
										linkTarget: value ? '_blank' : '_self',
									} )
								}
								checked={ linkTarget === '_blank' }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<TagName { ...blockProps }>
				{ titleElement }
			</TagName>
		</>
	);
}
