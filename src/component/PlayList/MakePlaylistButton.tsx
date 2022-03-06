import React, { useRef } from "react";
import { css } from "@linaria/core";

const style = css``;

type Props = {
  makePlaylist: (playlist: string) => void;
};

/** show on right click */
const MakePlaylistButton: React.FC<Props> = ({ makePlaylist }) => {
  const ref = useRef<HTMLInputElement>(null);

  const addPlaylist = () => {
    const name = ref.current?.value;
    if (name === undefined || name === null || name === "") {
      console.log("input playlist name");
      return;
    }
    try {
      makePlaylist(name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <span className={style}>
      <button onClick={addPlaylist}>add playlist</button>
      <input type="text" ref={ref} />
    </span>
  );
};

export default MakePlaylistButton;
