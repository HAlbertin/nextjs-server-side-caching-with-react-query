import { Pokemon, PokemonType } from "../_types/pokemon";
import { pokemonTransformer, sleep } from "./api-utils";

export const api = {
  getPokemons: async ({
    limit = 30,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  }) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
    );

    const data = await response.json();
    const results = pokemonTransformer(data.results);

    return {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results,
    };
  },

  getPokemonByType: async ({ type }: { type?: string }) => {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    const results = pokemonTransformer(
      data.pokemon.map((p: { pokemon: Pokemon }) => p.pokemon),
    );

    return { count: results.length, next: null, previous: null, results };
  },

  getPokemonTypes: async (): Promise<PokemonType[]> => {
    console.log("fetching pokemon types!");

    // simulating a heavy request
    await sleep(5000);

    const response = await fetch(
      "https://pokeapi.co/api/v2/type?offset=0&limit=25",
    );
    const data = await response.json();

    return data.results;
  },
};
