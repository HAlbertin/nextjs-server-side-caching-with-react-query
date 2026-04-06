import { Pokemon } from "../_types/pokemon";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getPokemonIdFromUrl = (url: string) => {
  const id = url.split("/").filter(Boolean).pop();
  return `#${String(id).padStart(4, "0")}`;
};

export const pokemonTransformer = (p: Pokemon[]) => {
  return p.map((pokemon) => {
    const id = getPokemonIdFromUrl(pokemon.url);
    return {
      ...pokemon,
      id,
    };
  });
};
