import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { MainNav } from "~/components/main-nav";
import { CalendarDateRangePicker } from "~/components/date-range-picker";
import { Overview } from "~/components/overview";
import { RecentSales, formatCurrency } from "~/components/recent-sales";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import type { DateRange } from "react-day-picker";
import { useState } from "react";
import { api } from "~/utils/api";

export default function DashboardPage() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so adding 1
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const nextMonthFirstDay = new Date(currentYear, currentMonth, 1);

  const [date, setDate] = useState<DateRange | undefined>({
    from: firstDayOfMonth,
    to: nextMonthFirstDay,
  });

  const totalBoughtBetweenDates =
    api.itemMovement.getTotalBoughtBetweenDates.useQuery({
      beginDate: date?.from ?? new Date(2024, 0, 20),
      endDate: date?.to ?? new Date(2025, 0, 20),
    });

  const totalUsedBetweenDate =
    api.itemMovement.getTotalUsedBetweenDates.useQuery({
      beginDate: date?.from ?? new Date(2024, 0, 20),
      endDate: date?.to ?? new Date(2025, 0, 20),
    });

  const numberOfPurchasesThisMonth =
    api.itemMovement.getNumberOfPurchasesThisMonth.useQuery();

  const latestMovements = api.itemMovement.getLast5Purchases.useQuery();
  const purchasedUnits =
    api.itemMovement.getQuantityOfPurchasesBetweenDates.useQuery({
      beginDate: date?.from ?? new Date(2024, 0, 20),
      endDate: date?.to ?? new Date(2025, 0, 20),
    });

  const usedUnits =
    api.itemMovement.getQuantityOfItemsUsedBetweenDates.useQuery({
      beginDate: date?.from ?? new Date(2024, 0, 20),
      endDate: date?.to ?? new Date(2025, 0, 20),
    });

  const moneyFlowByMonth = api.itemMovement.getMoneyFlowByMonth.useQuery();

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" currentTab={0} />
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
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker date={date} setDate={setDate} />
            </div>
          </div>
          <Tabs defaultValue="overview" className=" space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Material Comprado (valor)
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalBoughtBetweenDates.data ?? 0)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Material Gasto (valor)
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalUsedBetweenDate.data ?? 0)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Material comprado (unidades)
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {purchasedUnits.data}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Material Gasto (unidades)
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{usedUnits.data}</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Compras e Gastos 2024 </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview resultsList={moneyFlowByMonth.data ?? []} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Compras Recentes</CardTitle>
                    <CardDescription>
                      Foram feitas {numberOfPurchasesThisMonth.data} compras
                      este mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales itemList={latestMovements.data ?? []} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
