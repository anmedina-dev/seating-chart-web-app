import fetcher from "@/lib/fetch";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { ClassRoom } from "@/interfaces";
import axios from "axios";

export default function ShowClass({ period }: any) {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user ? user.id : "";
  const { data, error, isLoading } = useSWR(`/api/clerk?id=` + userId, fetcher);

  return <div>ShowClass {period}</div>;
}
