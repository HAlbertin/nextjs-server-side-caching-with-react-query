"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { QUERY_KEYS } from "../_constants/query-keys";
import { api } from "../_data/api";
import { Pokemon } from "../_types/pokemon";
import { useGetPokemon } from "./useGetPokemon";

const columnHelper = createColumnHelper<Pokemon>();

const columns = [
  columnHelper.accessor("id", {
    header: "#",
    cell: (info) => <div className="font-mono">{info.getValue()}</div>,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <div className="capitalize">{info.getValue()}</div>,
  }),
];

export const usePokemonTable = () => {
  const {
    pokemons,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetPokemon();

  const table = useReactTable({
    data: pokemons,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return { table, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage };
};
