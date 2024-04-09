import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/column-header";
import type { ItemType } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { api } from "~/utils/api";

const ItemsColumnsHook = () => {
  const deleteItem = api.itemType.delete.useMutation();

  async function handleItemDelete(id: number) {
    try {
      await deleteItem.mutateAsync({
        id: id,
      });
    } catch (err) {
      console.error(err);
    }
  }

  const itemsColumns: ColumnDef<ItemType & { supplier: { name: string } }>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
    },
    {
      accessorKey: "unitPrice",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Preço por Unidade" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div>{item.unitPrice} AOA</div>;
      },
    },
    {
      accessorKey: "boxQuantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantidade/Caixa" />
      ),
    },
    {
      accessorKey: "alertMin",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Valor Minimo de Alerta" />
      ),
    },
    {
      accessorKey: "totalQuantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Em Stock" />
      ),
    },
    {
      accessorKey: "supplier.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fornecedor" />
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/itemMovement/createAdd/${item.id}`}>
                  <DropdownMenuItem>Adicionar </DropdownMenuItem>
                </Link>
                <Link href={`/itemMovement/createRem/${item.id}`}>
                  <DropdownMenuItem>Retirar </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href={`/itemMovement/history/${item.id}`}>
                  <DropdownMenuItem>Ver Histórico</DropdownMenuItem>
                </Link>
                <Link href={`/items/update/${item.id}`}>
                  <DropdownMenuItem>Editar </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DialogTrigger>Apagar</DialogTrigger>
                  <DialogContent className=" sm:max-w-[425px]">
                    <DialogHeader className="space-y-4">
                      <DialogTitle>Apagar item</DialogTitle>
                      <DialogDescription>
                        Tem a certeza que quer continuar? Esta acção não é
                        revertível e apagará todos os movimentos associados.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                      <Button
                        onClick={() => handleItemDelete(item.id)}
                        variant="destructive"
                        type="submit"
                      >
                        Apagar
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Fechar
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        );
      },
    },
  ];
  return itemsColumns;
};

export default ItemsColumnsHook;
