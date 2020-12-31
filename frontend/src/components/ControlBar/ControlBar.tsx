/** @format */

import React, { useEffect, useState, useRef } from 'react'

import Seekbar from './Seekbar'
import Slider from '@material-ui/core/Slider'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import PlayArrow from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import ClosedCaptionIcon from '@material-ui/icons/ClosedCaption'
import Replay10Icon from '@material-ui/icons/Replay10'
import {
    Forward30,
    VolumeUp,
    VolumeMute,
    Settings,
    GetApp,
} from '@material-ui/icons'
import SvgIcon from '@material-ui/core/SvgIcon'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import { Interval } from '../Common/commonRequirements'
import { VideoType } from '../VideoPlayer/commonRequirements'

const useStyles = makeStyles({
    controlbarPanel: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // height: 40,
        height: '80%',
        color: '#575656',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        fontSize: '14pt',
        border: '1px solid #979797',
    },
    controlbarLeft: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '60%',
        maxWidth: 450,
        justifyContent: 'space-between',
    },
    controlbarRight: {
        display: 'flex',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        width: '37%',
        maxWidth: 400,
        justifyContent: 'space-evenly',
        // justifyContent: 'flex-end'
    },
    controlbarButton: {
        display: 'flex',
        flexDirection: 'row',
        userSelect: 'none',
        alignItems: 'center',
        fill: 'rgb(149, 117, 205)',
    },
    controlbarPlayIcon: {
        marginLeft: '8px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 28,
    },
    controlbarPlaybackPlusIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '3px',
        marginRight: '4.5px',
        color: 'white',
        backgroundColor: '#9B9B9B',
        width: 20,
        height: 20,
        cursor: 'pointer',
        borderRadius: '5px',
    },
    controlbarPlaybackMinusIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '4px',
        color: 'white',
        backgroundColor: '#9B9B9B',
        width: 20,
        height: 20,
        cursor: 'pointer',
        borderRadius: '5px',
    },
    controlbarPresenterSection: {
        height: '100%',
    },
    iconPointer: {
        cursor: 'pointer',
    },
    rightIcon: {
        width: 40,
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
    },
    controlbarSubtitleIcon: {
        marginRight: '22px',
        cursor: 'pointer',
    },
    controlbarReplayIcon: {
        marginLeft: 10,
        // marginRight: 28,
        cursor: 'pointer',
        fontSize: 24,
    },
    controlbarForwardIcon: {
        cursor: 'pointer',
        fontSize: 24,
    },
    controlbarVolumeIcon: {
        cursor: 'pointer',
        marginRight: '3%',
    },
    controlbarSlider: {
        width: '80%',
        color: 'rgb(149, 117, 205)',
    },
    controlbar__modeIcon: {
        height: '80%',
        margin: 'auto',
    },
    controlbar__modeIconActive: {
        backgroundColor: 'rgb(149, 117, 205)', //check for this
        fill: 'white !important',
        color: 'white',
    },
    controlbar__modeIconInactive: {
        backgroundColor: 'transparent',
        fill: 'rgb(149, 117, 205) !important',
        color: 'rgb(149, 117, 205)',
    },
    controlbarPresenterIcon: {
        width: 40, // '45%',
        marginRight: '5%',
        justifyContent: 'center',
        height: 40, // '90%',
        borderRadius: '15%',
        cursor: 'pointer',
    },
    controlbarThumb: {
        pointerEvents: 'none',
    },
})

// following 2 icons are for presenter buttons
const slideVideoIcon = (SVGProps) => (
    <SvgIcon
        primary
        {...SVGProps}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='1107.102 -1546 215.376 164.88'
    >
        <switch>
            <g id='Group'>
                <g id='Group'>
                    <g id='Group'>
                        <path
                            d=' M 1220.127 -1535.236 L 1220.127 -1546 L 1209.363 -1546 L 1209.363 -1535.236 L 1107.102 -1535.236 L 1107.102 -1524.471 L 1112.484 -1524.471 L 1112.484 -1396.6 L 1107.102 -1396.6 L 1107.102 -1385.836 L 1204.025 -1385.836 L 1322.478 -1385.836 L 1322.478 -1396.6 L 1317.096 -1396.6 L 1317.096 -1524.471 L 1322.478 -1524.471 L 1322.478 -1535.236 L 1220.127 -1535.236 Z  M 1306.286 -1396.6 L 1123.248 -1396.6 L 1123.248 -1524.471 L 1306.331 -1524.471 L 1306.331 -1396.6 L 1306.286 -1396.6 L 1306.286 -1396.6 Z '
                            id='Compound Path'
                        />
                        <rect
                            x='1138.73'
                            y='-1531.053'
                            width='152.12'
                            height='149.933'
                            transform='matrix(1,0,0,1,0,0)'
                            id='Rectangle'
                            fill='none'
                        />
                    </g>
                </g>
                <g id='Group'>
                    <line
                        x1='1158'
                        y1='-1499'
                        x2='1259.51'
                        y2='-1499'
                        id='Path'
                        vectorEffect='non-scaling-stroke'
                        strokeWidth='1'
                        strokeLinejoin='miter'
                        strokeLinecap='square'
                        stroke='currentColor'
                        strokeMiterlimit='3'
                    />
                    <line
                        x1='1158.77'
                        y1='-1473'
                        x2='1231.635'
                        y2='-1473'
                        id='Path'
                        vectorEffect='non-scaling-stroke'
                        strokeWidth='1'
                        strokeLinejoin='miter'
                        strokeLinecap='square'
                        stroke='currentColor'
                        strokeMiterlimit='3'
                    />
                    <line
                        x1='1158.524'
                        y1='-1445.712'
                        x2='1249.5'
                        y2='-1445.712'
                        id='Path'
                        vectorEffect='non-scaling-stroke'
                        strokeWidth='1'
                        strokeLinejoin='miter'
                        strokeLinecap='square'
                        stroke='currentColor'
                        strokeMiterlimit='3'
                    />
                    <line
                        x1='1158'
                        y1='-1419'
                        x2='1263.5'
                        y2='-1419'
                        id='Path'
                        vectorEffect='non-scaling-stroke'
                        strokeWidth='1'
                        strokeLinejoin='miter'
                        strokeLinecap='square'
                        stroke='currentColor'
                        strokeMiterlimit='3'
                    />
                </g>
            </g>
        </switch>
    </SvgIcon>
)

const LargeTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: 'gray',
        color: 'white',
        boxShadow: theme.shadows[1],
        fontSize: 10,
    },
}))(Tooltip)

interface ButtonArgs {
    children: any
    className: string
    ariaLabel: string
    onClick: (e: any) => void
    tooltipLabel: string
    iconStyle: any
    wrapStyle: any
    id: string
}

const ControlBarButton = ({
    children,
    className = '',
    ariaLabel = '',
    onClick = (e: any) => {},
    tooltipLabel = '',
    iconStyle = {},
    wrapStyle = {},
    id = '',
}: Partial<ButtonArgs>): JSX.Element => {
    const [useOutline, setOutline] = useState<boolean>(false)
    id = id.length > 0 ? id : `${className} ${ariaLabel}`
    const s = {
        ...wrapStyle,
        outline: useOutline ? '' : 'none',
    }
    return (
        <div
            id={id}
            className={className}
            onClick={onClick}
            aria-label={ariaLabel}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === ' ') {
                    setOutline(true)
                    if (document.activeElement) {
                        const element: HTMLElement = document.activeElement as HTMLElement
                        element.click()
                    }
                }
            }}
            onKeyUp={(e) => {
                if (e.key === 'Tab') {
                    setOutline(true)
                }
            }}
            onMouseDown={(e) => {
                setOutline(false)
            }}
            style={s}
        >
            <LargeTooltip title={tooltipLabel} placement={'top'}>
                <div style={iconStyle}>{children}</div>
            </LargeTooltip>
        </div>
    )
}

interface IControlBar {
    currentPlayer: (plyr?: HTMLVideoElement) => HTMLVideoElement | undefined

    // General
    opacity: number
    progress: number
    duration: number
    playbackRate: number
    volume: number
    isPlaying: boolean

    // VideoUI
    trimStartPercent: number
    trimEndPercent: number

    // Video Sources/Resolution
    video: string
    compressedVideo: string
    enhancedVideo: string
    currentSrc: (src?: VideoType) => string
    currentSourceType: string
    enableResolutionSwitch: boolean

    // General Video Functions
    onForward: (time?: number) => void
    onReplay: (time?: number) => void
    onClickPlayButton: (allowPlay?: boolean) => void
    increasePlaybackRate: () => void
    decreasePlaybackRate: () => void
    updateVolume: (vol: 'mute' | number) => void
    onSeek: (time: number) => void

    // Subtitles
    hasSubtitles: boolean
    changeSubtitleStatus: () => void
    subtitlesEnabled: boolean

    // Fullscreen
    onEnterFullScreen: () => void
    onExitFullScreen: () => void
    isFullScreen: boolean
    enableFullScreen: boolean

    // Seekbar
    mouseOverTime: number
    minSeekbarHeight: number | string
    startOffset: number

    enableDownloadable: boolean
}

/**
 * Completely customizable control bar that can be used with the video player or for any media element that needs a controlbar
 */
const ControlBar = ({
    currentPlayer = () => undefined,

    // general data
    progress = 0,
    duration = 0,
    playbackRate = 1,
    volume = 1,
    isPlaying = false,
    opacity = 1,

    // video ui
    trimStartPercent = 0,
    trimEndPercent = 0,

    // video sources/resolution
    video = '',
    compressedVideo = '',
    enhancedVideo = '',
    currentSrc = () => '',
    currentSourceType = 'original',
    enableResolutionSwitch = true,

    // general functions
    onForward = () => {},
    onReplay = () => {},
    onClickPlayButton = () => {},
    increasePlaybackRate = () => {},
    decreasePlaybackRate = () => {},
    updateVolume = () => {},
    onSeek = () => {},

    // subtitles
    hasSubtitles = false,
    changeSubtitleStatus = () => {},
    subtitlesEnabled = false,

    // fullscreen
    onEnterFullScreen = () => {},
    onExitFullScreen = () => {},
    isFullScreen = false,
    enableFullScreen = false,

    // seekbar
    minSeekbarHeight = '20%',
    mouseOverTime = -1,
    startOffset = 0,

    enableDownloadable = true,
}: Partial<IControlBar>): JSX.Element => {
    const classes = useStyles()

    const originalUrlSrc = video
    const compressedUrlSrc = compressedVideo
    const enhancedUrlSrc = enhancedVideo

    const anchorRef = useRef(null)
    const preVolumeRef = useRef<number>(1)
    const seekbarHandle = useRef<HTMLDivElement>({} as HTMLDivElement)

    const [showPlaybackIcons, setIcons] = useState<boolean>(false)
    const [showFullSeekbar, setShowFullSeekbar] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    const [currentTime, setCurrentTime] = useState<number>(0)

    useEffect(() => {
        if (duration > 0) {
            setCurrentTime((duration * progress) / 100)
        }
    }, [progress, duration])

    const onVolumeChange = (e, newVol) => {
        const plyr = currentPlayer()
        if (plyr) {
            const curVol = plyr.volume
            let vol = newVol
            if (newVol === 'mute') {
                if (curVol > 0) {
                    preVolumeRef.current = curVol
                    vol = 0
                } else {
                    vol = preVolumeRef.current
                }
            }
            handleOnVolumeChange(e, vol)
        }
    }

    /**
     * go back 10 seconds
     * @function
     */
    const handleOnReplay = (e) => {
        onReplay()
    }

    /**
     * go forward 30 seconds
     * @function
     */
    const handleOnForward = (e) => {
        onForward()
    }

    const handleOnVolumeChange = (e, newVol) => {
        updateVolume(newVol)
    }
    /**
     * Has seekbar ref been set?
     * @function
     */
    const hasSeekbar = () => seekbarHandle && seekbarHandle.current

    /**
     * if we have seekbarHandle ref then return its width
     * @function
     */
    const getWidth = () => {
        if (!hasSeekbar()) {
            return 0
        }
        return seekbarHandle.current.clientWidth
    }

    /**
     * Handles when user clicks somewhere on the seekbar; used in Seekbar onSeek prop
     * @function
     */
    const onSeekbarClick = (e, newProgress) => {
        onSeek((newProgress * duration) / 100)
    }

    /**
     * Render all the played intervals expected to be on the ControlBar Seekbar.
     * There is probably a better way to do  Think of it later.
     */
    const renderPlayedIntervals = () => {
        // const intervals: Array<Interval> = slideContext.getAllPlayedIntervals()
        const intervals: Array<Interval> = []
        const globalControlBarWidth = getWidth()
        let intervalsDOM: Array<JSX.Element> = []
        if (!isNaN(duration) && duration > 0) {
            for (let i = 0; i < intervals.length; i++) {
                let start = intervals[i].start / duration
                let diff = (intervals[i].end - intervals[i].start) / duration
                intervalsDOM.push(
                    <div
                        key={`interval_${i}`}
                        style={{
                            left: start * globalControlBarWidth + 'px',
                            width: diff * 100 + '%',
                            backgroundColor: '#9575ca',
                            opacity: 0.5,
                            zIndex: 1,
                            position: 'absolute',
                        }}
                    />
                )
            }
        }
        return intervalsDOM
    }

    /**
     *  HACK: Don't like
     */
    const renderDisabledSegments = () => {
        // const slides = slideContext.slidesData()
        const slides = {}
        let disabledSegments: Array<JSX.Element> = []
        if (!isNaN(duration) && duration > 0) {
            for (let key in slides) {
                if (slides[key].disabled) {
                    const totalDuration = duration
                    const dur = slides[key].duration
                    const ratio = dur / totalDuration
                    const globalControlBarWidth = getWidth()
                    const startTime = slides[key].start
                    const xPosition =
                        (startTime / totalDuration) * globalControlBarWidth
                    // HACK: Inline styling should be moved.
                    disabledSegments.push(
                        <div
                            key={`disabled_${key}`}
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                            style={{
                                position: 'absolute',
                                height: '100%',
                                opacity: 0.2,
                                zIndex: 50,
                                cursor: 'not-allowed',
                                background:
                                    'repeating-linear-gradient(45deg, black, black 5px, white 5px, white 10px)',
                                left: xPosition,
                                width: globalControlBarWidth * ratio,
                            }}
                        />
                    )
                }
            }
        }
        return disabledSegments
    }

    /**
     * Handle Plyaback Mouse Over.
     * @function
     */
    const handlePlaybackOnMouseOver = () => {
        setIcons(true)
    }

    /**
     * Handle Playback Mouse Out.
     * @function
     */
    const handlePlaybackOnMouseOut = () => {
        setIcons(false)
    }

    /**
     * Render the seekbar.
     */
    const renderSeek = () => {
        return (
            <Seekbar
                ref={seekbarHandle}
                onSeek={onSeekbarClick}
                duration={duration}
                currentTime={currentTime}
                progress={progress}
                showFullSeekbar={showFullSeekbar}
                setShowFullSeekbar={setShowFullSeekbar}
                // props specific to video ui controlbar
                trimStartPercent={trimStartPercent}
                trimEndPercent={trimEndPercent}
                // props specific to controlbar seekbar
                alwaysMin
                minHeight={minSeekbarHeight}
                showTime
                renderDisabledSegments={renderDisabledSegments}
                renderPlayedIntervals={renderPlayedIntervals}
                mouseOverTime={mouseOverTime}
                startOffset={startOffset}
            />
        )
    }

    const renderPlay = () => {
        return (
            <ControlBarButton
                className={classes.controlbarButton}
                onClick={(e) => onClickPlayButton()}
                ariaLabel={isPlaying ? 'Pause Lecture' : 'Play Lecture'}
                id={'controlbar-play-button'}
            >
                {isPlaying ? (
                    <PauseIcon
                        className={classes.controlbarPlayIcon}
                        data-test='Pause'
                    />
                ) : (
                    <PlayArrow
                        className={classes.controlbarPlayIcon}
                        data-test='Play'
                    />
                )}
            </ControlBarButton>
        )
    }

    const handleDecreasePlaybackRate = (e) => {
        if (e.key === ' ') {
            console.log('decreasing speed')
            decreasePlaybackRate()
        }
    }

    const handleIncreasePlaybackRate = (e) => {
        if (e.key === ' ') {
            console.log('increasing speed')
            increasePlaybackRate()
        }
    }

    const renderPlayback = () => {
        return (
            <div
                onMouseOut={handlePlaybackOnMouseOut}
                onMouseOver={handlePlaybackOnMouseOver}
                className={classes.controlbarButton}
                data-test='Playback Block'
            >
                <div
                    className={classes.controlbarPlaybackMinusIcon}
                    onClick={decreasePlaybackRate}
                    onKeyDown={handleDecreasePlaybackRate}
                    tabIndex={0}
                    id='decrease-playback-rate'
                    aria-label='Decrease Playback Rate'
                    data-test='Decrease Playback Rate'
                    style={
                        {
                            // opacity: showPlaybackIcons ? 1.0 : 0.0,
                            // transition: 'opacity .1s ease-in',
                        }
                    }
                >
                    -
                </div>
                {playbackRate.toFixed(1) + 'x'}
                <div
                    className={classes.controlbarPlaybackPlusIcon}
                    onClick={increasePlaybackRate}
                    onKeyDown={handleIncreasePlaybackRate}
                    tabIndex={0}
                    id='increase-playback-rate'
                    aria-label='Increase Playback Rate'
                    data-test='Increase Playback Rate'
                    style={
                        {
                            // opacity: showPlaybackIcons ? 1.0 : 0.0,
                            // transition: 'opacity .1s ease-in',
                        }
                    }
                >
                    +
                </div>
            </div>
        )
    }

    const timeStringFromSeconds = (time: number) => {
        let hours = 0
        let minutes = 0
        let seconds = 0
        let timeString = ''
        hours = Math.floor(time / 3600)
        minutes = Math.floor((time - hours * 3600) / 60)
        if (minutes === 60) {
            minutes = 0
            hours += 1
        }
        seconds = Math.floor(time - hours * 3600 - minutes * 60)
        if (seconds === 60) {
            minutes += 1
            seconds = 0
        }
        if (hours > 0) {
            timeString = hours < 10 ? `0${hours}:` : `${hours}:`
        }
        timeString += minutes < 10 ? `0${minutes}:` : `${minutes}:`
        timeString += seconds < 10 ? `0${seconds}` : seconds
        return timeString
    }

    const renderTimes = () => {
        const d =
            !isNaN(duration) && duration > currentTime ? duration : currentTime
        return (
            <div className={classes.controlbarButton} data-test='render times'>
                {`${timeStringFromSeconds(
                    currentTime
                )} / ${timeStringFromSeconds(d)}`}
            </div>
        )
    }

    /**
     * Render the replay 10 seconds icon button
     */
    const renderReplay = () => {
        return (
            <ControlBarButton
                className={`${classes.controlbarButton} ${classes.controlbarReplayIcon}`}
                onClick={handleOnReplay}
                tooltipLabel='Replay 10s'
                iconStyle={{
                    display: 'flex',
                    color: 'rgba(0, 0, 0, 0.54)',
                }}
                ariaLabel='Go Back 10 seconds'
            >
                <Replay10Icon data-test='Replay 10s' />
            </ControlBarButton>
        )
    }

    /**
     * Render the forward 30s icon button
     */
    const renderForward = () => {
        return (
            <ControlBarButton
                className={`${classes.controlbarButton} ${classes.controlbarForwardIcon}`}
                onClick={handleOnForward}
                tooltipLabel='Forward 30s'
                iconStyle={{
                    display: 'flex',
                    color: 'rgba(0, 0, 0, 0.54)',
                }}
                ariaLabel='Go Foward 30 seconds'
            >
                <Forward30 data-test='Foward 30 seconds' />
            </ControlBarButton>
        )
    }

    /**
     * render the closed caption button if the lecture has subtitles available
     */
    const renderClosedCaption = () => {
        return (
            <ControlBarButton
                className={`${classes.controlbarButton} ${classes.controlbarSubtitleIcon}`}
                onClick={() => {
                    changeSubtitleStatus()
                }}
                tooltipLabel='Subtitles'
                ariaLabel={`${
                    subtitlesEnabled ? 'Disable' : 'Enable'
                } Subtitles`}
                iconStyle={{
                    display: 'flex',
                    color: subtitlesEnabled
                        ? 'rgba(149, 117, 205)'
                        : 'rgba(0, 0, 0, 0.54)',
                }}
            >
                <ClosedCaptionIcon />
            </ControlBarButton>
        )
    }

    /**
     * renders the volume slider
     */
    const renderVolume = () => {
        return (
            // TODO: Make the slider accessible
            <div style={{ display: 'flex', width: '40%' }}>
                <ControlBarButton
                    className={`${classes.controlbarButton} ${classes.controlbarVolumeIcon}`}
                    tooltipLabel={volume === 0 ? 'Unmute' : 'Mute'}
                    iconStyle={{
                        display: 'flex',
                        color: 'rgba(0, 0, 0, 0.54)',
                    }}
                    ariaLabel={volume === 0 ? 'Unmute' : 'Mute'}
                    onClick={(e) => {
                        onVolumeChange(e, 'mute')
                    }}
                >
                    {volume === 0 ? <VolumeMute /> : <VolumeUp />}
                </ControlBarButton>
                <Slider
                    onChange={onVolumeChange}
                    min={0}
                    max={1}
                    value={volume}
                    className={classes.controlbarSlider}
                    data-test='controlbarSlider'
                    defaultValue={1.0}
                    step={0.01}
                    aria-label='adjust volume level'
                    classes={{
                        thumb: classes.controlbarThumb,
                    }}
                />
            </div>
        )
    }

    /**
     * renders download button if video can be downloaded (determined by downloadable prop)
     */
    const renderDownload = () => {
        return (
            <ControlBarButton
                className={`${classes.controlbarButton} ${classes.iconPointer} ${classes.rightIcon}`}
                onClick={(e) => {
                    const src = currentSrc()
                    if (src) {
                        window.open(src, 'Download')
                    }
                }}
                ariaLabel='Download Lecture Video'
                tooltipLabel={'Download video'}
                iconStyle={{
                    display: 'flex',
                    margin: '1em',
                    color: 'rgba(0, 0, 0, 0.54)',
                }}
            >
                <GetApp />
            </ControlBarButton>
        )
    }

    /**
     * renders the resolution switcher pop up menu
     */
    const renderResolutionSwitcher = () => {
        const hasOriginal = originalUrlSrc && originalUrlSrc.length > 0 ? 1 : 0
        const hasCompressed =
            compressedUrlSrc && compressedUrlSrc.length > 0 ? 1 : 0
        const hasEnhanced = enhancedUrlSrc && enhancedUrlSrc.length > 0 ? 1 : 0
        const sum = hasOriginal + hasCompressed + hasEnhanced

        if (sum < 2) {
            return null
        }
        const sourceType = currentSourceType
        const selectedStyle = {
            backgroundColor: 'rgb(149, 117, 205)',
            color: 'white',
        }

        const notSelectedStyle = {
            backgroundColor: 'transparent',
            color: 'black',
        }
        return (
            <div>
                <div
                    ref={anchorRef}
                    className={`${classes.controlbarButton} ${classes.iconPointer} ${classes.rightIcon}`}
                    onMouseOver={() => {
                        setOpen(true)
                    }}
                    aria-label={'Change Resolution'}
                >
                    <div
                        style={{
                            display: 'flex',
                            margin: '1em',
                            color: 'rgba(0, 0, 0, 0.54)',
                        }}
                    >
                        <Settings />
                    </div>
                </div>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    placement='top'
                    // onMouseEnter={() => {
                    //     console.log('ENTERED POPPER')
                    //     // if (resolutionSwitcherTimeout.current) {
                    //     //     clearTimeout(resolutionSwitcherTimeout.current)
                    //     //     resolutionSwitcherTimeout.current = null
                    //     // }
                    // }}
                    onMouseLeave={() => setOpen(false)}
                >
                    {({ TransitionProps, placement }) => (
                        <Grow {...TransitionProps}>
                            <Paper>
                                <ClickAwayListener
                                    onClickAway={() => setOpen(false)}
                                >
                                    <MenuList
                                        autoFocusItem={open}
                                        id='menu-list-grow'
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                currentSrc('original')
                                                setOpen(false)
                                            }}
                                            style={
                                                sourceType === 'original'
                                                    ? selectedStyle
                                                    : notSelectedStyle
                                            }
                                            aria-label='Switch to High Quality Video Mode'
                                        >
                                            High Quality
                                        </MenuItem>
                                        {compressedUrlSrc &&
                                            compressedUrlSrc.length > 0 && (
                                                <MenuItem
                                                    onClick={() => {
                                                        currentSrc('original')
                                                        setOpen(false)
                                                    }}
                                                    style={
                                                        sourceType ===
                                                        'compressed'
                                                            ? selectedStyle
                                                            : notSelectedStyle
                                                    }
                                                    aria-label='Switch to Low Quality Video Mode'
                                                >
                                                    Low Quality
                                                </MenuItem>
                                            )}
                                        {enhancedUrlSrc &&
                                            enhancedUrlSrc.length > 0 && (
                                                <MenuItem
                                                    onClick={() => {
                                                        currentSrc('original')
                                                        setOpen(false)
                                                    }}
                                                    style={
                                                        sourceType ===
                                                        'enhanced'
                                                            ? selectedStyle
                                                            : notSelectedStyle
                                                    }
                                                    aria-label='Switch to Enhanced Video Mode'
                                                >
                                                    Enhanced Mode
                                                </MenuItem>
                                            )}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        )
    }
    /**
     * renders the fullscreen button
     */
    function renderFullScreen(): JSX.Element {
        return (
            <ControlBarButton
                className={`${classes.controlbarButton} ${classes.iconPointer} ${classes.rightIcon}`}
                onClick={isFullScreen ? onExitFullScreen : onEnterFullScreen}
                ariaLabel={
                    isFullScreen
                        ? 'Exit Fullscreen Mode'
                        : 'Enter Fullscreen Mode'
                }
                tooltipLabel={
                    isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'
                }
                iconStyle={{
                    display: 'flex',
                    margin: '1em',
                    color: 'rgba(0, 0, 0, 0.54)',
                }}
            >
                {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </ControlBarButton>
        )
    }

    return (
        <div
            style={{
                height: '100%',
                opacity: opacity,
            }}
        >
            {renderSeek()}
            <div
                role='region'
                aria-label='Video Control Bar'
                className={classes.controlbarPanel}
                style={{ backgroundColor: `rgba(255,255,255, 0.65)` }}
            >
                <div
                    className={classes.controlbarLeft}
                    data-test='controlbarLeft'
                >
                    {renderPlay()}
                    {renderPlayback()}
                    {renderTimes()}
                    {renderReplay()}
                    {renderForward()}
                </div>

                <div
                    className={classes.controlbarRight}
                    data-test='controlbarRight'
                >
                    {hasSubtitles && renderClosedCaption()}
                    {renderVolume()}
                    {enableResolutionSwitch && renderResolutionSwitcher()}
                    {enableDownloadable && renderDownload()}
                    {enableFullScreen && renderFullScreen()}
                </div>
            </div>
        </div>
    )
}

export default ControlBar
