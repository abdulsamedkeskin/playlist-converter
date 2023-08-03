"use client";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import {
  spotifyBaseUrl,
  spotifyClientId,
  spotifyRedirectUri,
  spotifyScope,
  youtubeBaseUrl,
  youtubeClientId,
  youtubeRedirectUri,
  youtubeScope,
} from "./constants";

export default function Page() {
  const router = useRouter();

  const isSpotifyDisabled =
    localStorage.getItem("spotifyToken") && localStorage.getItem("spotifyId")
      ? true
      : false;

  const isYoutubeDisabled =
    localStorage.getItem("youtubeTracks") &&
    localStorage.getItem("youtubeToken")
      ? true
      : false;

  const handleSpotify = () => {
    const url = `${spotifyBaseUrl}?response_type=token&client_id=${spotifyClientId}&redirect_uri=${encodeURIComponent(
      spotifyRedirectUri
    )}&scope=${encodeURIComponent(spotifyScope)}`;
    router.push(url);
  };

  const handleYoutube = () => {
    const url = `${youtubeBaseUrl}?response_type=token&client_id=${youtubeClientId}&redirect_uri=${encodeURIComponent(
      youtubeRedirectUri
    )}&scope=${encodeURIComponent(youtubeScope)}`;
    router.push(url);
  };

  const handleConvert = () => {
    router.push("/convertToSpotify");
  };

  return (
    <div>
      <div className="flex flex-col w-screen h-screen items-center justify-center gap-3">
        <div className="flex gap-3 flex-row">
          <Button
            color="primary"
            variant={isSpotifyDisabled ? "bordered" : "solid"}
            onClick={handleSpotify}
            isDisabled={isSpotifyDisabled}
          >
            Spotify
          </Button>
          <Button
            color="primary"
            variant={isYoutubeDisabled ? "bordered" : "solid"}
            onClick={handleYoutube}
            isDisabled={isYoutubeDisabled}
          >
            Youtube Music
          </Button>
        </div>
        <Button
          onClick={handleConvert}
          isDisabled={!isYoutubeDisabled || !isSpotifyDisabled}
          variant="bordered"
          color="secondary"
        >
          Convert to Spotify
        </Button>
      </div>
    </div>
  );
}
