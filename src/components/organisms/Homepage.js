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

export default function Homepage() {

    const navigate = useNavigate()

    return <Container gutter={ false }>

        <Hero>
            <H1>POAP Mint Links Manager</H1>
            <H2>Manage and distribute POAP mint links</H2>
            <Text margin='0' width='500px'>Lost track of which POAP mint links you sent out? Need to airdrop POAPs? We've got you covered.</Text>
        </Hero>

        <Section direction="row" padding="2rem" justify="space-around">

            <Section align="flex-start" padding="1rem" width="600px">
                <H2>Check which mint links are still valid</H2>
                <Text margin='2rem 0' width='700px'>As a POAP issuer, you sometimes lose track of which codes you sent out, and which are still ready to share. This tool takes in your codes.txt and shows you which codes are still unclaimed.</Text>
                <Button onClick={ () => navigate( '/status' ) }>Mint link checker</Button>
            </Section>

            <Section align="flex-start" padding="1rem" width="600px">
                <H2>Airdrop POAPs</H2>
                <Text margin='2rem 0' width='700px'>If you promised a large group of people POAPs, handing them out can be a hassle. If you have a list of addresses, you can mass-distribute POAPs to a list of addresses.</Text>
                <Button onClick={ () => navigate( '/airdrop' ) }>Airdrop tool</Button>
            </Section>

        </Section>

        <Text margin='5rem 0 2rem' direction='row'>Created and maintained by  <a rel='noreferrer' target="_blank" href='https://twitter.com/actuallymentor'>mentor.eth</a>, code on <a rel='noreferrer' target="_blank" href='https://github.com/actuallymentor/poap-codes'>Github</a>.</Text>

    </Container>
}