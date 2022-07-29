import Container from "../atoms/Container"
import CodesInput from "../molecules/CodesInput"
import Section from "../atoms/Section"
import Hero from "../molecules/Hero"
import CodesTable from "../molecules/CodesTable"
import { H1, H2, Text } from "../atoms/Text"
import { useState, useRef } from "react"
import { log } from "../../modules/helpers"

export default function Homepage() {

    const [ codes, set_codes ] = useState()
    const [ event, set_event ] = useState(  )

    async function copy_and_mark( code, link ) {

        // Write to clipboard
		await navigator.clipboard.writeText( link )
        alert( `✅ Copied to clipboard: ${ link }` )

        // Mark code as copied internally
        const updated_codes = codes?.map( claimcode => {
            if( claimcode.qr_hash == code ) return {
                ...claimcode,
                ...( !claimcode.tx_hash && { claimed: `⚠️ copied` } )
            }
            return claimcode
        } )
        set_codes( updated_codes )


    }

    return <Container gutter={ false }>

        <Hero pull={ !!codes?.length }>
            <H1>POAP Claim Codes Manager</H1>
            <H2>Check the status of your claim codes</H2>
            <Text margin='0' width='500px'>As a POAP issuer, you sometimes lose track of which codes you sent out, and which are still ready to share. This tool takes in your codes.txt and shows you which codes are still unclaimed.</Text>
            <CodesInput on_codes={ set_codes } on_event={ set_event } />
        </Hero>

        <Section>

            <CodesTable on_claim_link_click={ copy_and_mark } title={ codes && event?.name } image={ event?.image_url } rows={ codes } />

        </Section>

        <Text margin='5rem 0 2rem' direction='row'>Created and maintained by  <a rel='noreferrer' target="_blank" href='https://twitter.com/actuallymentor'>mentor.eth</a>, code on <a rel='noreferrer' target="_blank" href='https://github.com/actuallymentor/poap-codes'>Github</a>.</Text>

    </Container>
}