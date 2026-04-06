"use client";

import { Suspense } from "react";
import { PokemonTypesSelect } from "./PokemonTypesSelect";
import { PokemonTable } from "./PokemonTable";
import { Loading } from "./Loading";

export const Pokemons = () => {
  return (
    <main className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Pokédex</h1>
      <Suspense fallback={<Loading />}>
        <PokemonTypesSelect />
      </Suspense>

      <PokemonTable />
    </main>
  );
};
