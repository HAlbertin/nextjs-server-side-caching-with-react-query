import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { QUERY_KEYS } from "../_constants/query-keys";
import { api } from "../_data/api";
import { useSearchParams } from "next/navigation";

export const useGetPokemon = () => {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type") || "";

  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [QUERY_KEYS.POKEMONS, selectedType],
      queryFn: ({ pageParam }) =>
        selectedType
          ? api.getPokemonByType({ type: selectedType })
          : api.getPokemons({
              offset: pageParam,
            }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        return Number(new URL(lastPage.next).searchParams.get("offset"));
      },
    });

  const pokemons = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );

  return {
    pokemons,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
};
