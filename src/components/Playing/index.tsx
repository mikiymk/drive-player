import React from "react";

import AudioInfo from "audio/AudioInfo";
import { Files } from "components/MusicPlayer";
import useJacket from "hooks/useJacket";
import { stylePlaying } from "./style.css";

type Props = {
  info: AudioInfo;
  files: Files;
  playingList: Iterable<string>;
};

/**
 * now playing audio info view
 */
const PlayingInfo: React.FC<Props> = ({ files, info, playingList }) => {
  const jacket = useJacket(info.picture?.[0]);

  return (
    <div className={stylePlaying}>
      <span>{info.album}</span>
      <img src={jacket} alt="album jacket" />
      <ol>
        {Array.from(playingList).map((id, index) => (
          <li key={index}>{files[id].name}</li>
        ))}
      </ol>
    </div>
  );
};

export default PlayingInfo;
