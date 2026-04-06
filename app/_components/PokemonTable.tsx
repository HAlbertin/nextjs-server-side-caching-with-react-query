"use client";

import { usePokemonTable } from "../_hooks/usePokemonTable";
import { PokemonTableHeader } from "./PokemonTableHeader";
import { PokemonTableBody } from "./PokemonTableBody";
import { Loading } from "./Loading";

export const PokemonTable = () => {
  const { table, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    usePokemonTable();

  return (
    <div className="overflow-x-auto rounded border border-neutral-200">
      <table className="w-full border-collapse text-sm">
        <PokemonTableHeader headerGroups={table.getHeaderGroups()} />
        <PokemonTableBody
          rows={table.getRowModel().rows}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          colSpan={table.getAllColumns().length}
        />
      </table>

      {isFetching && !isFetchingNextPage && (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
};
