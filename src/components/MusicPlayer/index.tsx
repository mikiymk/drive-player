import PlayingInfo from "../Playing/index";
import MusicList from "../MusicLibrary/index";
import DriveFiles from "../GoogleDrive/index";
import Menu from "../Menu/index";
import Controller from "../Controller/index";

import type { File } from "~/file";
import RightMenuProvider from "~/components/RightMenu";
import Settings from "../Settings";
import Playlists from "../Playlist";
import usePlaylist from "./usePlaylist";
import { stylePlayer } from "./style.css";
import useMusicPlayer from "~/hooks/useMusicPlayer";
import useSignIn from "~/hooks/useSignIn";
import type { JSXElement } from "solid-js";
import createLibrary from "./createLibrary";
import {
  IconGoogleDrive,
  IconLibrary,
  IconPlay,
  IconPlayList,
  IconSettings,
} from "../Icon";

export type Files = {
  [name: string]: File;
};

/**
 * react component root.
 */
const MusicPlayer = () => {
  const { accessToken, signIn, signOut } = useSignIn();
  const { select, update } = createLibrary();

  const { player, status } = useMusicPlayer(accessToken);
  const playlist = usePlaylist(select, update);

  const playWithIdList = (idList: string[], index: number) => {
    player?.playWithIdList(idList, index);
  };

  const menuItems: {
    [name: string]: { name: string; icon: JSXElement; element: JSXElement };
  } = {
    playing: {
      name: "Now Playing",
      icon: <IconPlay />,
      element: (
        <PlayingInfo
          info={status.info()}
          playingList={player?.musicIds ?? []}
        />
      ),
    },
    library: {
      name: "Library",
      icon: <IconLibrary />,
      element: (
        <MusicList
          play={playWithIdList}
          playlist={playlist.playlists()}
          addToPlaylist={playlist.addToPlaylist}
        />
      ),
    },
    playlist: {
      name: "Playlist",
      icon: <IconPlayList />,
      element: (
        <Playlists
          playlist={(name: string) => playlist.playlist(name)}
          playlists={playlist.playlists()}
          makePlaylist={playlist.makePlaylist}
          deletePlaylist={playlist.deletePlaylist}
          addToPlaylist={playlist.addToPlaylist}
          removeFromPlaylist={playlist.removeFromPlaylist}
          playsList={playWithIdList}
        />
      ),
    },
    drive: {
      name: "Google Drive",
      icon: <IconGoogleDrive />,
      element: <DriveFiles accessToken={accessToken()} />,
    },
    settings: {
      name: "Settings",
      icon: <IconSettings />,
      element: <Settings accessToken={accessToken()} />,
    },
  };

  return (
    <RightMenuProvider>
      <div class={stylePlayer}>
        <Menu
          items={menuItems}
          auth={{ accessToken: accessToken(), signIn, signOut }}
        />

        <Controller
          info={status.info()}
          duration={status.duration()}
          currentTime={status.currentTime()}
          paused={status.paused()}
          repeat={status.repeat()}
          shuffle={status.shuffle()}
          seek={time => player?.seek(time)}
          play={() => player?.play()}
          pause={() => player?.pause()}
          playNext={() => player?.playToNext()}
          playPrev={() => player?.playToPrev()}
          setRepeat={repeat => player?.setRepeat(repeat)}
          setShuffle={shuffle => player?.setShuffle(shuffle)}
        />
      </div>
    </RightMenuProvider>
  );
};

export default MusicPlayer;
