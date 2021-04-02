/**
 * External dependencies
 */
import { includes } from 'lodash';

/**
 * Internal dependencies
 */
import hiddenCaretRangeFromPoint from './hidden-caret-range-from-point';

/**
 * Places the caret at start or end of a given element.
 *
 * @param {Object}  $1           Named parameters.
 * @param {Element} $1.container Focusable element.
 * @param {boolean} $1.isReverse True for end, false for start.
 * @param {DOMRect} $1.x         Optional. The x position to place the caret.
 * @param {boolean} $1.__unstableMayScroll
 */
export default function placeCaretAtEdge( {
	container,
	isReverse,
	x,
	__unstableMayScroll,
} ) {
	if ( ! container ) {
		return;
	}

	container.focus();

	if ( includes( [ 'INPUT', 'TEXTAREA' ], container.tagName ) ) {
		// The element may not support selection setting.
		if ( typeof container.selectionStart !== 'number' ) {
			return;
		}

		if ( isReverse ) {
			container.selectionStart = container.value.length;
			container.selectionEnd = container.value.length;
		} else {
			container.selectionStart = 0;
			container.selectionEnd = 0;
		}

		return;
	}

	if ( ! container.isContentEditable ) {
		return;
	}

	const { ownerDocument } = container;
	const containerRect = container.getBoundingClientRect();
	// When placing at the end (isReverse), find the closest range to the bottom
	// (right corner). When placing at the start, to the top (left corner).
	x = x || ( isReverse ? containerRect.right - 1 : containerRect.left + 1 );
	const y = isReverse ? containerRect.bottom - 1 : containerRect.top + 1;
	const range = hiddenCaretRangeFromPoint( ownerDocument, x, y, container );

	// If no range range can be created or it is outside the container, the
	// element may be out of view.
	if (
		! range ||
		! range.startContainer ||
		! container.contains( range.startContainer )
	) {
		if ( ! __unstableMayScroll ) {
			return;
		}

		container.scrollIntoView( isReverse );
		placeCaretAtEdge( {
			container,
			isReverse,
			x,
			// Only try to scroll into view once to avoid an infinite loop.
			__unstableMayScroll: false,
		} );
		return;
	}

	const { defaultView } = ownerDocument;
	const selection = defaultView.getSelection();
	selection.removeAllRanges();
	selection.addRange( range );
}
