"use client";

import { useRef, useCallback } from "react";
import { Row, flexRender } from "@tanstack/react-table";
import { useIntersectionObserver } from "../_hooks/useIntersectionObserver";
import { Pokemon } from "../_types/pokemon";

type Props = {
  rows: Row<Pokemon>[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  colSpan: number;
};

export const PokemonTableBody = ({
  rows,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  colSpan,
}: Props) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useIntersectionObserver(sentinelRef, handleIntersect);

  return (
    <tbody>
      {rows.map((row) => (
        <tr
          key={row.id}
          className="border-b border-neutral-100 transition-colors"
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-2 text-sm">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}

      <tr>
        <td colSpan={colSpan} className="text-center">
          {isFetchingNextPage ? (
            <div className="py-4 text-sm text-neutral-400">Loading more...</div>
          ) : hasNextPage ? (
            <div ref={sentinelRef} className="h-1" aria-hidden="true" />
          ) : rows.length > 0 ? (
            <div className="py-4 text-sm text-neutral-400">No more Pokémon</div>
          ) : null}
        </td>
      </tr>
    </tbody>
  );
};
