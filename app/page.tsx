import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Pokemons } from "./_components/Pokemons";
import { prefetchPokemonTypes } from "./_services/prefetch-pokemon-types";

export default function Home() {
  const queryClient = prefetchPokemonTypes();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Pokemons />
    </HydrationBoundary>
  );
}
