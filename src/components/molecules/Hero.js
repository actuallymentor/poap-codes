import styled from 'styled-components'
import Section from '../atoms/Section'

import hero from '../../assets/hero.svg'
const BackgroundImage = styled.img.attrs( props => ( {
	src: props.src || hero
} ) )`
	position: absolute;
	z-index: -1;
	right: 0;
	bottom: 0;
	/* transform: translateY( -50% ); */
	/* top: 50%; */
	/* transform: translateX( 50% ); */
	width: 100%;
	opacity: .2;
`

const Hero = styled( Section )`
	position: relative;
	width: 100%;
	min-height: 600px;
	align-items: flex-start;
	padding: ${ ( { padding } ) => padding || '0 max( 1rem, calc( 25vw - 8rem ) )' };
	transition-duration: 1s;
	margin-bottom: ${ ( { pull=false } ) => pull ? '-5rem' : '5rem' };
	box-shadow: 0px 0 5px 2px rgba( 0, 0, 0, .1);
	& h1 {
		margin-bottom: .5rem;
		text-align: left;
	}
	& * {
		max-width: 800px;
	}
	& > p {
		margin: .1rem 0;
	}
	& * {
		box-sizing: border-box;
	}
`

// Container that always has the background image
export default ( { children, background, ...props } ) => <Hero { ...props }>
	<BackgroundImage src={ background } key='background' />
	{ children }
</Hero>