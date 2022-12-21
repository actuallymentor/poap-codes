import Button from '../atoms/Button'
import { DataGrid } from '@mui/x-data-grid'
import styled from 'styled-components'
import { Sidenote, Text } from '../atoms/Text'
import Image from '../atoms/Image'
import { generate_mock_codes } from '../../modules/mock-data'
import { useRef } from 'react'

const TableWrapper = styled.div`
    z-index: 2;
    width: 100%;
    max-width: 750px;
    box-shadow: 0px 0 5px 2px rgba( 0, 0, 0, .1);
    padding: 1rem;
    background-color: ${ ( { theme } ) => theme.colors.text_surface };
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    * {
        color: ${ ( { theme } ) => theme.colors.text };
    }
    & > div {
        border: none;
        width: 100%;
    }
    & > p {
        margin-bottom: 3rem;
        font-size: 1.3rem;
    }

    // MUI overrides
    .MuiDataGrid-columnSeparator {
        display: none!important;
    }
`

export default ( { title='Demo', image, rows, on_claim_link_click, ...props } ) => {

    const mock_codes = useRef( generate_mock_codes( 10 ) ).current

    // Configure headings
    const columns = [
        {
            id: 1,
            field: 'qr_hash',
            headerName: 'Claim Code',
            description: '',
            width: 150,
        },
        {
            id: 2,
            field: 'claimed',
            headerName: 'Status',
            description: '',
            width: 150,
            renderCell: ( { value, row } ) => {
                if( value === true ) return `🛑 claimed`
                if( row.expired === true ) return `⏱ expired`
                if( value === false ) return `✅ available`
                return value
            }
        },
        {
            id: 3,
            field: 'claimed_date',
            headerName: 'Date claimed',
            description: '',
            width: 150,
        },
        {
            id: 4,
            field: 'claim_link',
            headerName: 'Claim link',
            description: '',
            width: 250,
            headerAlign: 'right',
            renderCell: ( { row, value } ) => {
                const { tx_hash } = row
                const link = tx_hash ? `https://blockscout.com/xdai/mainnet/tx/${ tx_hash }` : value
                return <Button small={ true } margin='0 0 0 auto' solid={ true } onClick={ f => on_claim_link_click( row.qr_hash, link ) }>Copy { tx_hash ? 'explorer' : 'claim' } link</Button>
            }
        }
    ]

    // Add decorated values
    rows = rows?.map( ( { claimed_date, qr_hash, ...entry } ) => ( {
        claim_link: `https://app.poap.xyz/claim/${ qr_hash }`,
        qr_hash,
        claimed_date:claimed_date ? new Date( claimed_date ).toDateString() : '-',
        ...entry
    } ) )

    return <TableWrapper rows={ rows?.length || 0 }>
        { !!rows && image && <Image pull={ true } src={ image } /> }
        <Text>&quot;{ title }&quot; codes overview</Text>
        <DataGrid
            autoHeight
            columns={ columns }
            rows={ rows || mock_codes }
            { ...props }
        />
    </TableWrapper>

}