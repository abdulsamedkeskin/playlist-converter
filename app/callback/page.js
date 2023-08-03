"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.split("#")[1];
    const searchParams = new URLSearchParams(hash);
    const accessToken = `${searchParams.get("token_type")} ${searchParams.get(
      "access_token"
    )}`;
    const expiresIn = new Date().setSeconds(searchParams.get("expires_in"));
    if (hash.includes("youtube")) {
      localStorage.setItem("youtubeToken", accessToken);
      localStorage.setItem("youtubeExpiresIn", expiresIn);
      router.push("/youtube");
    } else {
      localStorage.setItem("spotifyToken", accessToken);
      localStorage.setItem("spotifyExpiresIn", expiresIn);
      router.push("/spotify");
    }
  }, [router]);
}
