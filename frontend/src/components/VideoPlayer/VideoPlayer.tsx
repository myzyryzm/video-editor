/** @format */
/* eslint-disable no-restricted-globals */
import React, { useContext, useRef, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import VideoPlayerContext from './VideoPlayerContext'
// import ControlBar from '../ControlBar/ControlBar'
import { PlayerType } from '../Common/commonRequirements'
import { IMainVideoPlayer } from './commonRequirements'
import { CSSProperties } from '@material-ui/styles'
import { SCROLLBAR_HEIGHT } from '../Common/constants'
import SimpleBar from 'simplebar'
import 'simplebar/dist/simplebar.css'
import fscreen from 'fscreen'
import { browserInfo } from '../Common/browserDetect'

const controlBarHideTime = 3000 // ms
const videoId = 'videoId'
const heightScale = 0.4

/**
 * Customizable video player which can be used in lecture-viewer or content-admin
 */
export default function VideoPlayer({
    // general
    styles = {},
    dynamicHeights = true,
    enableDownloadable = true,

    // VideoUI Specific
    trimStartPecent = 0,
    trimEndPercent = 0,

    // seekbar slide
    slideStart = 0,
    slideDuration = 0,

    // general control bar
    enableResolutionSwitch = true,
    fadeControlBar = true, // enable fading of control bar when user inactive
    enableFullScreen = true,

    // event listener functions
    onTimeUpdate = () => {},
}: Partial<IMainVideoPlayer>): JSX.Element {
    const {
        currentPlayer,
        addEventListener,
        removeEventListener,
        onPause: videoOnPause,
        onPlay: videoOnPlay,
        onTimeUpdate: videoOnTimeUpdate,
        subtitlesEnabled,
        initializeVideoSource,
        onLoadedMetadata,
        currentSources,
        progress,
        duration,
        playbackRate,
        pause: videoPause,
        play: videoPlay,
        onForward: videoOnForward,
        onReplay: videoOnReplay,
        increasePlaybackRate: videoIncreasePlaybackRate,
        decreasePlaybackRate: videoDecreasePlaybackRate,
        updateVolume: videoUpdateVolume,
        onControlBarSeek: videoOnControlBarSeek,
        hasSubtitles,
        changeSubtitleStatus,
        currentSrc,
        currentSourceType,
        playing: videoPlaying,
        volume,
        mouseOverTime,
        setHasSubtitles,
        textTracks,
        subtitles,
        currentTime,
        isFullScreen,
        updateIsFullScreen,
        lastPlayTime,
    } = useContext(VideoPlayerContext)
    const videoNode = useRef<HTMLVideoElement | undefined>()
    const mounted = useRef<boolean>(false)
    const userIsScrolling = useRef<boolean>(false)
    const hideControlBar = useRef<any>(null)
    const userScrollTimeout = useRef<any>(null)
    const simpleBarObj = useRef<any>(null)
    const VjsOuterWrapper = useRef<HTMLDivElement>({} as HTMLDivElement)
    const VjsWrapper = useRef<HTMLDivElement>({} as HTMLDivElement)
    const videoHeight = useRef<number>(0)
    const slidesOffset = useRef<number>(0)
    const [cueString, setCueString] = useState<string>('')
    const [showControlBar, setShowControlBar] = useState<boolean>(true)
    const [_userScrolling, setIsScrolling] = useState<boolean>(false)

    useEffect(() => {
        window.addEventListener('resize', onWindowResize)
        window.addEventListener('mouseup', onMouseUpAndOutHandler)
        document.addEventListener('fullscreenchange', forceExitFullScreen)
        document.addEventListener(
            'webkitfullscreenchange',
            forceExitFullScreenSafari
        )

        registerSimpleBar()

        return () => {
            if (currentPlayer()) {
                removeEventListener('play', handleOnPlay)
                removeEventListener('pause', handleOnPause)
                removeEventListener('loadedmetadata', handleOnLoadedMetadata)
                removeEventListener('timeupdate', handleOnTimeUpdate)
                removeEventListener('seeked', handleOnSeek)
            }
            window.removeEventListener('mouseup', onMouseUpAndOutHandler)
            window.removeEventListener('resize', onWindowResize)
            document.removeEventListener(
                'fullscreenchange',
                forceExitFullScreen
            )
            document.removeEventListener(
                'webkitfullscreenchange',
                forceExitFullScreenSafari
            )

            if (hideControlBar.current !== null) {
                clearTimeout(hideControlBar.current)
                hideControlBar.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (videoNode.current) {
            currentPlayer(videoNode.current)
            addEventListener('pause', handleOnPause)
            addEventListener('play', handleOnPlay)
            addEventListener('loadedmetadata', handleOnLoadedMetadata)
            addEventListener('timeupdate', handleOnTimeUpdate)
            addEventListener('seeked', handleOnSeek)
            initializeVideoSource()
        }
    }, [videoNode.current])

    useEffect(() => {
        if (VjsWrapper.current && VjsOuterWrapper.current) {
            setHeights()
            registerSimpleBar()
        }
    }, [VjsWrapper.current, VjsOuterWrapper.current])

    useEffect(() => {
        if (isFullScreen) {
            enterFullscreenCallback()
        }
    }, [isFullScreen])

    const handleOnPause = () => {
        videoOnPause()
    }

    const handleOnPlay = () => {
        videoOnPlay()
    }

    function handleOnTimeUpdate() {
        onTimeUpdate()
        videoOnTimeUpdate()
    }

    function handleOnLoadedMetadata(e) {
        onLoadedMetadata(e)
        currentTime(lastPlayTime + slidesOffset.current)
        if (subtitles !== '' && mounted.current === false) {
            mounted.current = true
            let track = document.createElement('track')
            track.kind = 'captions'
            track.label = 'English'
            track.srclang = 'en'
            track.src = subtitles
            track.addEventListener('cuechange', (event) => {
                // @ts-ignore
                const cues = event.target.track.activeCues
                if (cues.length > 0) {
                    setCueString(cues[0].text)
                } else {
                    setCueString('')
                }
            })
            // @ts-ignore
            this.appendChild(track)
            textTracks(0, 'mode', 'hidden') // set the subtitle mode to be hidden
            setHasSubtitles(true)
        }
    }

    const handleOnSeek = () => {}

    /**
     * go back 10 seconds
     * @function
     */
    function handleOnReplay() {
        videoOnReplay()
    }

    /**
     * go forward 30 seconds
     * @function
     */
    function handleOnForward() {
        videoOnForward()
    }

    /**
     * slides player runs the show in BYSTANDER and SLIDES layouts b/c videoPowerLevel is 0 in bystander layout (and nonexistant in slides)
     */
    function playerType(): PlayerType {
        return 'video'
    }

    /**
     * Used for syncing Slides Presentation and Video Presentation
     * @param newTime
     */
    function syncPlayers(newTime?: number): boolean {
        let slidesInPlay = false
        if (duration > 0) {
            const time =
                newTime != undefined ? newTime : (duration * progress) / 100
            videoOnControlBarSeek(time)
        }
        return slidesInPlay
    }

    /**
     * Handles when user clicks Play button
     * @function
     */
    function onClickPlayButton(allowPlay = true) {
        const playing = videoPlaying()
        if (playing) {
            videoPause()
        } else if (allowPlay) {
            videoPlay()
        }
    }

    function updateVolume(newVol: 'mute' | number) {
        videoUpdateVolume(newVol)
    }

    function increasePlaybackRate() {
        videoIncreasePlaybackRate()
    }

    function decreasePlaybackRate() {
        videoDecreasePlaybackRate()
    }

    function startOffset(): number {
        return 0
    }

    /**
     * Handle the resizing of the video when the window resizes.
     * This should set the VideoJS height appropriately.
     * @function
     */
    const onWindowResize = (e) => {
        if (simpleBarObj.current) simpleBarObj.current.recalculate()
        if (VjsWrapper.current && VjsOuterWrapper.current) {
            setHeights()
        }
    }

    /**
     * a hacky way to ensure getting correct height across browsers
     * safari doesn't return correct height value without setTimeout
     * @function
     */
    const setHeights = () => {
        if (dynamicHeights) {
            const vid = document.getElementById(videoId) as HTMLVideoElement
            if (vid) {
                videoHeight.current =
                    document.documentElement.clientHeight * heightScale
                vid.height = videoHeight.current
                // playerContext.player.current.width('')
                VjsOuterWrapper.current.style.height = `${
                    videoHeight.current + SCROLLBAR_HEIGHT
                }px`
            }
        }
    }

    /**
     * Register the third-party component SimpleBar. This component is needed
     * to maintain scrollbar consistency across different browsers.
     * @function
     */
    const registerSimpleBar = () => {
        if (VjsWrapper.current && !simpleBarObj.current) {
            simpleBarObj.current = new SimpleBar(VjsWrapper.current, {
                autoHide: false,
                scrollbarMinSize: SCROLLBAR_HEIGHT,
            })
        }
    }

    const toggleUserScrolling = (isScrolling) => {
        setIsScrolling(isScrolling)
        userIsScrolling.current = isScrolling
    }

    /**
     * Detect if the user finished scrolling
     * @function
     */
    const onMouseUpAndOutHandler = () => {
        if (userIsScrolling.current) toggleUserScrolling(false)
    }

    /**
     * If user uses mouse clicks instead of scroll
     * @function
     */
    const onMouseDownHandler = () => {
        if (!userIsScrolling.current) toggleUserScrolling(true)
    }

    /**
     * Reset event handlers on vjswrapper so that user can
     * interrupt scrolling animations, means that when user
     * wants to scroll freely across video, tracking will disable.
     * Detect if the user began scrolling through the video
     * @function
     */
    const getVideoOnScrollHandler = () => {
        const toggleOffScrolling = () => {
            toggleUserScrolling(false)
        }
        if (!userIsScrolling.current) toggleUserScrolling(true)
        if (userScrollTimeout.current !== null) {
            clearTimeout(userScrollTimeout.current)
            userScrollTimeout.current = null
        }
        userScrollTimeout.current = setTimeout(toggleOffScrolling, 3000)
    }

    /**
     * Handler to enter full screen on the controlbar click.
     * @function
     */
    const enterFullScreen = () => {
        if (VjsWrapper.current) {
            fscreen.requestFullscreen(VjsWrapper.current)
        }
        updateIsFullScreen(true)
    }

    /**
     * Handler to force exit the fullscreen when a user clicks the esc button.  exitFullScreen isnt called when a user clicks esc so must add this event to ther fullscreenchange event  on the document
     * @function
     */
    const forceExitFullScreen = (e) => {
        if (!document.fullscreenElement) {
            exitFullScreen()
        }
    }
    /**
     * Handler to force exit the fullscreen when a user clicks the esc button.  exitFullScreen isnt called when a user clicks esc so must add this event to ther fullscreenchange event  on the document
     * @function
     */
    const forceExitFullScreenSafari = (e) => {
        if (
            browserInfo.name === 'Safari' &&
            !document['webkitCurrentFullScreenElement']
        ) {
            exitFullScreen()
        }
    }

    /**
     * Handler to exit full screen.
     * @function
     */
    const exitFullScreen = () => {
        if (VjsWrapper.current) {
            console.log(
                'document.fullscreenElement',
                document.fullscreenElement,
                document['webkitCurrentFullScreenElement']
            )
            if (
                document.fullscreenElement ||
                (browserInfo.name === 'Safari' &&
                    typeof document['webkitCurrentFullScreenElement'] !==
                        'undefined')
            ) {
                try {
                    fscreen.exitFullscreen()
                } catch (e) {
                    console.log('fullscreen exit error', e)
                }
            }
            // fscreen.exitFullscreen()
        }
        updateIsFullScreen(false)
        exitFullscreenCallback()
    }

    const enterFullscreenCallback = () => {}

    const exitFullscreenCallback = () => {}

    let outerWrapperStyle: CSSProperties = {
        flexGrow: 0,
        flexShrink: 0,
        transform: isFullScreen ? 'none' : 'rotate(0deg)',
    }

    if (styles.outerWrapper) {
        outerWrapperStyle = {
            ...outerWrapperStyle,
            ...styles.outerWrapper,
        }
    }

    let midWrapperStyle: CSSProperties = {
        height: '100%',
        width: '100%',
        boxShadow: '0 -3px 1px -2px rgba(0, 0, 0, .2)',
        overflowY: 'hidden',
        position: 'absolute',
        background: 'black',
        zIndex: 10,
    }
    if (styles.midWrapper) {
        midWrapperStyle = {
            ...midWrapperStyle,
            ...styles.midWrapper,
        }
    }

    let innerWrapperStyle: CSSProperties = {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    }
    if (styles.innerWrapper) {
        innerWrapperStyle = {
            ...innerWrapperStyle,
            ...styles.innerWrapper,
        }
    }

    let videoStyle: CSSProperties = {
        position: 'absolute',
        top: isFullScreen ? 150 : 0,
        left: 0,
        height: isFullScreen ? 'calc(100% - 150px)' : '100%',
        width: 'auto',
        boxSizing: 'inherit',
        fontSize: 'inherit',
        color: 'inherit',
        lineHeight: 'inherit',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontFamily: 'Arial, Helvetica, sans-serif',
        backgroundColor: 'black',
    }
    if (styles.video) {
        videoStyle = {
            ...videoStyle,
            ...styles.video,
        }
    }

    let controlBarStyle: CSSProperties = {
        width: '100%',
        zIndex: 10,
        height: '15%',
        maxHeight: 60,
        bottom: 0,
        left: 0,
        position: 'fixed',
    }
    if (styles.controlBar) {
        controlBarStyle = {
            ...controlBarStyle,
            ...styles.controlBar,
        }
    }

    return (
        <div
            ref={VjsOuterWrapper}
            //@ts-ignore
            style={outerWrapperStyle}
        >
            <div
                ref={VjsWrapper}
                id='videovjswrapper'
                role='region'
                aria-label='lecture video'
                onWheel={getVideoOnScrollHandler}
                onMouseDown={onMouseDownHandler}
                onMouseEnter={(e) => {
                    if (hideControlBar.current !== null) {
                        clearTimeout(hideControlBar.current)
                        hideControlBar.current = null
                    }
                    setShowControlBar(true)
                }}
                onMouseLeave={(e) => {
                    hideControlBar.current = setTimeout(() => {
                        setShowControlBar(false)
                    }, controlBarHideTime)
                }}
                //@ts-ignore
                style={midWrapperStyle}
            >
                <div
                    //@ts-ignore
                    style={innerWrapperStyle}
                >
                    <video
                        ref={
                            videoNode as React.MutableRefObject<
                                HTMLVideoElement
                            >
                        }
                        crossOrigin='use-credential' // necessary to load .vtt subtitle track from aws s3
                        id={videoId}
                        onContextMenu={(e) => e.preventDefault()}
                        //@ts-ignore
                        style={videoStyle}
                        onClick={(e) => onClickPlayButton()}
                        controls
                    />
                    {subtitlesEnabled && (
                        <Typography
                            style={{
                                color: 'white',
                                position: 'fixed',
                                maxWidth: '90%',
                                bottom: '20%',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }}
                        >
                            {cueString}
                        </Typography>
                    )}

                    {/* <div
                        //@ts-ignore
                        style={controlBarStyle}
                    >
                        <ControlBar
                            // general
                            isPlaying={videoPlaying()}
                            progress={progress}
                            duration={duration}
                            playbackRate={playbackRate}
                            volume={volume}
                            playerType={playerType()}
                            opacity={
                                !fadeControlBar ||
                                showControlBar ||
                                mouseOverTime >= 0
                                    ? 1
                                    : 0
                            }
                            // VideoUI related
                            trimStartPercent={trimStartPecent}
                            trimEndPercent={trimEndPercent}
                            // video source / resolution
                            video={currentSources.current.original}
                            currentSourceType={currentSourceType}
                            currentPlayer={currentPlayer}
                            currentSrc={currentSrc}
                            enableResolutionSwitch={enableResolutionSwitch}
                            // general video functions
                            onForward={handleOnForward}
                            onReplay={handleOnReplay}
                            onClickPlayButton={onClickPlayButton}
                            onSeek={syncPlayers}
                            increasePlaybackRate={increasePlaybackRate}
                            decreasePlaybackRate={decreasePlaybackRate}
                            updateVolume={updateVolume}
                            // subtitles
                            hasSubtitles={hasSubtitles}
                            subtitlesEnabled={subtitlesEnabled}
                            changeSubtitleStatus={changeSubtitleStatus}
                            // seekbar
                            mouseOverTime={mouseOverTime}
                            slideStart={slideStart}
                            slideDuration={slideDuration}
                            startOffset={startOffset()}
                            // fullscreen
                            enableFullScreen={enableFullScreen}
                            isFullScreen={isFullScreen}
                            onEnterFullScreen={enterFullScreen}
                            onExitFullScreen={exitFullScreen}
                            // misc
                            enableDownloadable={enableDownloadable}
                        />
                    </div> */}
                </div>
            </div>
        </div>
    )
}
