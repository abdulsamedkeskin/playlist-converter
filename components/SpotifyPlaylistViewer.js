"use client";
import { Card, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export default function SpotifyPlaylistViewer({ playlists }) {
  const router = useRouter();

  const handlePress = (e) => {
    (async () => {
      const index = e.target.attributes["data-index"].value;
      const accessToken = localStorage.getItem("spotifyToken");
      const requestOptions = {
        headers: { Authorization: accessToken },
      };
      const spotifyPlaylistUrl = playlists[index].href;
      const spotifyPlaylistReq = await fetch(
        spotifyPlaylistUrl,
        requestOptions
      );
      const spotifyPlaylistRes = await spotifyPlaylistReq.json();
      const trackList = [];
      spotifyPlaylistRes.tracks.items.map((item, index) => {
        const names = [];
        item.track.artists.map((i) => {
          names.push(i.name);
        });
        const fullName = names.join(" ") + " " + item.track.name;
        console.log();
        trackList.push({
          name: item.track.name,
          fullName,
          artists: names,
        });
      });
      localStorage.setItem("spotifyTracks", JSON.stringify(trackList));
    })();
    router.push("/");
  };

  return (
    <>
      {playlists.map((item, index) => (
        <Card isFooterBlurred radius="lg" className={`border-none`} key={index}>
          <Button
            style={{
              width: item.images[1].width,
              height: item.images[1].height,
            }}
            onPress={handlePress}
            data-index={index}
          >
            <Image
              alt=""
              className="object-cover"
              height={item.images[1].height}
              src={item.images[1].url}
              width={item.images[1].width}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <p className="text-tiny text-white/80">{item.name}</p>
              <Button
                className="text-tiny text-white bg-black/20"
                variant="flat"
                color="default"
                radius="lg"
                size="sm"
              >
                {item.tracks.total}
              </Button>
            </CardFooter>
          </Button>
        </Card>
      ))}
    </>
  );
}
