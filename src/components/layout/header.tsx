"use client";

import { type Session } from "next-auth";
import Image from "next/image";

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-[#0A0A0A] md:left-[280px]">
      <div className="flex items-center justify-end">
        {session?.user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
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
