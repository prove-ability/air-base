import "server-only";
import { auth } from "@/server/auth";
import { NavClient } from "@/components/shared/nav-client";

interface NavProps {
  children: React.ReactNode;
}

export async function Nav({ children }: NavProps) {
  const session = await auth();

  return <NavClient session={session}>{children}</NavClient>;
}
