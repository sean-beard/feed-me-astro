import { useEffect, useState } from "react";
import YouTubeIframeLoader from "youtube-iframe";

import "./styles.css";

const PLAYER_ID = "player";

interface YoutubePlayer {
  setPlaybackRate: (rate: number) => void;
}

interface Props {
  videoId: string;
}

export const YoutubeVideo = ({ videoId }: Props) => {
  const [player, setPlayer] = useState<YoutubePlayer | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const loadPlayer = (YT: any) => {
    const newPlayer = new YT.Player(PLAYER_ID, {
      height: "315",
      width: "560",
      videoId,
    });

    setPlayer(newPlayer);
  };

  useEffect(() => {
    YouTubeIframeLoader.load(loadPlayer);
  }, []);

  const handlePlaybackRateChange = () => {
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
    player && player.setPlaybackRate(newRate);
  };

  return (
    <>
      <button className="btn" type="button" onClick={handlePlaybackRateChange}>
        {playbackRate + "x"}
      </button>

      <div className="video-container">
        <div className="video-wrapper">
          <div id={PLAYER_ID}></div>
        </div>
      </div>
    </>
  );
};
