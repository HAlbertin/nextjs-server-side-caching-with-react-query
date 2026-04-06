export type PokemonType = { name: string; url: string };

export type Pokemon = { id: string; name: string; url: string };

export type PokemonPage = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};
