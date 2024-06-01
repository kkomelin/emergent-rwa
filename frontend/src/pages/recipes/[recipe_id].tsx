import RecipeDetailPage from '@/components/recipe-detail-page'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const RecipePage = () => {
  const router = useRouter()
  const { recipe_id: recipeId } = router.query
  const [recipe, setRecipe] = useState<any>()

  useEffect(() => {
    if (!recipeId) return

    // const core = new Core({
    //   endpointUrl:
    //     //'https://powerful-autumn-fog.quiknode.pro/da003dc031d0468f868c9b20391a5cbe8873f213/',
    //     'https://fragrant-burned-lake.quiknode.pro/01400e769df01c1c6f5c44a66ea39abd7db9f4d6/',
    //   config: {
    //     addOns: {
    //       nftTokenV2: true,
    //     },
    //   },
    // })

    async function fetchRecipe(recipeId: string) {
      try {
        // const response = await core.client.qn_fetchNFTsByCollection({
        //   collection: contract_address,
        //   tokens: [token_id],
        // })
        // const response = {
        //   collection: contract_address,
        //   tokens: nftList.filter(
        //     (token) =>
        //       token.collectionAddress === contract_address &&
        //       token.collectionTokenId === token_id
        //   ),
        // }
        // if (response.tokens && response.tokens.length > 0) {
        //   setRecipe(response.tokens[0])
        // }
      } catch (error) {
        console.error('Failed to fetch NFT:', error)
      }
    }

    fetchRecipe(recipeId.toString())
  }, [recipeId])

  if (!recipe) {
    return <div>Loading...</div>
  }

  return <RecipeDetailPage recipe={recipe} />
}

export default RecipePage
