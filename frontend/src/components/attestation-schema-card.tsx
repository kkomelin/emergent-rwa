import { buttonVariants } from '@/components/ui/button'
import { SAMPLE_ATTESTATIONS_MAP } from '@/config/attestations'
import Link from 'next/link'

const human_mapping = SAMPLE_ATTESTATIONS_MAP

const schemaId: string =
  '0xe6d493be74347a2dd3d95e783fdfa35c164dc7b6571f7c5601fa9895b6caa333'

const AttestationsSchemaCard = ({ schemaId }: { schemaId: string }) => {
  const humanMappingValue = human_mapping[schemaId]
  return (
    <Link
      href={`https://sepolia.easscan.org/schema/view/${schemaId}`}
      target="_blank"
    >
      <div className="my-3 flex flex-row items-center justify-center rounded-lg border px-4 py-4 text-left">
        <p className="w-2/3 text-white">{humanMappingValue}</p>
        <Link
          href="https://sepolia.easscan.org/attestation/attestWithSchema/0x41a4762b6d24720f43720883824687b54a3263b38b82d0ad93a0dd3d47024728"
          className={`${buttonVariants({ variant: 'variant3' })} mx-2 h-10 w-1/6 py-6 text-center text-black`}
          target="_blank"
        >
          Request
          <wbr />
          Attestation
        </Link>
        <Link
          href="https://sepolia.easscan.org/attestation/attestWithSchema/0x6b837e8a2baca15566c0231e7050cd76738771d2fea0ea4e1bd94cc94a851b47"
          className={`${buttonVariants({ variant: 'variant1' })} mx-2 h-10 w-1/6 py-6 text-center text-black`}
          target="_blank"
        >
          Offer
          <wbr />
          Attestation
        </Link>
      </div>
    </Link>
  )
}

export default AttestationsSchemaCard
