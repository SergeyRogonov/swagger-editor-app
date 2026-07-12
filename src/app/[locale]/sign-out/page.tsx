"use client";

import { useAuth } from "@/provider/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SignOutPage() {
  const { isAuth, logout } = useAuth();
  const router = useRouter();
  const ranRef = useRef(false);

  useEffect(() => {
    if (!isAuth || ranRef.current) return;

    ranRef.current = true;
    (async () => {
      await logout();
      router.replace("/");
    })();
  }, [isAuth, logout, router]);

  return null;
}
