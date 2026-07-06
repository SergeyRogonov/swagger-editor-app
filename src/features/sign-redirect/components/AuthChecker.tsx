"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch("/api/authentication/is-auth");
      const isAuth = response.status === 200;
      setIsAuth(isAuth);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isLoading) return;

    const isSignPage =
      pathname.includes("sign-in") ||
      pathname.includes("sign-up") ||
      pathname.includes("about");
    const isProtectedPage = !isSignPage && pathname !== "/";

    if (isAuth && isSignPage) {
      router.push("/");
      return;
    }

    if (!isAuth && isProtectedPage) {
      router.push("/sign-in");
      return;
    }
  }, [isAuth, isLoading, pathname, router]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return children;
}
