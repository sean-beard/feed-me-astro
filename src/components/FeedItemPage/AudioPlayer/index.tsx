import { useEffect, useRef, useState } from "react";
import type { FeedItem } from "utils/types";

import "./styles.css";

interface Props {
  feedItem: FeedItem & { mediaUrl: string };
}

export const AudioPlayer = ({ feedItem }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playPauseLabel, setPlayPauseLabel] = useState("▶️");
  const [progressBarValue, setProgressBarValue] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", () => {
        setProgressBarValue(
          (audioElement.currentTime / audioElement.duration) * 100,
        );

        setCurrentTime(
          `${Math.floor(audioElement.currentTime / 60)}:${(
            "0" + Math.floor(audioElement.currentTime % 60)
          ).slice(-2)}`,
        );
      });

      audioElement.addEventListener("loadedmetadata", () => {
        setDuration(
          `${Math.floor(audioElement.duration / 60)}:${(
            "0" + Math.floor(audioElement.duration % 60)
          ).slice(-2)}`,
        );
      });
    }
  }, [audioRef.current]);

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

  const getCurrentTime = () => {
    const audioElement = audioRef.current;

    if (!audioElement || !feedItem.currentTime) return;

    audioElement.currentTime = Number(
      Math.floor(feedItem.currentTime).toFixed(1),
    );
  };

  const handlePlayPause = () => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    if (audioElement.paused) {
      audioElement.play();
      setPlayPauseLabel("⏸️");
    } else {
      audioElement.pause();
      setPlayPauseLabel("▶️");
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    audioElement.volume = Number(event.target.value) / 100;
  };

  return (
    <div className="audio-player-wrapper">
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
          src={feedItem.mediaUrl}
          preload="auto"
          title={feedItem.feedName}
          onLoadedData={getCurrentTime}
          onPause={postCurrentTime}
        >
          Oops! Your browser does not support the
          <code>audio</code> element.
        </audio>
        <div className="custom-audio-controls">
          <button
            style={{
              backgroundColor: "transparent",
              color: "var(--off-white)",
              border: "none",
              fontSize: "2.5rem",
              cursor: "pointer",
              width: "50px",
              height: "50px",
            }}
            onClick={handlePlayPause}
          >
            {playPauseLabel}
          </button>

          <progress
            style={{ display: "none" }}
            value={progressBarValue}
            max="100"
            aria-label="audio progress"
          ></progress>
          <div
            style={{
              flex: 1,
              border: "4px solid var(--light-blue)",
              backgroundColor: "var(--off-white)",
              height: "36px",
            }}
          >
            <div
              style={{
                width: `${(progressBarValue / 100) * 100}%`,
                height: "100%",
                backgroundColor: "var(--light-blue)",
              }}
            />
          </div>

          <p className="audio-time">
            <span>{currentTime}</span>
            <span>/</span>
            <span>{duration}</span>
          </p>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="100"
            aria-label="Volume"
            onChange={handleVolumeChange}
          ></input>
        </div>

        <figcaption
          dangerouslySetInnerHTML={{ __html: feedItem.description }}
        />
      </figure>
    </div>
  );
};
