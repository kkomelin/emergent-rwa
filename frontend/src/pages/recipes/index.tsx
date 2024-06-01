import React from 'react'
import RecipesTable from '@/components/recipes-table'

const RecipesIndexPage = () => {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold text-neutral-600 dark:text-white">
        All Recipes
      </h1>
      <p className="mb-8 text-neutral-500 dark:text-neutral-400">
        A Recipe is simply a collection of Attestation Schemas associated with an Expected Outcome.
        It is a blueprint/template suggesting users what Attestations they need to collect for a particular purpose.
        Given anyone can create a Recipe, they are not guarantees of any kind.
        Below is the list of all Recipes that currently exist. Click on a Recipe to see more details,
        including the author, expected outcome, the list of Attestation Schemas it consists of, as well as
        the list of attestations that have been made using this recipe.
      </p>
      <RecipesTable />
    </section>
  )
}

export default RecipesIndexPage
