import "server-only";
import Link from "next/link";
import { auth } from "@/server/auth";
import { NavClient } from "./nav-client";

interface NavProps {
  children: React.ReactNode;
}

export async function Nav({ children }: NavProps) {
  const session = await auth();

  return <NavClient session={session}>{children}</NavClient>;
}
