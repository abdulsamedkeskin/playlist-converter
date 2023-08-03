"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/switch";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function Page() {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(true);
  const [playlistName, setPlaylistName] = useState("");
  const [validationState, setValidationState] = useState(null);

  useEffect(() => {
    localStorage.getItem("youtubeTracks") &&
    localStorage.getItem("spotifyToken") &&
    localStorage.getItem("spotifyId")
      ? null
      : router.push("/");
  }, [router]);

  const handlePress = () => {
    if (
      new Date().getTime() >=
      new Date().setTime(localStorage.getItem("spotifyExpiresIn"))
    ) {
      localStorage.removeItem("spotifyExpiresIn");
      localStorage.removeItem("spotifyToken");
      localStorage.removeItem("spotifyId");
      router.push("/");
      return;
    }
    if (playlistName === "") {
      setValidationState("invalid");
      return;
    } else {
      setValidationState("valid");
    }
    const spotifyId = localStorage.getItem("spotifyId");
    const uris = [];
    const accessToken = localStorage.getItem("spotifyToken");
    const requestOptions = {
      headers: { Authorization: accessToken },
    };
    (async () => {
      const trackList = JSON.parse(localStorage.getItem("youtubeTracks"));
      trackList.map(async (item, index) => {
        const searchUrl = `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(
          item.name
        )}&type=track&limit=1`;
        const searchReq = await fetch(searchUrl, requestOptions);
        const searchRes = await searchReq.json();
        try {
          if (
            searchRes.tracks.items[0].artists
              .map((i) => i.name)
              .join(" ")
              .includes(item.artists.join(" "))
          ) {
            uris.push(searchRes.tracks.items[0].uri);
          }
        } catch (err) {}
      });
    })();

    // create a new playlist and add the tracks
    (async () => {
      const createPlaylistUrl = `https://api.spotify.com/v1/users/${spotifyId}/playlists`;
      const createPlaylistReq = await fetch(createPlaylistUrl, {
        method: "POST",
        headers: requestOptions.headers,
        body: JSON.stringify({
          name: playlistName,
          public: !isSelected,
        }),
      });
      const createPlaylistRes = await createPlaylistReq.json();
      const playlistUrl = createPlaylistRes.href + "/tracks";
      const addToPlaylistReq = await fetch(playlistUrl, {
        method: "POST",
        headers: requestOptions.headers,
        body: JSON.stringify({
          uris,
        }),
      });
      router.push("/success");
    })();
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center flex-col gap-5">
      <div className="flex flex-row gap-5">
        <Input
          isRequired
          type="text"
          label="Playlist Name"
          className="max-w-xs"
          variant="bordered"
          placeholder="Enter a name"
          validationState={validationState}
          onValueChange={(e) => setPlaylistName(e)}
        ></Input>
        <Switch isSelected={isSelected} onValueChange={setIsSelected}>
          Private
        </Switch>
      </div>
      <Button onPress={handlePress}>Convert</Button>
    </div>
  );
}
