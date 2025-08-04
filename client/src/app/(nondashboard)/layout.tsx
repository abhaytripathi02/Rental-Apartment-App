"use client";

import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  
  // API Call - Fetch the authenticated user data
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  console.log("Auth User in nondashboard Layout:", authUser);

  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  if (authUser) {
    const userRole = authUser.userRole?.toLowerCase();

    if (
      userRole === "manager" &&
      (pathname.startsWith("/search") || pathname === "/")
    ) {
      router.push("/managers/properties", { scroll: false });
    } else {
      setIsLoading(false); // ✅ Always call it if not redirecting
    }
  } else if (!authLoading) {
    // Edge case: if there's no authUser and not loading anymore
    setIsLoading(false);
  }
  }, [authUser, authLoading, router, pathname]);


  if (authLoading || isLoading) return <>Loading...</>;

  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className={`h-full flex w-full flex-col`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
