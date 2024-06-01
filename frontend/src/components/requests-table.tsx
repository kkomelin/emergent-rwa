import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { extractDataByKey } from '@/utils/graphql'
import { truncateAddress } from '@/utils/truncate'
import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Attestation {
  decodedDataJson: string
  id: string
  attester: string
  amount: string
  expectedOutcome: string
}

const GET_REQUESTS = gql`
  query Recipes($take: Int! = 25, $skip: Int! = 0, $recipient: String) {
    attestations(
      take: $take
      skip: $skip
      where: {
        schemaId: {
          equals: "0x41a4762b6d24720f43720883824687b54a3263b38b82d0ad93a0dd3d47024728"
        }
        recipient: { equals: $recipient }
      }
      orderBy: { time: desc }
    ) {
      id
      attester
      recipient
      refUID
      decodedDataJson
    }
  }
`

const RequestsTable = ({
  recipientFilter,
  tokenIdFilter,
}: {
  recipientFilter?: string
  tokenIdFilter?: string
}) => {
  const [filteredData, setFilteredData] = useState([])

  const { loading, error, data } = useQuery(GET_REQUESTS, {
    variables: {
      ...(recipientFilter && {
        recipient: '0x5cbeb7A0df7Ed85D82a472FD56d81ed550f3Ea95',
      }),
    },
  })

  useEffect(() => {
    if (data && data.attestations && tokenIdFilter) {
      const filtered = data.attestations.filter((attestation: Attestation) => {
        const tokenId = extractDataByKey(
          JSON.parse(attestation.decodedDataJson),
          'TARGET_ID'
        )
        return tokenId === tokenIdFilter
      })
      setFilteredData(filtered)
    } else if (data && data.attestations) {
      setFilteredData(data.attestations)
    }
  }, [data, tokenIdFilter])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div className="max-h-80 overflow-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Attester</TableHead>
            <TableHead>Amount (USDC)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map(({ id, attester, amount }: Attestation) => (
            <TableRow key={id}>
              <TableCell>
                <Link
                  href={`https://sepolia.easscan.org/attestation/view/${id}`}
                  target="_blank"
                >
                  {truncateAddress(id)}
                </Link>
              </TableCell>
              <TableCell>{truncateAddress(attester)}</TableCell>
              <TableCell>{amount}</TableCell>
              <TableCell className="text-right">
                <Link
                  href="https://sepolia.easscan.org/attestation/attestWithSchema/0x5873efc18f905da81845826b1f99510fb55fd9d2a2c5a15980f270c626796634"
                  className={`${buttonVariants({ variant: 'variant1' })} ml-2 mr-2 h-10 w-24 py-6  text-center text-black last:mr-0`}
                  target="_blank"
                >
                  Offer
                  <wbr />
                  Attestation
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default RequestsTable
