import styled, { css, keyframes } from 'styled-components'
import { useRef } from 'react'

const gradient = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const animation = ( { theme } ) => css`
	background: linear-gradient( -45deg, ${ theme.colors.primary }, ${ theme.colors.accent } );
	background-size: 400% 400%;
	animation: ${gradient} 1s ease infinite;
	color: white;
`

const Input = styled.span`

	display: flex;
	flex-direction: column;
	margin: ${ ( { margin } ) => margin || '1rem 0' };
	width: ${ ( { width } ) => width || '400px' };

	
	
	& select, input, & p {
		background: ${ ( { theme } ) => theme.colors.backdrop };
		border: none;
		border-left: 2px solid ${ ( { theme, highlight } ) => highlight ? theme.colors.accent : theme.colors.primary };
	}

	& p {
		${ ( { animate=false } ) => animate ? animation : '' }
	}

	& select, input, & p {
		padding: 1rem 2rem 1rem 1rem;
		width: 100%;
	}

	p {
		font-size: .7rem;
	}

	& label {
		opacity: .5;
		font-style: italic;
		margin-bottom: .5rem;
		display: flex;
		width: 100%;
		color: ${ ( { theme } ) => theme.colors.text };
		span {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: .9rem;
			margin-left: auto;
			font-style: normal;
			background: ${ ( { theme } ) => theme.colors.hint };
			color: white;
			border-radius: 50%;
			width: 20px;
			height: 20px;
		}
	}

`

export default ( { onChange, animate, type, label, info, highlight, id, title, onClick, options, ...props } ) => {

	const { current: internalId } = useRef( id || `input-${ Math.random() }` )
	
	return <Input animate={ animate } onClick={ onClick } highlight={ highlight } { ...props }>

		{ label && <label htmlFor={ internalId }>{ label } { info && <span onClick={ f => alert( info ) }>?</span> }</label> }

		{ !title && type != 'dropdown' && <input data-testid={ internalId } { ...props } id={ internalId } onChange={ onChange } type={ type || 'text' } /> }
		{ !title && type == 'dropdown' && <select id={ internalId } onChange={ onChange }>
			{ options.map( ( option, index ) => <option key={ index } value={ option.value }>{ option.label }</option> ) }
		</select> }

		{ title && <p>{ title }</p> }
		
	</Input>

}