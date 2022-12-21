import Container from "../atoms/Container"
import CodesInput from "../molecules/CodesInput"
import Section from "../atoms/Section"
import Hero from "../molecules/Hero"
import CodesTable from "../molecules/CodesTable"
import { H1, H2, Text } from "../atoms/Text"
import { useState } from "react"
import { log } from "../../modules/helpers"
import { useLastKnownCodeEvent, useLastKnownCodeStatuses } from "../../hooks/codes"
import { set_item } from "../../modules/local-storage"
import { useNavigate } from "react-router-dom"
import Button from "../atoms/Button"
import Input from "../atoms/Input"
import { airdrop_to_address_list } from "../../modules/firebase"
import Loading from "../molecules/Loading"
import { Item, List } from "../atoms/List"

export default function Homepage() {

    const navigate = useNavigate()
    const [ drop_id, set_drop_id ] = useState( '' )
    const [ edit_code, set_edit_code ] = useState( '' )
    const [ list_of_addresses, set_list_of_addresses ] = useState( '' )
    const [ disclaimer_accepted, set_disclaimer_accepted ] = useState( false )
    const [ loading, set_loading ] = useState(  )
    const [ failed_airdrop_entries, set_failed_airdrop_entries ] = useState( [] )
    const [ airdrop_complete, set_airdrop_complete ] = useState( false )

    async function do_airdrop() {
        
        try {

            set_loading( `Airdropping` )
            const { data: { error, failed_airdrops } } = await airdrop_to_address_list( { drop_id, edit_code, list_of_addresses } )
            if( error ) throw new Error( error )

            // Set failed airdrops
            log( `Airdrop succeeded with failed entries: `, failed_airdrops )
            set_failed_airdrop_entries( failed_airdrops )
            set_airdrop_complete( true )

        } catch( e ) {
            log( `Error in airdrop: `, e )
            alert( `Airdrop error: ${ e.message }` )
        } finally {
            set_loading( false )
        }

    }

    if( loading ) return <Loading message={ loading } />
    return <Container gutter={ false }>

        <Hero>
            <H1>POAP Airdrop tool</H1>
            <H2>Mass-distribute POAPs</H2>
            <Text margin='0' width='500px'>Promised a large group of people POAPs and have a list of addresses? Use this tool to airdrop them.</Text>
        </Hero>

        { !disclaimer_accepted && <Section direction="column" padding="2rem" width="600px">
            <Text align="center">IMPORTANT: sending POAPs to people who did not EXCPLCITLY request them is against the POAP ethos. If you airdrop POAPs to peope who did not ask for them, you risk getting yourself and/or your organisation banned from creating POAPs in the future.</Text>
            <Button onClick={ () => set_disclaimer_accepted( true ) }>I understand that abuse gets me banned</Button>
        </Section> }

        { disclaimer_accepted && !airdrop_complete && <Section direction="column" padding="2rem">

            <Input value={ drop_id } onChange={ ( { target } ) => set_drop_id( target.value ) } label="Drop ID" />
            <Input value={ edit_code } onChange={ ( { target } ) => set_edit_code( target.value ) } label="Drop edit code" />
            <Input value={ list_of_addresses } onChange={ ( { target } ) => set_list_of_addresses( target.value ) } label="List of addresses (comma separated)" />
            <Button onClick={ do_airdrop }>Start Airdrop</Button>

        </Section> }

        { airdrop_complete && <Section direction="column" padding="2rem">

            <H2>Airdrop complete!</H2>
            { failed_airdrop_entries.length !== 0 && <>
                <Text>Failed airdrop attempts:</Text>
                <List>
                    { failed_airdrop_entries.map( ( { address, qr_hash, reason } ) => <Item key={ qr_hash }>
                        { address }: { reason }
                    </Item> ) }
                </List>
            </> }

        </Section> }

        

        <Text margin='5rem 0 2rem' direction='row'>Created and maintained by  <a rel='noreferrer' target="_blank" href='https://twitter.com/actuallymentor'>mentor.eth</a>, code on <a rel='noreferrer' target="_blank" href='https://github.com/actuallymentor/poap-codes'>Github</a>.</Text>

    </Container>
}