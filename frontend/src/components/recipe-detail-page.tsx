import { SAMPLE_ATTESTATIONS_MAP } from '@/config/attestations'
import { GET_RECIPE, GET_RECIPE_ATTESTATIONS } from '@/queries/GET_RECIPE'
import { IAttestation } from '@/types/IAttestation'
import { parseCollectionData, processRecipes } from '@/utils/recipes'
import { truncateAddress } from '@/utils/truncate'
import { useLazyQuery, useQuery } from '@apollo/client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

function RecipeDetailPage({ recipeId }: { recipeId: string }) {
  const { loading, error, data } = useQuery(GET_RECIPE, {
    variables: { recipeId },
  })
  const [
    getAttestations,
    {
      loading: attestationsLoading,
      error: attestationsError,
      data: attestationsData,
    },
  ] = useLazyQuery(GET_RECIPE_ATTESTATIONS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  const recipes = processRecipes(data['attestations'])

  if (recipes.length === null) {
    return <></>
  }

  return (
    <div className="flex w-full">
      <div className="w-full">
        <h1 className="mb-4 text-2xl font-bold text-neutral-600 dark:text-white">
          Recipe
        </h1>

        <div className="text-neutral-600 dark:text-white">
          <div>
            <div className="font-bold">Author:</div> {recipes[0].attester}
          </div>
          <div>
            <div className="font-bold">Expected outcome:</div>{' '}
            {recipes[0].expectedOutcome}
          </div>
        </div>

        <div>
          <h3 className="mb-4 w-full font-bold text-neutral-600 dark:text-white">
            Required Attestations:
          </h3>

          <Accordion
            type="single"
            collapsible
            className="w-full py-2 text-white"
          >
            {recipes[0].schemaIds?.map((schemaId: string) => (
              <AccordionItem
                value={SAMPLE_ATTESTATIONS_MAP[schemaId]}
                key={SAMPLE_ATTESTATIONS_MAP[schemaId]}
                className="my-4 w-full rounded border p-4"
              >
                <AccordionTrigger
                  className="group flex w-full flex-row items-center justify-between gap-2"
                  onClick={() => getAttestations({ variables: { schemaId } })}
                >
                  <div className="grow text-left">
                    {SAMPLE_ATTESTATIONS_MAP[schemaId]}
                  </div>

                  <ChevronDownIcon
                    className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                </AccordionTrigger>
                <AccordionContent className="my-6 space-y-4">
                  <div className="max-h-80 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Attester</TableHead>
                          <TableHead>Reputation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {!attestationsLoading &&
                          !attestationsError &&
                          attestationsData?.attestations?.map(
                            ({
                              id,
                              attester,
                              amount,
                              decodedDataJson,
                            }: IAttestation) => {
                              const { collectionAddress, collectionTokenId } =
                                parseCollectionData(decodedDataJson)

                              if (collectionAddress != null) {
                                return <></>
                              }

                              return (
                                <TableRow key={id}>
                                  <TableCell>
                                    <Link
                                      href={`/nft/${collectionAddress}/${collectionTokenId}`}
                                      target="_blank"
                                    >
                                      {truncateAddress(id)}
                                    </Link>
                                  </TableCell>
                                  <TableCell>
                                    {truncateAddress(attester)}
                                  </TableCell>
                                  <TableCell>
                                    {Math.floor(Math.random() * 100)}
                                  </TableCell>
                                </TableRow>
                              )
                            }
                          )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage
