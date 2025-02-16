import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export const metadata = {
  title: "홈",
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-foreground">
        대시보드
      </main>
    </HydrateClient>
  );
}
