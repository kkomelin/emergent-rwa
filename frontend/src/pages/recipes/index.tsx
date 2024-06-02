import RecipesTable from '@/components/recipes-table'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

const RecipesIndexPage = () => {
  return (
    <section>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-neutral-600 dark:text-white">
          All Recipes
        </h1>
        <div>
          <Link
            href="#"
            className={`${buttonVariants({ variant: 'variant1' })} ml-2 mr-2 h-10 w-24 py-2 text-center text-black last:mr-0 !w-auto`}
          >
            Create A New Recipe
          </Link>
        </div>
      </div>

      <p className="mb-8 text-neutral-500 dark:text-neutral-400">
        A Recipe is simply a collection of Attestation Schemas associated with
        an Expected Outcome. It is a blueprint/template suggesting users what
        Attestations they need to collect for a particular purpose. Given anyone
        can create a Recipe, they are not guarantees of any kind. Below is the
        list of all Recipes that currently exist. Click on a Recipe to see more
        details.
      </p>
      <RecipesTable />
    </section>
  )
}

export default RecipesIndexPage
