import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/column-header";
import type { ItemMovement } from "@prisma/client";
import { format } from "date-fns";

export const historyColumns: ColumnDef<
  ItemMovement & { itemMovementType: { name: string } } & {
    itemType: { name: string };
  }
>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => {
      const itemMovement = row.original;
      return <div>{format(itemMovement.createdAt, "dd/MM/yyyy kk:mm")}</div>;
    },
  },
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
    cell: ({ row }) => <div>{row.getValue("isBoxes") ? "Sim" : "Não"}</div>,
  },
];
