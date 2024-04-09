import Link from "next/link";
import { MainNav } from "~/components/main-nav";
import { DataTable } from "~/components/tables/datatable";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ItemsColumnsHook from "~/components/items/columns";

export default function SuppliersPage() {
  const data = api.itemType.getAll.useQuery();
  const itemsColumns = ItemsColumnsHook();
  return (
    <>
      <div className="hidden flex-col pb-4 md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" currentTab={2} />
            <div className="ml-auto flex items-center space-x-4">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          {data.data ? (
            <DataTable
              columns={itemsColumns}
              data={data.data}
              columnToFilter="name"
            />
          ) : (
            <div>Loading</div>
          )}
          <Link href="/items/create">
            <Button>Adicionar Item</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
