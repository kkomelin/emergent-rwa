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
        Below is the list of all Recipes that currently exist. Click on a Recipe to see more details, including:
        <ul>
          <li>* Author</li>
          <li>* Expected Outcome</li>
          <li>* List of Attestation Schemas</li>
          <li>* List of Attestations made using this Recipe</li>
          <li>* List of NFTs that conform (have all Attestations) to this Recipe</li>
        </ul>
      </p>
      <RecipesTable />
    </section>
  )
}

export default RecipesIndexPage
