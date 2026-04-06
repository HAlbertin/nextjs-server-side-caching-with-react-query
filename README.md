# Next.js Server-Side Caching with React Query Prefetch + Dehydration

This is a Next.js example project that demonstrates how to solve the "fetch trigger when navigating" problem when using prefetch queries that stream to the client side.
It uses the [PokeAPI](https://pokeapi.co/) for example purposes.

It has an infinite scrolling table with all the Pokémon names/IDs and, at the top, a select to filter the Pokémon by Type. Those types are loaded by a prefetch query. When a type is selected, it appends to the Search Params and the filtered data is loaded in the table.

## The Problem

If your Next.js page has a prefetch query, it will fetch on the server and will be dehydrated on the client side. This is done by React Query (more at https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr).

This example is using the Streaming strategy, so "look ma, no await" (thanks @tkdodo for this comment)! That means the query starts on the server, Next.js streams any part that is ready to show, while loading (Suspense) anything that is pending. When the prefetched query is ready, it will stream the data to the client.

So far so good! Well... until you navigate! Let's say a page has a table with some data, and some filters to be applied. Every time a filter is applied, it updates the Search Params in the URL. That means a Navigation happens! The render will come from the Server (Next.js way to do it) and... YES, EXACTLY! Our prefetch query will fetch again! Since our client side has cached data already, the only downside here is fetching again and flooding our server and the target API.

![without cache](docs/images/without-cache.png)

## Solving the Problem

This is the part I discussed with Dominik Dorfmeister at the React Paris conference! While [Tanstack Start](https://tanstack.com/start/latest) solves that already, for Next.js probably the simplest solution is to cache the response received in the prefetch query in a storage (Redis or in-memory, e.g.). When the prefetch happens again (by navigation, for example), we check if there's anything in the cache and just return from it, avoiding the unnecessary fetch!

### First Solution

This attempt is without using a [persister](https://tanstack.com/query/latest/docs/framework/react/plugins/createAsyncStoragePersister). This solves the problem, but it creates another: the query will execute the entire lifecycle since it needs to run the `queryFn`.

```ts
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
```

### Second Solution

Same as the first attempt, but instead of returning the cache inside of the `queryFn`, we set the Query Data and skip the whole prefetch. 

```ts
const queryClient = getQueryClient();

const cached = await storage.getItem(QUERY_KEYS.POKEMON_TYPES);
if (cached) {
  queryClient.setQueryData([QUERY_KEYS.POKEMON_TYPES], JSON.parse(cached));
  return queryClient;
}

queryClient.prefetchQuery({
  queryKey: [QUERY_KEYS.POKEMON_TYPES],
  queryFn: async () => {
    const data = await api.getPokemonTypes();
    await storage.setItem(QUERY_KEYS.POKEMON_TYPES, JSON.stringify(data));

    return data;
  },
});
```

### Third Solution

This one uses the [experimental_createQueryPersister](https://tanstack.com/query/latest/docs/framework/react/plugins/createPersister). We use it to create an async storage based on our storage strategy, and pass that Persister to our Query. In that way, the persister will handle the "restore from cache", without the need of executing the queryFn or doing it manually (like the first or second solutions).

```ts
export const persister = experimental_createQueryPersister({
  storage,
  maxAge: MAX_STALE_TIME,
});
```

```ts
queryClient.prefetchQuery({
  queryKey: [QUERY_KEYS.POKEMON_TYPES],
  queryFn: api.getPokemonTypes,
  persister: persister.persisterFn,
});
```

![with cache](docs/images/with-cache.png)

## Query Key

An interesting point is to note that the Server Cache shares the same Query Key. That can get messy depending on what you want to cache. **REMEMBER**, this is on the server and is shared between users!
If the data can be shared across users (common list of data, for example), that can work with no changes. BUT, if you are prefetching something that is UNIQUE per user, you might need another a different Query Key here!

Some initial thoughts to fix this are probably using a combination of the User ID with the Query Key... Probably the Storage will have one key, and we map it back when resolving? That's another interesting case I'd like to explore soon!

## Key Files

- [app/page.tsx](./app/page.tsx): Server entrypoint that prefetches and dehydrates.
- [app/_services/prefetch-pokemon-types.ts](./app/_services/prefetch-pokemon-types.ts): Prefetch the Pokemon Types and cache it in the server.
- [app/_providers/get-query-client.ts](./app/_providers/get-query-client.ts): QueryClient config, stale time, and dehydration behavior. Default config from https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr.
- [app/_providers/providers.tsx](./app/_providers/providers.tsx): Client QueryClientProvider wrapper. Default config from https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr.
- [app/_storage/storage.ts](./app/_storage/storage.ts): Storage driver selection (Redis vs local in-memory).
- [app/_storage/redis-storage.ts](./app/_storage/redis-storage.ts): Redis implementation.
- [app/_storage/in-memory-storage.ts](./app/_storage/in-memory-storage.ts): In-memory fallback with manual expiration.
- [app/_constants/cache.ts](./app/_constants/cache.ts): Shared stale time constant.
- [app/_constants/query-keys.ts](./app/_constants/query-keys.ts): Centralized query keys.

## Checking and Running the Project

There is a `console.log` in the API used by the prefetch: `fetching pokemon types!`. If you disable the server cache in the `app/_services/prefetch-pokemon-types.ts` file, you will notice that every time you filter by a type, this console log will appear!

`npm run dev` and have fun checking the logs!
