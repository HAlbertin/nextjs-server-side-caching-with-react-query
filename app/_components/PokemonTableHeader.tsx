import { HeaderGroup, flexRender } from "@tanstack/react-table";
import { Pokemon } from "../_types/pokemon";

type Props = {
  headerGroups: HeaderGroup<Pokemon>[];
};

export const PokemonTableHeader = ({ headerGroups }: Props) => {
  return (
    <thead>
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id} className="bg-neutral-50">
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500"
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};
