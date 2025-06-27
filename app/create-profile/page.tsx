"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type ApiResponse = {
  message: string;
  error?: string;
};

async function createProfileRequest() {
  const response = await fetch("/api/create-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ensure Clerk cookie is sent
  });
  const data = await response.json();
  return data as ApiResponse;
}

export default function CreateProfile() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const hasTriggered = useRef(false); // prevent double execution

  const { mutate, isPending } = useMutation<ApiResponse, Error>({
    mutationFn: createProfileRequest,
    onSuccess: (data) => {
      alert(data.message);
      console.info("Profile created:", data);
      router.push("/subscribe");
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && !isPending && !hasTriggered.current) {
      hasTriggered.current = true;
      console.log("User is signed in, creating profile...");
      mutate();
    }
  }, [isLoaded, isSignedIn, isPending, mutate]);

  return <div>Processing sign in...</div>;
}
