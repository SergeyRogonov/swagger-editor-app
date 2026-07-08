"use client";

import { useAuth } from "@/provider/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOutPage() {
  const { isAuth } = useAuth();
  const route = useRouter();

  useEffect(() => {
    (async function () {
      if (isAuth) {
        await fetch("/api/authentication/logout", {
          method: "POST",
        });

        window.location.reload();
      } else {
        route.push("/");
      }
    })();
  }, [route, isAuth]);

  return null;
}
