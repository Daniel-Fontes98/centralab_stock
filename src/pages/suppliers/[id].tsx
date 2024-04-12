import { MainNav } from "~/components/main-nav";
import { DataTable } from "~/components/tables/datatable";
import { api } from "~/utils/api";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import ItemsColumnsHook from "~/components/items/columns";

export default function SuppliersPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const data = api.itemType.getBySupplierId.useQuery({
    id: Number(id),
  });

  const itemsColumns = ItemsColumnsHook();
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
              columns={itemsColumns}
              data={data.data}
              columnToFilter="name"
            />
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    </>
  );
}
