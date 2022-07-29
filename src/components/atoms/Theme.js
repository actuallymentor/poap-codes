import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { log } from '../../modules/helpers'

const theme = {
	colors: {
		primary: '#8076fa',
		text: '#8492ce',
		text_surface: 'white',
		accent: 'rgb( 248, 117, 136 )',
		hint: 'grey',
		backdrop: 'rgba( 0, 0, 0, .02 )',
		shadow: `0px 0 5px 2px rgba( 0, 0, 0, .1)`
	}
}

const theme_dark = {
	colors: {
		primary: '#8076fa',
		text: 'white',
		text_surface: 'black',
		accent: 'rgb( 248, 117, 136 )',
		hint: 'lightgrey',
		backdrop: 'rgba( 0, 0, 0, .9 )',
		shadow: `0px 0 5px 2px rgba( 255, 255, 255, .1)`
	}
}

export default props => {

	const [ dark, setDark ] = useState( false )

	useEffect( f => {

		// If API is not available, assume light
		if( !window.matchMedia ) {
			log( 'No darkmode detection support' )
			return setDark( false )
		}

		// Check with API
		const prefers_dark = window.matchMedia('(prefers-color-scheme: dark)').matches
		setDark( prefers_dark )
		log( `User prefers ${ prefers_dark ? 'dark' : 'light' } theme` )

		// Enable a listener
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener( 'change', event => {
			log( 'Darkmode setting changed to ', event.matches )
			setDark( event.matches == 'dark' )
		})

	}, [] )

	return <ThemeProvider { ...props } theme={ dark ? theme_dark : theme } />
}