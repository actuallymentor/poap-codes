import styled from 'styled-components'

export const Text = styled.p`
	font-size: 1rem;
	margin: ${ ( { margin='1rem 0' } ) => margin };
	line-height: 1.5rem;
	color: ${ ( { theme, color } ) => color || theme.colors.text };
	text-align: ${ ( { align } ) => align || 'left' };
	overflow-wrap: anywhere;
	background: ${ ( { background='initial' } ) => background };
	display: flex;
	flex-direction: ${ ( { direction } ) => direction || 'column' };
	max-width: ${ ( { width='100%' } ) => width };
	align-items: ${ ( { align } ) => align || 'center' };
	justify-content: ${ ( { justify } ) => justify || 'center' };
	a {
		display: contents;
		color: ${ ( { theme, color } ) => color || theme.colors.primary };
	}
`

export const H1 = styled.h1`
	font-size: 2.5rem;
	font-weight: 500;
	line-height: 1.2;
	font-family: 'Comfortaa', Helvetica, sans-serif;
	text-align: ${ ( { align } ) => align || 'left' };
	color: ${ ( { theme, color } ) => color || theme.colors.primary };
	overflow-wrap: anywhere;
`

export const H2 = styled.h2`
	font-size: 1.5rem;
	margin: 0 0 1rem;
	line-height: 1.2;
	font-weight: 400;
	text-align: ${ ( { align } ) => align || 'left' };
	color: ${ ( { theme, color } ) => color || theme.colors.accent };
	overflow-wrap: anywhere;
`

export const Sidenote = styled.p`
	color: ${ ( { theme } ) => theme.colors.hint };
	font-style: italic;
	margin-top:  1rem;
	text-align: center;
	overflow-wrap: anywhere;
`

export const Br = styled.span`
	width: 100%;
	margin: 2rem 0;
`
export const Sup = styled.sup`
	overflow-wrap: anywhere;
`