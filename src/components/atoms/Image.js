import styled from 'styled-components'

export default styled.img`
	width: ${ ( { width='150px' } ) => width };
	height: ${ ( { height='150px' } ) => height };
	border-radius: 50%;
	box-shadow: ${ ( { theme } ) => theme.colors.shadow };
	margin-top: ${ ( { pull=false, height=150 } ) => pull ? `-${ height / 2 }px`: 0 };
`