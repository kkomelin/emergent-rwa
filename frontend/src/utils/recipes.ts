import { IRecipe } from '@/types/IRecipe'
import { extractDataByKey } from './graphql'

export const processRecipes = (recipes: IRecipe[]): IRecipe[] => {
  return recipes.map((recipe) => {
    let decodedData
    try {
      decodedData = JSON.parse(recipe.decodedDataJson)
    } catch (error) {
      console.error('Error parsing decodedDataJson', error)
      return { ...recipe, expectedOutcome: 'Error parsing data', schemaIds: [] }
    }

    const expectedOutcome = extractDataByKey(decodedData, 'EXPECTED_OUTCOME')
    const schemaIds = extractDataByKey(decodedData, 'SCHEMA_ID')

    return {
      ...recipe,
      expectedOutcome: expectedOutcome || 'No outcome found', // Fallback if not found
      schemaIds: schemaIds || [], // Fallback if not found
    }
  })
}

export const parseCollectionData = (jsonData: any) => {
  let decodedData
  try {
    decodedData = JSON.parse(jsonData)
  } catch (error) {
    console.error('Error parsing decodedDataJson', error)
    return { collectionAddress: undefined, collectionTokenId: undefined }
  }

  const collectionAddress = extractDataByKey(decodedData, 'TARGET_ADDRESS')
  const collectionTokenId = extractDataByKey(decodedData, 'TARGET_ID')

  return { collectionAddress, collectionTokenId }
}
