"use client";

import { useAuth } from "@/provider/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
  const { checkAuth, isAuth } = useAuth();
  const route = useRouter();

  useEffect(() => {
    (async function () {
      await fetch("/api/authentication/logout", {
        method: "POST",
      });
      checkAuth();
    })();
  }, []);

  useEffect(() => {
    if (!isAuth) {
      route.push("/");
    }
  }, [isAuth]);

  return null;
}
