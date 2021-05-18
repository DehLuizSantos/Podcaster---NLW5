import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    toggleLoop: () => void;
    isShuffling: boolean;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContextProvider = ({ children }) => {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const play = (episode) => {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true);
    }

    const playList = (list: Episode[], index: number) => {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const toggleLoop = () => {
        setIsLooping(!isLooping)
    }

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling)
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    const playNext = () => {

        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    const playPrevious = () => {

        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    const setPlayingState = (state: boolean) => {
        setIsPlaying(state)
    }

    const clearPlayerState = () => {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)

    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play,
            playList,
            playNext,
            playPrevious,
            togglePlay,
            isPlaying,
            setPlayingState,
            toggleLoop,
            isLooping,
            toggleShuffle,
            isShuffling,
            hasNext,
            hasPrevious,
            clearPlayerState,
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}