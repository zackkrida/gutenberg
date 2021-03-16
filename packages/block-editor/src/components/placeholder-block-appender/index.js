/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Button, Tooltip, VisuallyHidden } from '@wordpress/components';
import { forwardRef } from '@wordpress/element';
import { _x, sprintf } from '@wordpress/i18n';
import { Icon, plus } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inserter from '../inserter';
import { store as blockEditorStore } from '../../store';

function PlaceholderBlockAppender(
	{ replaceClientId, className, onFocus, tabIndex },
	ref
) {
	const rootClientId = useSelect(
		( select ) => {
			const { getBlockRootClientId } = select( blockEditorStore );
			return getBlockRootClientId( replaceClientId );
		},
		[ replaceClientId ]
	);
	return (
		<Inserter
			position="bottom center"
			rootClientId={ rootClientId }
			__experimentalIsQuick
			replaceClientId={ replaceClientId }
			renderToggle={ ( {
				onToggle,
				disabled,
				isOpen,
				blockTitle,
				hasSingleBlockType,
			} ) => {
				let label;
				if ( hasSingleBlockType ) {
					label = sprintf(
						// translators: %s: the name of the block when there is only one
						_x( 'Add %s', 'directly add the only allowed block' ),
						blockTitle
					);
				} else {
					label = _x(
						'Add block',
						'Generic label for block inserter button'
					);
				}
				const isToggleButton = ! hasSingleBlockType;

				//TODO: allow a pass through
				let inserterButton = (
					<Button
						ref={ ref }
						onFocus={ onFocus }
						tabIndex={ tabIndex }
						className={ classnames(
							className,
							'block-editor-placeholder-block-appender'
						) }
						onClick={ onToggle }
						aria-haspopup={ isToggleButton ? 'true' : undefined }
						aria-expanded={ isToggleButton ? isOpen : undefined }
						disabled={ disabled }
						label={ label }
					>
						{ ! hasSingleBlockType && (
							<VisuallyHidden as="span">{ label }</VisuallyHidden>
						) }
						<Icon icon={ plus } />
					</Button>
				);

				if ( isToggleButton || hasSingleBlockType ) {
					inserterButton = (
						<Tooltip text={ label }>{ inserterButton }</Tooltip>
					);
				}
				return inserterButton;
			} }
			isAppender
		/>
	);
}

export default forwardRef( PlaceholderBlockAppender );
