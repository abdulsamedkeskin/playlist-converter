"use client";
import { useEffect, useState } from "react";
import SpotifyPlaylistViewer from "@/components/SpotifyPlaylistViewer";
import { useRouter } from "next/navigation";

export default function Page() {
  // const [playlists, setPlaylists] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("spotifyToken");
    const requestOptions = {
      headers: { Authorization: accessToken },
    };
    (async () => {
      const userIdUrl = "https://api.spotify.com/v1/me";
      const userIdReq = await fetch(userIdUrl, requestOptions);
      const userIdRes = await userIdReq.json();
      const id = userIdRes["id"];
      localStorage.setItem("spotifyId", id);
      // const playlistsUrl = `https://api.spotify.com/v1/users/${id}/playlists`;
      // const playlistsReq = await fetch(playlistsUrl, requestOptions);
      // const playlistsRes = await playlistsReq.json();
      // setPlaylists(playlistsRes.items);
      router.push("/");
    })();
  }, [router]);

  return (
    <div className="flex w-screen h-screen items-center justify-center">
      {/* {playlists && <SpotifyPlaylistViewer playlists={playlists} />} */}
    </div>
  );
}
