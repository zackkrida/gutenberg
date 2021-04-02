/**
 * Internal dependencies
 */
import placeCaretAtEdge from './place-caret-at-edge';

/**
 * Places the caret at start or end of a given element.
 *
 * @param {Element} container Focusable element.
 * @param {boolean} isReverse True for end, false for start.
 */
export default function placeCaretAtHorizontalEdge( container, isReverse ) {
	return placeCaretAtEdge( { container, isReverse } );
}
