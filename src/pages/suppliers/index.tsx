import Link from "next/link";
import { MainNav } from "~/components/main-nav";
import { suppliersColumns } from "~/components/suppliers/columns";
import { DataTable } from "~/components/tables/datatable";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function SuppliersPage() {
  const data = api.supplier.getAll.useQuery();
  return (
    <>
      <div className="  flex-col pb-4 md:flex">
        <div className=" border-b">
          <div className=" flex h-16 items-center px-4">
            <MainNav className="mx-6" currentTab={1} />
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
        <div className="z-0 flex-1 space-y-4 overflow-scroll p-8 pt-6">
          {data.data ? (
            <DataTable
              columns={suppliersColumns}
              data={data.data}
              columnToFilter="name"
            />
          ) : (
            <div>Loading</div>
          )}
          <Link href="/suppliers/create">
            <Button>Adicionar Fornecedores</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
