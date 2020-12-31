/** @format */
import { Dispatch, SetStateAction, MutableRefObject } from 'react'
import { CSSProperties } from '@material-ui/styles'

export interface Dimensions {
    height: number
    width: number
}

export interface Interval {
    start: number
    end: number
}

export type VideoType = 'output' | 'original'

/**
 * used for determining what the primary player is => video in BOARD and HYBRID lectures; slides in BYSTANDER and SLIDES lectures
 */
export type PlayerType = 'video' | 'slides' | 'none'

export interface VideoSources {
    current: VideoType
    original: string
    output: string
}

interface IStyles {
    outerWrapper: CSSProperties
    midWrapper: CSSProperties
    innerWrapper: CSSProperties
    video: CSSProperties
    controlBar: CSSProperties
}

export interface IMainVideoPlayer {
    styles: Partial<IStyles>

    // general video player
    dynamicHeights: boolean // if true then height of video will change depending on window; used in lecture viewer
    enableTracking: boolean // if true then video will track with the presenter
    enableDownloadable: boolean // if true then video can be downloaded

    // VideoUI specific
    trimStartPecent: number
    trimEndPercent: number

    // general control bar related props
    enableResolutionSwitch: boolean
    enableFullScreen: boolean
    fadeControlBar: boolean

    // current slide for seekbar use
    slideStart: number
    slideDuration: number

    // for extending the event listener functions
    onTimeUpdate: () => void

    // For slide presentations (only applicable for lecture viewer)
    slidesPresentationOffset: number // offset of whole slide presentation
    slidesPlaying: boolean
    hasSlides: boolean
    slidesOnControlBarPlay: () => void
    slidesPause: () => void
    slidesOnForward: () => void
    slidesOnReplay: () => void
    slidesOnControlBarSeek: (time: number) => void
    slidesUpdateVolume: (newVol: 'mute' | number) => void
    slidesIncreasePlaybackRate: () => void
    slidesDecreasePlaybackRate: () => void
    syncSlidesWithVideoPlayer: (time: number) => void
}

export interface VideoPlayerHook {
    currentSrc: (src?: VideoType) => string
    addEventListener: (name: string, callback: (arg: any) => any) => void
    removeEventListener: (name: string, callback: (arg: any) => any) => void
    currentPlayer: (plyr?: HTMLVideoElement) => HTMLVideoElement | undefined
    onPlay: () => void
    onPause: () => void
    onTimeUpdate: () => void
    progress: number
    duration: number
    playbackRate: number
    currentTime: (time?: number | undefined) => number
    updateVolume: (vol: string | number) => void
    subtitles: string
    subtitlesEnabled: boolean
    hasSubtitles: boolean
    setHasSubtitles: Dispatch<SetStateAction<boolean>>
    currentSourceType: VideoType
    currentSources: MutableRefObject<VideoSources>
    onForward: (time?: number) => void
    onReplay: (time?: number) => void
    onControlBarSeek: (time: number) => void
    onSeek: (time: number) => void
    playing: () => boolean
    play: () => void
    pause: () => void
    paused: () => boolean
    increasePlaybackRate: () => void
    decreasePlaybackRate: () => void
    changeSubtitleStatus: () => void
    isPlaying: boolean
    initializeVideoSource: () => void
    onLoadedMetadata: (e: any) => void
    hasPlayerRef: () => boolean
    volume: number
    mouseOverTime: number
    textTracks: (
        dex?: number | undefined,
        key?: string | undefined,
        value?: string | undefined
    ) => TextTrackList | never[] | TextTrack | null
    videoDimensions: Dimensions
    isFullScreen: boolean
    updateIsFullScreen: (fs: boolean) => void
    onClickAtTime: (time: number) => void
    hideTimeToolTip: () => void
    setMouseOverTime: Dispatch<SetStateAction<number>>
    lastPlayTime: number
    uploadFile: (file: File) => void
    inputFile: File | undefined
    inputMetadata: any[]
}
