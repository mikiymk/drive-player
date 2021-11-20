import React, { useState, useEffect } from "react";

export const SeekBar: React.FC<{
  duration: number;
  time: number;
  seek: (time: number) => void;
}> = ({ duration, time, seek }) => {
  const [seekTime, setSeekTime] = useState(0);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (!click) {
      setSeekTime(Math.round(time * 1000));
    }
  }, [time]);

  const onClickDown = () => {
    setClick(true);
  };

  const onClickUp = () => {
    setClick(false);
    seek(seekTime / 1000);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setSeekTime(parseInt(event.target.value, 10));
  };

  return (
    <input
      type="range"
      min="0"
      max={duration * 1000}
      value={seekTime}
      onChange={onChange}
      onInput={onChange}
      onMouseDown={onClickDown}
      onMouseUp={onClickUp}
      onTouchStart={onClickDown}
      onTouchEnd={onClickUp}
    />
  );
};
