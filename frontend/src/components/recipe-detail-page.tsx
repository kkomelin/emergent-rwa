function RecipeDetailPage({ recipe }: { recipe: any }) {
  return (
    <div className="flex w-full flex-col md:flex-row">
      <div className="md:w-1/3">
        <h1 className="mb-4 text-2xl font-bold text-neutral-600 dark:text-white">
          RENDER YOUR RECIPE HERE
          <div>{JSON.stringify(recipe, null, 2)}</div>
        </h1>
        {/* <CardContainer className="mb-10">
          <CardBody className="group/card relative h-auto w-auto ">
            <CardItem translateZ="100" className="mt-4 overflow-hidden">
              <Image
                src={recipe.imageUrl}
                height="1000"
                width="1000"
                className="max-w-200 rounded-xl object-cover group-hover/card:shadow-xl"
                alt={recipe.title || 'NFT Image'}
              />
            </CardItem>
          </CardBody>
        </CardContainer>

        <p className="word-wrap my-4 text-sm text-neutral-600 dark:text-white">
          <div>
            <b>Contract Address:</b> {recipe.collectionAddress}
          </div>

          <div>
            <b>Token ID:</b> {recipe.collectionTokenId}
          </div>

          <div>
            <b>Opensea: </b>{' '}
            <Link
              href={openseaNftUrl(
                recipe.chain.toLowerCase() || 'ethereum',
                recipe.collectionAddress,
                recipe.collectionTokenId
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              view
            </Link>
          </div>
        </p>

        <p className="h-60 overflow-x-hidden overflow-y-scroll whitespace-pre-line text-justify text-sm font-light text-neutral-600 dark:text-neutral-500">
          <Markdown skipHtml={true}>{recipe.description}</Markdown>
        </p>
      </div>

      <div className="md:ml-8 md:w-2/3">
        <h2 className="mb-4 text-xl font-bold text-neutral-600 dark:text-white">
          Recipes
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full py-4  text-white"
        >
          {recipes.map(({ expectedOutcome: recipe, schemaIds = [] }) => (
            <AccordionItem
              value={recipe}
              key={recipe}
              className="my-4 rounded border p-4"
            >
              <AccordionTrigger className="group flex w-full flex-row items-center justify-between gap-2">
                <div className="grow text-left">
                  <b>Expected Outcome: </b>
                  {recipe}
                </div>

                <ChevronDownIcon
                  className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </AccordionTrigger>
              <AccordionContent className="my-6 space-y-4">
                <h3 className="mb-4 w-full font-bold">
                  Required Attestations:
                </h3>
                {schemaIds.map((schemaId: string) => (
                  <AttestationsSchemaCard key={schemaId} schemaId={schemaId} />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <h2 className="my-4 text-xl font-bold text-neutral-600 dark:text-white">
          Attestation Offers
        </h2>
        <p className="word-wrap my-4 mt-4 text-sm text-neutral-600 dark:text-white">
          Anyone can offer to make an attestation. Here are displayed
          outstanding Attestations Offers for this NFT which the owner can
          accept.
        </p>
        <AttestationsTable
          recipientFilter={recipe.collectionAddress}
          tokenIdFilter={recipe.collectionTokenId}
        />

        <h2 className="my-4 text-xl font-bold text-neutral-600 dark:text-white">
          Attestation Requests
        </h2>

        <p className="word-wrap my-4 mt-4 text-sm text-neutral-600 dark:text-white">
          Anyone can request an attestation for an NFT, but typically this will
          be the owner or the potential buyer. Here are displayed requests that
          have been made for this NFT.
        </p>
        <RequestsTable
          recipientFilter={recipe.collectionAddress}
          tokenIdFilter={recipe.collectionTokenId}
        /> */}
      </div>
    </div>
  )
}

export default RecipeDetailPage