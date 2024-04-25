"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  let router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, []);
  return <div>Loading...</div>;
};

export default Page;
