"use client";

import { useState } from "react";
import Link from "next/link";
import { type Session } from "next-auth";
import { Menu, X, Home, Target, LogOut, KeyRound } from "lucide-react";
import { Header } from "@/components/layout/header";

interface NavClientProps {
  session: Session | null;
  children: React.ReactNode;
}

export function NavClient({ session, children }: NavClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "홈", href: "/", icon: Home },
    { name: "목표", href: "/goals", icon: Target },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* 모바일 햄버거 메뉴 */}
      <button
        onClick={toggleMenu}
        className="fixed right-4 top-4 z-50 block rounded-lg p-2 text-gray-600 text-muted-foreground hover:bg-accent hover:bg-gray-100 md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 네비게이션 */}
      <nav
        className={`fixed left-0 top-0 z-40 h-full w-[280px] transform bg-background transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col border-r border-border border-gray-200">
          {/* 로고 */}
          <div className="p-5">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold text-foreground text-gray-900">
                Air Base
              </span>
            </Link>
          </div>

          {/* 메뉴 항목들 */}
          <div className="flex flex-1 flex-col space-y-1 p-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 text-muted-foreground hover:bg-accent hover:bg-gray-100 hover:text-accent-foreground hover:text-gray-900"
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* 로그인/로그아웃 */}
          <div className="border-t border-border border-gray-200 p-3">
            {session?.user ? (
              <div className="space-y-3">
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-600 text-muted-foreground">
                    {session.user.name}
                  </p>
                </div>
                <Link
                  href="/api/auth/signout"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 text-muted-foreground hover:bg-accent hover:bg-gray-100 hover:text-accent-foreground hover:text-gray-900"
                >
                  <LogOut size={18} />
                  로그아웃
                </Link>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 text-muted-foreground hover:bg-accent hover:bg-gray-100 hover:text-accent-foreground hover:text-gray-900"
              >
                <KeyRound size={18} />
                로그인
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* 메인 컨텐츠 래퍼 */}
      <div className="flex flex-1 flex-col md:ml-[280px]">
        <Header session={session} />
        <main className="flex-1 bg-background pt-16">
          <div className="mx-auto h-full p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
