import { truncateAddress } from '@/utils/truncate'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { GET_RECIPES, processRecipes } from '../queries/GET_RECIPES'
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
  Icon,
} from './ui/glowing-stars'

interface Attestation {
  decodedDataJson: string
  id: string
  attester: string
  recipient: string
  expectedOutcome?: string
}

const RecipesTable = () => {
  const itemsPerPage = 10
  const [page, setPage] = useState(0)
  const [recipes, setRecipes] = useState<Attestation[]>([])

  const { loading, error, data } = useQuery(GET_RECIPES, {
    variables: { take: itemsPerPage, skip: itemsPerPage * page },
  })

  useEffect(() => {
    if (data && data.attestations) {
      const processedRecipes = processRecipes(data.attestations)
      setRecipes(processedRecipes)
    }
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {recipes.map(({ id, attester, expectedOutcome }) => (
        <GlowingStarsBackgroundCard key={id} href={`/recipes/${id}`}>
          <GlowingStarsTitle>{truncateAddress(attester)}</GlowingStarsTitle>
          <div className="flex items-end justify-between">
            <GlowingStarsDescription>{expectedOutcome}</GlowingStarsDescription>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsla(0,0%,100%,.1)]">
              <Icon />
            </div>
          </div>
        </GlowingStarsBackgroundCard>
      ))}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
          disabled={page === 0}
          className="btn-primary"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prevPage) => prevPage + 1)}
          className="btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default RecipesTable
