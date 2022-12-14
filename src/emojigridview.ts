import { type Locale, FocusTracker } from 'ckeditor5/src/utils';
import {
	View,
	type ViewCollection,
	ButtonView
} from 'ckeditor5/src/ui';

import '../theme/emoji-grid.css';
import { type Emoji } from './constants';

export default class EmojiGridView extends View {
	private tiles: ViewCollection<View>;
	private focusTracker: FocusTracker;
	private classesPrefix: string;

	constructor( locale: Locale, classesPrefix: string ) {
		super( locale );
		this.tiles = this.createCollection();
		this.classesPrefix = classesPrefix;

		this.setTemplate( {
			tag: 'div',
			children: [
				{
					tag: 'div',
					attributes: {
						class: [
							'emoji',
							'emoji-grid__tiles',
							'ck-reset_all-excluded'
						]
					},
					children: this.tiles
				}
			],
			attributes: {
				class: [
					'emoji',
					'emoji-grid'
				]
			}
		} );

		/**
		 * Tracks information about the DOM focus in the grid.
		 *
		 * @readonly
		 * @member {module:utils/focustracker~FocusTracker}
		 */
		this.focusTracker = new FocusTracker();
	}

	public createTile( emoji: Emoji ): View {
		const tile = new ButtonView( this.locale );

		const bind = tile.bindTemplate;
		tile.setTemplate( {
			tag: 'button',
			attributes: {
				title: emoji.name || '',
				class: `em-grid-item ${ this.classesPrefix }${ emoji.key }`
			},
			on: {
				mousedown: bind.to( evt => {
					evt.preventDefault();
				} ),

				click: bind.to( evt => {
					if ( tile.isEnabled ) {
						tile.fire( 'execute' );
					} else {
						evt.preventDefault();
					}
				} )
			}
		} );

		tile.on( 'execute', () => {
			this.fire( 'execute', emoji );
		} );

		return tile;
	}

	public clearTitles(): void {
		this.tiles.clear();
	}

	public addTitle( title: View ): void {
		this.tiles.add( title );
	}
}
