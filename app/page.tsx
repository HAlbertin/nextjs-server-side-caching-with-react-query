import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Pokemons } from "./_components/Pokemons";
import { prefetchPokemonTypes } from "./_services/prefetch-pokemon-types";
import { Suspense } from "react";
import { Loading } from "./_components/Loading";

export default function Home() {
  const queryClient = prefetchPokemonTypes();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading />}>
        <Pokemons />
      </Suspense>
    </HydrationBoundary>
  );
}
