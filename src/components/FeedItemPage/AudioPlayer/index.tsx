import { useRef, useState } from "react";
import type { FeedItem } from "utils/types";

import "./styles.css";

interface Props {
  feedItem: FeedItem & { mediaUrl: string };
}

export const AudioPlayer = ({ feedItem }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const handleRewind = () => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    audioElement.currentTime = audioElement.currentTime - 10;
  };

  const handleFastForward = () => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    audioElement.currentTime = audioElement.currentTime + 30;
  };

  const handlePlaybackRateChange = () => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    let newRate: number;

    switch (playbackRate) {
      case 1:
        newRate = 1.5;
        break;
      case 1.5:
        newRate = 2;
        break;
      case 2:
        newRate = 1;
        break;
      default:
        newRate = 1;
    }

    setPlaybackRate(newRate);
    audioElement.playbackRate = newRate;
  };

  const postCurrentTime = async () => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    const item = { ...feedItem, currentTime: audioElement.currentTime };

    try {
      const data = await fetch("/item.json", {
        method: "PUT",
        body: JSON.stringify({ items: [item] }),
        headers: { "Content-Type": "application/json" },
      });

      if (data.status !== 200) {
        // TODO: handle error
        return;
      }
    } catch {
      // TODO: handle error
    }
  };

  const setCurrentTime = () => {
    const audioElement = audioRef.current;

    if (!audioElement || !feedItem.currentTime) return;

    audioElement.currentTime = Number(
      Math.floor(feedItem.currentTime).toFixed(1)
    );
  };

  return (
    <>
      <button className="btn" onClick={handleRewind}>
        <i className="material-icons">replay_10</i>
        <span className="visually-hidden">Rewind 10 seconds</span>
      </button>

      <button className="btn" onClick={handlePlaybackRateChange}>
        {playbackRate + "x"}
      </button>

      <button className="btn" onClick={handleFastForward}>
        <i className="material-icons">forward_30</i>
        <span className="visually-hidden">Fast forward 30 seconds</span>
      </button>

      <figure>
        <audio
          ref={audioRef}
          controls
          src={feedItem.mediaUrl}
          preload="auto"
          onLoadedData={setCurrentTime}
          onPause={postCurrentTime}
        >
          Oops! Your browser does not support the
          <code>audio</code> element.
        </audio>

        <figcaption
          dangerouslySetInnerHTML={{ __html: feedItem.description }}
        />
      </figure>
    </>
  );
};
