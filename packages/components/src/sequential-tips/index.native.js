/**
 * External dependencies
 */
import { Text, View } from 'react-native';

/**
 * WordPress dependencies
 */
import {
	createContext,
	useState,
	useContext,
	useEffect,
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

const tips = [
	'block_inserter',
	'block_actions',
	'block_settings',
	'media_actions',
	'help',
];

const SequentialTipsContext = createContext();

const SequentialStepper = ( { children, blockCount } ) => {
	const [ index, setIndex ] = useState( -1 );
	useEffect( () => {
		if ( index > tips.length ) {
			return;
		}
		const stepTO = setTimeout( () => setIndex( ( i ) => i + 1 ), 300 );
		return () => {
			clearTimeout( stepTO );
		};
	}, [ blockCount ] );

	const currentTip =
		index >= 0 && index < tips.length ? tips[ index ] : 'Completed';
	return (
		<SequentialTipsContext.Provider value={ currentTip }>
			<Text>Tip Status: { currentTip }</Text>
			{ children }
		</SequentialTipsContext.Provider>
	);
};

const Tip = ( { children, name } ) => {
	const currentTipName = useContext( SequentialTipsContext );

	if ( typeof currentTipName === 'undefined' ) {
		throw new Error(
			'SequentialTips.Tip cannot be rendered outside of the SequentialTips component'
		);
	}

	return (
		<View
			style={ {
				opacity: name !== currentTipName ? 0.25 : 1,
			} }
		>
			<Text>Label: { children }</Text>
		</View>
	);
};

const SequentialTips = compose( [
	withSelect( ( select ) => {
		const { getBlockCount } = select( blockEditorStore );
		const blockCount = getBlockCount();
		return { blockCount };
	} ),
] )( SequentialStepper );

SequentialTips.Tip = Tip;

export default SequentialTips;
