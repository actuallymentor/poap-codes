import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
`

export default styled.div`
	
	display: inline-block;
	width: 80px;
	height: 80px;
	margin: 2rem;

	&:after {
		content: " ";
		display: block;
		width: 64px;
		height: 64px;
		margin: 8px;
		border-radius: 50%;
		border: 6px solid ${ ( { theme } ) => theme.colors.primary };
		border-color: ${ ( { theme } ) => theme.colors.primary } transparent ${ ( { theme } ) => theme.colors.primary } transparent;
		animation: ${ rotate } 1.2s linear infinite;
	}

`