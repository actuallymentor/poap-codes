import styled from 'styled-components'

export default styled.a`
	padding: ${ ( { small } ) => small ? '.3rem .5rem' : '1rem 2rem' };
	margin: ${ ( { margin } ) => margin || '.5rem 0' };
	border: 2px solid ${ ( { color='primary', theme } ) => theme.colors[ color ] || color };
	color: ${ ( { color='primary', theme, solid=false } ) => solid ? theme.colors.text_surface: ( theme.colors[ color ] || color ) }!important;
	font-size:${ ( { small } ) => small ? '.8rem' : '1rem' };
	text-decoration: none;
	background: ${ ( { theme, background='none', solid=false } ) => solid ? theme.colors.primary : background };
	border-radius: 5px;
	&:hover {
		cursor: pointer;
	}
`