/**
 * External dependencies
 */
import { Text } from 'react-native';
import Modal from 'react-native-modal';

/**
 * WordPress dependencies
 */
import { Children, useState } from '@wordpress/element';
import { createSlotFill } from '@wordpress/components';

// TODO: David - It is probably best to avoid adding a G2 native component, and
// add a native component here. We likely need to add a mobile-only `visible`.
// Mobile might could have a default trigger, like web's hover, but what should
// it be? Press? It wouldn't be applicable here. Still need `visible`.

const { Fill, Slot } = createSlotFill( 'Tooltip' );

const Tooltip = ( {
	children,
	position,
	text,
	visible: initialVisible = false,
} ) => {
	const [ visible, setVisible ] = useState( initialVisible );

	return (
		<>
			{ visible && (
				<Fill>
					<Text
						style={ {
							backgroundColor: 'red',
							color: 'white',
							position: 'absolute',
							top: 0,
							left: 0,
						} }
					>
						{ text }
					</Text>
				</Fill>
			) }
			{ /* <Modal
				animationInTiming={ 1 }
				animationOutTiming={ 1 }
				backdropOpacity={ 0 }
				// hasBackdrop={ false }
				// customBackdrop={ ( { children } ) => children }
				isVisible={ visible }
				onBackdropPress={ () => setVisible( false ) }
			>
				<Text style={ { backgroundColor: 'red', color: 'white' } }>
					{ text }
				</Text>
			</Modal> */ }
			{ Children.only( children ) }
		</>
	);
};

Tooltip.Slot = Slot;

export default Tooltip;
