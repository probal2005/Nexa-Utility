"use client";

import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

type MobileNavProps = {
  pathname?: string;
};

export default function MobileNav({
  pathname = "/",
}: MobileNavProps) {
  const router = useRouter();

  const isHome = pathname === "/";

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-zinc-950/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around gap-2">
        <button
          type="button"
          onClick={handleBack}
          disabled={isHome}
          className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] transition ${
            isHome
              ? "text-zinc-700"
              : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[11px] transition ${
            isHome
              ? "bg-white/10 text-white"
              : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </button>
      </div>
    </div>
  );
}

export { MobileNav };
