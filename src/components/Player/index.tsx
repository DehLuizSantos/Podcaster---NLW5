import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';


import { PlayerContext } from '../../contexts/PlayerContext';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)

    const [progress, setProgress] = useState(0)
    const setUpProgressListener = () => {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }
    const handleSeek = (amount: number) => {
        audioRef.current.currentTime = amount;
        setProgress(amount)
    }

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        isLooping,
        toggleLoop,
        hasNext,
        hasPrevious,
        isShuffling,
        toggleShuffle,
        clearPlayerState,
    } = useContext(PlayerContext)

    useEffect(() => {
        if (!audioRef.current) {
            return
        }
        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    const handleEpisodeEnded = () => {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                    <strong>
                        {episode.title}
                    </strong>
                    <span>{episode.members}</span>

                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />)}
                    </div>
                    <span>{episode ? convertDurationToTimeString(episode.duration) : '00:00:00'}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        onEnded={handleEpisodeEnded}
                        onLoadedMetadata={setUpProgressListener}
                        autoPlay
                    />
                )}

                <div className={styles.buttons}>
                    <button
                        type='button'
                        disabled={!episode || episodeList.length == 1}
                        onClick={() => toggleShuffle()}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Aleatório" />
                    </button>
                    <button type='button' disabled={!episode || !hasPrevious} onClick={playPrevious} >
                        <img src="/play-previous.svg" alt="Anterior" />
                    </button>
                    <button
                        type='button'
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying ? <img src="/pause.svg" alt="Anterior" /> : <img src="/play.svg" alt="Anterior" />}
                    </button>
                    <button type='button' disabled={!episode || !hasNext} onClick={() => playNext()}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button
                        type='button'
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}