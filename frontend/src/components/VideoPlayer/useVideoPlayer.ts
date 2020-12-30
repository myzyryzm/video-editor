/** @format */
import { useRef, useState, useEffect } from 'react'
import {
    VideoSources,
    VideoType,
    VideoPlayerHook,
    Dimensions,
    Interval,
} from './commonRequirements'
import {
    defaultFwdTime,
    defaultReplayTime,
    playbackRateDelta,
    maxPlaybackRate,
} from '../Common/constants'

/**
 * Hook that is used in the VideoPlayerContext
 */
export default function useVideoPlayer(
    videoSrc: string,
    inputMetadata: Array<any>
): VideoPlayerHook {
    const currentSources = useRef<VideoSources>({
        current: 'original',
        original: '',
        output: '',
    })

    const player = useRef<HTMLVideoElement>({} as HTMLVideoElement)
    const preMuteVolume = useRef<number>(1.0)
    const playbackRateRef = useRef<number>(1.0)
    const lastPlayTime = useRef<number>(0)
    const duration = useRef<number>(0)
    const subtitles = useRef<string>('')
    const srcInitialized = useRef<boolean>(false)
    const isFullScreen = useRef(false)
    const videoDimensions = useRef<Dimensions>({} as Dimensions)

    const [_isFullScreen, setIsFullScreen] = useState(false)
    const [_videoDimensions, updateVideoDimensions] = useState<Dimensions>(
        {} as Dimensions
    )
    const [mouseOverTime, setMouseOverTime] = useState<number>(-1)
    const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(false)
    const [hasSubtitles, setHasSubtitles] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [_isPlaying, setIsPlaying] = useState<boolean>(false)
    const [playbackRate, setPlaybackRate] = useState<number>(1.0)
    const [volume, setVolume] = useState<number>(1)
    const [currentSourceType, setCurrentSourceType] = useState<VideoType>(
        'original'
    )
    const [_duration, updateDuration] = useState<number>(0)

    useEffect(() => {
        currentSources.current = {
            current: 'original',
            original: videoSrc,
            output: '',
        }
        setHasSubtitles(false)
        enableSubtitles(false)
        updateIsFullScreen(false)
        setProgress(0)
        setIsPlaying(false)
        srcInitialized.current = false
        resetVideoSource()
    }, [videoSrc])

    useEffect(() => {
        // TODO: SET DURATION, VIDEO DIMENSIONS AND OTHER RELEVANT METADATA
    }, [inputMetadata])

    function setVideoDimensions(d: Dimensions) {
        updateVideoDimensions(d)
        videoDimensions.current = d
    }

    function setDuration(d: number) {
        duration.current = d
        updateDuration(d)
    }

    const resetVideoSource = (hasRef = false) => {
        const hasPlayer = hasPlayerRef() || hasRef
        if (
            hasPlayer &&
            currentSources.current.original.length > 0 &&
            !srcInitialized.current
        ) {
            currentSrc('original')
            srcInitialized.current = true
        }
    }

    const hasPlayerRef = (): boolean =>
        player != null && player.current != null && player.current.src != null

    /**
     * Get/set the current player; if getting then it will default to the VideoJsPlayer (if not null) then it will check if there is a slides player else if will return null
     * @function
     * @param plyr -- if a value is given then the function will set a specified player else just return currentPlayer
     * @param pLvl -- power level of video player; 0 for booker and 2 for everything else
     * @return {*} the current player
     */
    function currentPlayer(
        plyr?: HTMLVideoElement
    ): HTMLVideoElement | undefined {
        if (plyr !== undefined) {
            if (plyr === null) {
                // setting plyr to null resets it
                updatePlaybackRate(1)
                updateVolume(1)
            }
            player.current = plyr
            resetVideoSource(true)
        }

        return hasPlayerRef() ? player.current : undefined
    }

    /**
     * Get/set the playback rate of the video player
     * @function
     * @number pbRate -- if a value is given then the funciton will set the playbackRate of the current player; else it returns the playbackRate
     * @returns {number} The playbackRate or the reference to the last updated playbackRate (playbackRateRef).
     */
    function updatePlaybackRate(pbRate: number): void {
        const plyr = currentPlayer()
        if (plyr && pbRate >= 0) {
            plyr.playbackRate = pbRate
            playbackRateRef.current = pbRate
            setPlaybackRate(pbRate)
        }
    }

    /**
     * Get/set the volume of the video player
     * @function
     * @number vol -- if a value is given then the funciton will set the volume of the current player; else it returns the volume
     * @returns {number} The volume or the reference to the last updated volume (volumeRef).
     */
    const updateVolume = (vol: string | number) => {
        const plyr = currentPlayer()
        if (plyr) {
            if (vol === 'mute') {
                const v: number =
                    preMuteVolume.current > 0 ? 0 : preMuteVolume.current
                plyr.volume = v
                setVolume(v)
            } else if (typeof vol === 'number' && vol >= 0) {
                const v: number = vol < 1 ? vol : 1
                plyr.volume = v
                preMuteVolume.current = v
                setVolume(v)
            }
        }
    }

    /**
     * Gets/sets the current source of the current player
     * @param {undefined | string} src
     */
    function currentSrc(src: VideoType | undefined = undefined): string {
        const plyr = currentPlayer()
        if (!plyr) {
            return ''
        }
        if (src !== undefined && src.length > 0) {
            if (
                currentSources.current[src] !== undefined &&
                currentSources.current[src].length > 0
            ) {
                plyr.src = currentSources.current[src]
                currentSources.current.current = src
            } else {
                plyr.src = currentSources.current.original
                currentSources.current.current = 'original'
            }
            setCurrentSourceType(currentSources.current.current)
        }
        return plyr.currentSrc
    }

    function play(): void {
        const plyr = currentPlayer()
        if (plyr) {
            if (paused()) {
                plyr.play()
            }
        }
    }

    function pause(): void {
        const plyr = currentPlayer()
        if (plyr) {
            if (!paused()) {
                plyr.pause()
            }
        }
    }

    /**
     * Check if video is paused.
     * @function
     * @return {*} If the player exists, it will return true or false, otherwise null
     */
    const playing = (): boolean => {
        const plyr = currentPlayer()
        return !plyr ? false : !plyr.paused
    }

    /**
     * Check if video is paused.
     * @function
     * @return {*} If the player exists, it will return true or false, otherwise null
     */
    const paused = (): boolean => {
        const plyr = currentPlayer()
        return !plyr ? false : plyr.paused
    }

    /**
     * Gets all the played intervals
     * @function
     * @returns all the played intervals
     */
    function played(): Array<Interval> {
        const plyr = currentPlayer()
        if (!plyr) {
            return []
        }
        const p = plyr.played
        const num = p.length
        const played: Array<Interval> = []
        for (let i = 0; i < num; i++) {
            played.push({
                start: p.start(i),
                end: p.end(i),
            })
        }
        return played
    }

    /**
     * gets/sets the time of the currentPlayer
     * @function
     * @param {undefined | number} time
     * @returns {number} currentTime of current player
     */
    function currentTime(time: number | undefined = undefined): number {
        const plyr = currentPlayer()
        if (!plyr) {
            return 0
        }
        if (plyr === null) {
            return 0
        }
        if (time !== undefined) {
            time = time > 0 ? time : 0
            plyr.currentTime = time
        }
        return plyr.currentTime
    }

    function onPause(): void {
        setIsPlaying(false)
    }

    function onPlay(): void {
        setIsPlaying(true)
    }

    function onLoadedMetadata(e): void {
        const plyr = currentPlayer()
        if (plyr) {
            setDuration(plyr.duration)
        }
        if (e && e.target) {
            setVideoDimensions({
                width: e.target.videoWidth,
                height: e.target.videoHeight,
            })
        }
    }

    /**
     * Gets all tracks or a specific attached to the player.  if both key and value are set and the track at a specified index exists then this will update the specified track
     * @function
     * @param  dex
     * @param  key
     * @param value
     * @returns will return an array of tracks, a single track or null
     */
    const textTracks = (dex?: number, key?: string, value?: string) => {
        const plyr = currentPlayer()
        if (!plyr) {
            return dex === undefined ? [] : null
        }
        const tracks = plyr.textTracks
        if (dex === undefined) {
            return tracks
        }
        if (dex > tracks.length - 1) {
            return null
        }

        if (key !== undefined && value !== undefined) {
            if (plyr.textTracks[dex][key] !== undefined) {
                plyr.textTracks[dex][key] = value
            }
        }

        return plyr.textTracks[dex]
    }

    /**
     * adds an event listener to the current player
     * @function
     * @param {string} name name of event
     * @param {function} callback function to call
     */
    function addEventListener(name: string, callback: (arg: any) => any): void {
        const plyr = currentPlayer()
        if (plyr) {
            plyr.addEventListener(name, callback)
        }
    }

    /**
     * removes an event from the current player
     * @function
     * @param {string} name name of event
     * @param {function} callback function to call
     */
    function removeEventListener(
        name: string,
        callback: (arg: any) => any
    ): void {
        const plyr = currentPlayer()
        if (plyr) {
            plyr.removeEventListener(name, callback)
        }
    }

    /**
     * updates the progress of the lecture; used in the ControlBar for updating its current time and progress for BOARD lectures
     * @function
     */
    function onTimeUpdate(): void {
        const t = currentTime()
        const d = duration.current > 0 ? duration.current : t
        setProgress((100 * t) / d)
    }

    /**
     * makes sure time is greater than 0; prolly should add check for time greater than duration
     * @param time
     */
    const clampTime = (time: number) => {
        const t = time > 0 ? time : 0
        currentTime(t)
    }

    /**
     * ran when a user seeks on the controlbar
     * @param time
     */
    const onControlBarSeek = (time: number) => {
        console.log('onControlBarSeek', time)
        clampTime(time)
    }

    /**
     * sets fullscreen state of player
     * @param {bool} fs
     */
    function updateIsFullScreen(fs: boolean) {
        setIsFullScreen(fs)
        isFullScreen.current = fs
    }

    /**
     * Set the playback rate which will affect all slides.
     * @function
     * @param shouldIncrease if true then increase playback rate by playback rate delta; vice versa if false
     * @returns current playback rate of video
     */
    function handleOnControlBarPlaybackChange(shouldIncrease: boolean): void {
        const pbr = playbackRateRef.current
        let newPlaybackRate = shouldIncrease
            ? pbr + playbackRateDelta
            : pbr - playbackRateDelta
        newPlaybackRate =
            newPlaybackRate > maxPlaybackRate
                ? maxPlaybackRate
                : newPlaybackRate < 0.2
                ? 0.2
                : newPlaybackRate

        updatePlaybackRate(newPlaybackRate)
    }

    /**
     * enables/disables subtitles
     * @param {bool} shouldEnable
     */
    function enableSubtitles(shouldEnable: boolean): void {
        setSubtitlesEnabled(shouldEnable)
    }

    function changeSubtitleStatus() {
        enableSubtitles(!subtitlesEnabled)
    }

    function onForward(time?: number) {
        const fwdTime = time ? time : defaultFwdTime
        clampTime(currentTime() + fwdTime)
    }

    function onReplay(time?: number) {
        const rplyTime = time ? time : defaultReplayTime
        clampTime(currentTime() - rplyTime)
    }

    /**
     * called by either useTranscript or useNotes to set the video to a current time
     * @param {number} time
     */
    function onClickAtTime(time: number) {
        if (hasPlayerRef()) {
            currentTime(time)
            play()
        }
    }

    return {
        currentSrc,
        addEventListener,
        removeEventListener,
        currentPlayer,
        onPlay,
        onPause,
        onTimeUpdate,
        subtitlesEnabled,
        progress,
        duration: _duration,
        playbackRate,
        currentTime,
        updateVolume,
        hasSubtitles,
        currentSourceType,
        currentSources,
        onForward,
        onReplay,
        onControlBarSeek,
        onSeek: onControlBarSeek,
        playing,
        play,
        pause,
        paused,
        increasePlaybackRate: () => handleOnControlBarPlaybackChange(true),
        decreasePlaybackRate: () => handleOnControlBarPlaybackChange(false),
        changeSubtitleStatus,
        isPlaying: playing(),
        initializeVideoSource: resetVideoSource,
        onLoadedMetadata,
        hasPlayerRef,
        volume,
        mouseOverTime,
        setHasSubtitles,
        textTracks,
        subtitles: subtitles.current,
        videoDimensions: videoDimensions.current,
        isFullScreen: _isFullScreen,
        updateIsFullScreen,
        onClickAtTime,
        hideTimeToolTip: () => {
            setMouseOverTime(-1)
        },
        setMouseOverTime,
        lastPlayTime: lastPlayTime.current,
    }
}
