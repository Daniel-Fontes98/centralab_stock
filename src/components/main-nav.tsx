import Link from "next/link";

import { cn } from "../lib/utils";

interface Props {
  currentTab: number;
}

export function MainNav({
  className,
  currentTab,
  ...props
}: Props & React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentTab === 0 ? "" : "text-muted-foreground",
        )}
      >
        Geral
      </Link>
      <Link
        href="/suppliers/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentTab === 1 ? "" : "text-muted-foreground",
        )}
      >
        Fornecedores
      </Link>
      <Link
        href="/items/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentTab === 2 ? "" : "text-muted-foreground",
        )}
      >
        Items
      </Link>
      <Link
        href="/history/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentTab === 3 ? "" : "text-muted-foreground",
        )}
      >
        Histórico
      </Link>
    </nav>
  );
}
