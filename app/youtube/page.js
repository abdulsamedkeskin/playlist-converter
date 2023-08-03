"use client";
import { useEffect, useState } from "react";
import YoutubePlaylistViewer from "@/components/YoutubePlaylistViewer";

export default function Page() {
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("youtubeToken");
    const requestOptions = {
      headers: { Authorization: accessToken },
    };
    (async () => {
      const reqUrl = `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails,id,snippet&mine=true`; // &key=${youtubeApiKey}
      const req = await fetch(reqUrl, requestOptions);
      const res = await req.json();
      setPlaylists(res.items);
    })();
  }, []);

  return (
    <div className="flex w-screen h-screen items-center justify-center">
      {playlists && <YoutubePlaylistViewer playlists={playlists} />}
    </div>
  );
}
