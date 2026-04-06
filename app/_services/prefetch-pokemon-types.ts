import { QUERY_KEYS } from "../_constants/query-keys";
import { api } from "../_data/api";
import { getQueryClient } from "../_providers/get-query-client";
import { persister } from "../_storage/persister";

export const prefetchPokemonTypes = () => {
  const queryClient = getQueryClient();

  // "look ma, no await" (best comment from https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.POKEMON_TYPES],
    queryFn: api.getPokemonTypes,
    persister: persister.persisterFn,
  });

  return queryClient;
};
