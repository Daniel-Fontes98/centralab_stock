import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/column-header";
import type { ItemMovement } from "@prisma/client";

export const historyColumns: ColumnDef<
  ItemMovement & { itemMovementType: { name: string } } & {
    itemType: { name: string };
  }
>[] = [
  {
    accessorKey: "itemMovementType.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
  },
  {
    accessorKey: "itemType.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
  },
  {
    accessorKey: "isBoxes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Caixas" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("isBoxes") ? "X" : ""}</div>
    ),
  },
];
