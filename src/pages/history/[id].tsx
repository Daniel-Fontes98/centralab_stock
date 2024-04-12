import { historyColumns } from "~/components/history/columns";
import { MainNav } from "~/components/main-nav";
import { DataTable } from "~/components/tables/datatable";
import { api } from "~/utils/api";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function SuppliersPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const data = api.itemMovement.getByItemTypeId.useQuery({
    id: Number(id),
  });
  return (
    <>
      <div className="hidden flex-col pb-4 md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" currentTab={3} />
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
              columns={historyColumns}
              data={data.data}
              columnToFilter="itemType_name"
            />
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    </>
  );
}
