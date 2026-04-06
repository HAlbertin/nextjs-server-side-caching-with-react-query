"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { QUERY_KEYS } from "../_constants/query-keys";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "../_data/api";

export const PokemonTypesSelect = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedType = searchParams.get("type") || "";

  const { data: types } = useSuspenseQuery({
    queryKey: [QUERY_KEYS.POKEMON_TYPES],
    queryFn: api.getPokemonTypes,
  });

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    router.replace(`?${params.toString()}`);
  };

  return (
    <select
      id="pokemon-type-select"
      value={selectedType}
      onChange={(e) => handleTypeChange(e.target.value)}
      className="p-2 border border-neutral-secondary rounded-base w-fit"
    >
      <option className="bg-black text-white" value="">
        All Types
      </option>

      {types?.map(({ name }) => (
        <option
          className="bg-black capitalize text-white"
          key={name}
          value={name}
        >
          {name}
        </option>
      ))}
    </select>
  );
};
