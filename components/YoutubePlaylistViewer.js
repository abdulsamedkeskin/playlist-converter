"use client";
import { Card, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export default function YoutubePlaylistViewer({ playlists }) {
  const router = useRouter();

  const handlePress = (e) => {
    (async () => {
      let results = 0;
      const index = e.target.attributes["data-index"].value;
      const accessToken = localStorage.getItem("youtubeToken");
      const requestOptions = {
        headers: { Authorization: accessToken },
      };
      let youtubePlaylistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=status,id,snippet,contentDetails&playlistId=${playlists[index].id}&maxResults=50`;
      const youtubePlaylistReq = await fetch(
        youtubePlaylistUrl,
        requestOptions
      );
      const youtubePlaylistRes = await youtubePlaylistReq.json();
      const trackList = [];
      youtubePlaylistRes.items.map((item, index) => {
        const snippet = item.snippet;
        const name = snippet.title;
        const artists = snippet.videoOwnerChannelTitle.split(" - Topic")[0];
        const fullName = artists + " " + name;
        trackList.push({
          name,
          artists: [artists],
          fullName,
        });
      });
      results += youtubePlaylistRes.pageInfo.resultsPerPage;
      while (results <= youtubePlaylistRes.pageInfo.totalResults) {
        youtubePlaylistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=status,id,snippet,contentDetails&playlistId=${playlists[index].id}&maxResults=50&pageToken=${youtubePlaylistRes.nextPageToken}`;
        const youtubePlaylistReq_ = await fetch(
          youtubePlaylistUrl,
          requestOptions
        );
        const youtubePlaylistRes_ = await youtubePlaylistReq_.json();
        youtubePlaylistRes_.items.map((item, index) => {
          const snippet = item.snippet;
          const name = snippet.title;
          const artists = snippet.videoOwnerChannelTitle.split(" - Topic")[0];
          const fullName = artists + " " + name;
          trackList.push({
            name,
            artists: [artists],
            fullName,
          });
        });
        results += youtubePlaylistRes_.pageInfo.resultsPerPage;
      }
      localStorage.setItem("youtubeTracks", JSON.stringify(trackList));
    })();
    router.push("/");
  };

  return (
    <>
      {playlists.map((item, index) => (
        <Card isFooterBlurred radius="lg" className={`border-none`} key={index}>
          <Button
            style={{
              width: item.snippet.thumbnails.medium.width,
              height: item.snippet.thumbnails.medium.height,
            }}
            onPress={handlePress}
            data-index={index}
          >
            <Image
              alt=""
              className="object-cover"
              height={item.snippet.thumbnails.medium.height}
              src={item.snippet.thumbnails.medium.url}
              width={item.snippet.thumbnails.medium.width}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <p className="text-tiny text-white/80">{item.snippet.title}</p>
              <Button
                className="text-tiny text-white bg-black/20"
                variant="flat"
                color="default"
                radius="lg"
                size="sm"
              >
                {item.contentDetails.itemCount}
              </Button>
            </CardFooter>
          </Button>
        </Card>
      ))}
    </>
  );
}
