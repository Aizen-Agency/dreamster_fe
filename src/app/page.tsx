"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
    const role = Cookies.get('role')
    console.log(isLoggedIn);

    if (isLoggedIn) {
      if (role === 'musician') {
        router.push("/dashboard/musician");
      } else if (role === 'fan') {
        router.push("/collection");
      } else {
        router.push("/dashboard/admin");
      }
    } else {
      router.push("/auth/login/email");
    }
  }, [router]);

  return null;
}
