import RecipeDetailPage from '@/components/recipe-detail-page'
import { useRouter } from 'next/router'

const RecipePage = () => {
  const router = useRouter()
  const { recipe_id: recipeId } = router.query

  if (recipeId == null) {
    return <></>
  }

  return <RecipeDetailPage recipeId={recipeId.toString()} />
}

export default RecipePage
