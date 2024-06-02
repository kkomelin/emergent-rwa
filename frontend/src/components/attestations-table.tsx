import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IAttestation } from '@/types/IAttestation'
import { extractDataByKey } from '@/utils/graphql'
import { truncateAddress } from '@/utils/truncate'
import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const GET_ATTESTATIONS = gql`
  query Attestations($take: Int!, $skip: Int!, $recipient: String) {
    attestations(
      take: $take
      skip: $skip
      where: { recipient: { equals: $recipient } }
      orderBy: { time: desc }
    ) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      decodedDataJson
    }
  }
`

const AttestationsTable = ({
  recipientFilter,
  tokenIdFilter,
}: {
  recipientFilter?: string
  tokenIdFilter?: string
}) => {
  const itemsPerPage = 25
  const [page, setPage] = useState(0)
  const [filteredData, setFilteredData] = useState([])

  const { loading, error, data } = useQuery(GET_ATTESTATIONS, {
    variables: {
      take: itemsPerPage,
      skip: page * itemsPerPage,
      ...(recipientFilter && {
        recipient: '0x5cbeb7A0df7Ed85D82a472FD56d81ed550f3Ea95',
      }),
    },
  })

  useEffect(() => {
    if (data && data.attestations && tokenIdFilter) {
      const filtered = data.attestations.filter((attestation: IAttestation) => {
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
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Attester</TableHead>
            <TableHead>Amount (USDC)</TableHead>
            <TableHead>Reputation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map(({ id, attester, amount }: IAttestation) => (
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
              <TableCell>{Math.floor(Math.random() * 100)}</TableCell>
              <TableCell className="text-right">
                <Link
                  href="https://sepolia.easscan.org/attestation/attestWithSchema/0x4120dbef15220361e3e51db8e3979b2523fceced8442866df5e596d2766ca9dd"
                  className={`${buttonVariants({ variant: 'variant2' })} ml-2 mr-2 h-10 w-24 py-6 text-center text-black last:mr-0`}
                  target="_blank"
                >
                  Accept
                  <wbr />
                  Attestation
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="btn-primary"
        >
          Previous
        </button>
        <button onClick={() => setPage(page + 1)} className="btn-primary">
          Next
        </button>
      </div>
    </div>
  )
}

export default AttestationsTable
