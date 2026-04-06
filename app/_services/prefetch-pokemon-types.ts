import { QUERY_KEYS } from "../_constants/query-keys";
import { api } from "../_data/api";
import { getQueryClient } from "../_providers/get-query-client";
import { storage } from "../_storage/storage";

export const prefetchPokemonTypes = () => {
  const queryClient = getQueryClient();

  // "look ma, no await" (best comment from https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.POKEMON_TYPES],
    queryFn: async () => {
      const cached = await storage.getItem(QUERY_KEYS.POKEMON_TYPES);
      if (cached) return JSON.parse(cached);

      const data = await api.getPokemonTypes();
      await storage.setItem(QUERY_KEYS.POKEMON_TYPES, JSON.stringify(data));

      return data;
    },
  });

  return queryClient;
};
