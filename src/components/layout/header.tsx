"use client";

import { type Session } from "next-auth";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-border bg-background px-4 py-3 md:left-[280px]">
      <div className="flex items-center justify-end gap-4">
        <ThemeToggle />
        {session?.user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {session.user.name}
            </span>
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="프로필"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
