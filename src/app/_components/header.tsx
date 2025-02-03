"use client";

import { type Session } from "next-auth";

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-gray-200 bg-white px-4 py-3 md:left-[280px] dark:border-gray-800 dark:bg-[#0A0A0A]">
      <div className="flex items-center justify-end">
        {session?.user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {session.user.name}
            </span>
            {session.user.image && (
              <img
                src={session.user.image}
                alt="프로필"
                className="h-8 w-8 rounded-full"
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
