export interface IRecipe {
  id: string
  attester: string
  recipient: string
  refUID?: string
  decodedDataJson: string
  expectedOutcome?: any
  schemaIds?: any[]
}
