/** @format */

import React, {
    useState,
    useRef,
    Dispatch,
    SetStateAction,
    forwardRef,
} from 'react'
// import { throttle } from 'Utils/Utils'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    seekbarCurrentTimeBox: {
        position: 'absolute',
        right: -24,
        top: -35,
        width: 'auto',
        padding: '1px 10px',
        fontSize: '10pt',
        background: '#6a6a6a',
        color: 'white',
        borderRadius: 4,
    },
    seekbarCurrentTimeMarker: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        height: '100%',
        width: '5px',
        background: 'white',
    },
    ppeSeekbarFullProgress: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        height: 35,
        backgroundColor: 'rgba(149, 117, 205, 0.8)',
        zIndex: 10,
    },
    ppeSeekbarMinProgress: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        // height: 8,
        height: '100%',
        backgroundColor: 'rgba(149, 117, 205, 0.8)',
        zIndex: 10,
    },
    ppeTrimmedFullProgress: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        // height: 35,
        zIndex: 20,
        height: '100%',
        background:
            'repeating-linear-gradient(45deg, black, black 5px, white 5px, white 10px)',
        opacity: 0.25,
    },
    ppeTrimmedMinProgress: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        // height: 8,
        height: '100%',
        zIndex: 20,
        background:
            'repeating-linear-gradient(45deg, black, black 5px, white 5px, white 10px)',
        opacity: 0.25,
    },
    seekbarDuration: {
        fontSize: '10pt',
        color: 'rgba(0,0,0,0.8)',
        position: 'absolute',
        top: 8.75,
        right: 30,
        bottom: -35,
    },
    seekbarCursor: {
        position: 'absolute',
        height: '100%',
        width: 'auto',
        borderLeft: '1px solid black',
    },
    ppeSeekbarWrapper: {
        height: 'auto',
        cursor: 'pointer',
        transform: 'rotate(0deg)',
    },
    controlbarParent: {
        backgroundColor: '#DADADA',
        boxShadow: '0 -1px 15px -6px black',
    },
    superslideParent: {
        flex: 1,
        width: '100%',
        zIndex: 10,
    },
    ppeSeekbarFull: {
        position: 'absolute',
        bottom: 0,
        height: 35,
        zIndex: 10,
        width: '100%',
    },
    ppeSeekbar: {
        backgroundColor: 'rgba(50, 50, 50, .2)',
    },
    ppeSeekbarMin: {
        height: 8,
        zIndex: 10,
    },
    ppeSeekbarMinExpandable: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
    },
})

const markerStyles = makeStyles({
    markerWrapper: {
        height: 'inherit',
        position: 'absolute',
        top: '-3px',
        zIndex: 100,
    },
    leftMarker: {
        position: 'absolute',
        left: '-5px',
        height: 'auto',
    },
    rightMarker: {
        position: 'absolute',
        right: '0px',
        height: 'auto',
    },
})

const leftBracket = (
    <svg
        width='11'
        height='22'
        viewBox='0 0 11 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M8.24981 3.40004C9.76883 3.40004 11 2.86296 11 2.2001C11 1.53725 9.76921 0 8.24981 0H2.75019C1.23117 0 0 1.53725 0 2.2001V21.8002C0 22.4626 1.23079 24 2.75019 24H8.24981C9.76883 24 11 22.4629 11 21.8002C11 21.1374 9.76921 20.6 8.24981 20.6H5.5V3.40004H8.24981Z'
            fill='#575656'
        />
    </svg>
)

const rightBracket = (
    <svg
        width='11'
        height='22'
        viewBox='0 0 11 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M8.24981 3.40004C9.76883 3.40004 11 2.86296 11 2.2001C11 1.53725 9.76921 0 8.24981 0H2.75019C1.23117 0 0 1.53725 0 2.2001V21.8002C0 22.4626 1.23079 24 2.75019 24H8.24981C9.76883 24 11 22.4629 11 21.8002C11 21.1374 9.76921 20.6 8.24981 20.6H5.5V3.40004H8.24981Z'
            transform='translate(11 24) rotate(180)'
            fill='#575656'
        />
    </svg>
)

const Marker = (props) => {
    const { xPosition, width } = props
    const classes = markerStyles()
    return (
        <div
            className={classes.markerWrapper}
            style={{ width: `${width}px`, left: `${xPosition}px` }}
        >
            <div className={classes.leftMarker}>{leftBracket}</div>
            <div className={classes.rightMarker}>{rightBracket}</div>
        </div>
    )
}

interface SeekbarProps {
    // Passed down from All
    onSeek: (e: any, newProgress: number) => void
    duration: number
    currentTime: number
    progress: number
    showFullSeekbar: boolean
    setShowFullSeekbar: Dispatch<SetStateAction<boolean>>

    // Passed down from All ControlBar
    alwaysMin: boolean
    minHeight: number | string
    showTime: boolean
    renderDisabledSegments: () => Array<JSX.Element>
    renderPlayedIntervals: () => Array<JSX.Element>
    startOffset: number
    mouseOverTime: number

    // Passed down from VideoUI ControlBar
    trimStartPercent: number
    trimEndPercent: number

    // Passed down from SuperSlide
    detector: boolean
    adjustTimeMarker: boolean
}

/**
 * seekbar to be used with control bar or with superslide
 */
const Seekbar = forwardRef<HTMLDivElement, Partial<SeekbarProps>>(
    (
        {
            // passed down from All
            onSeek = () => {},
            duration = 1,
            currentTime = 0,
            progress = 0,
            showFullSeekbar = false,
            setShowFullSeekbar = () => {},

            // Passed down from all ControlBar
            alwaysMin = false,
            minHeight = 8,
            showTime = false,
            renderDisabledSegments = () => {},
            renderPlayedIntervals = () => {},
            mouseOverTime = -1,
            startOffset = 0,

            // passed down from VideoUI ControlBar
            trimStartPercent = 0,
            trimEndPercent = 0,

            // passed down from SuperSlide
            detector = false,
            adjustTimeMarker = true,
        },
        ref
    ) => {
        const classes = useStyles()
        const fullHeight = 35

        const mouseDown = useRef<boolean>(false)
        const [mouseOver, setMouseOver] = useState<boolean>(false)
        const [seekbarMouseX, setSeekbarMouseX] = useState<number>(0)
        const mousePos = useRef<number>(0)

        // @ts-ignore
        const hasSeekbar = (): boolean => ref && ref.current

        const updateSeekbarMouseX = (e) => {
            if (!hasSeekbar()) {
                return 0
            }
            if (!e || !e.nativeEvent) {
                return 0
            }
            const xPos =
                // @ts-ignore
                e.nativeEvent.clientX - ref.current.getBoundingClientRect().x
            setSeekbarMouseX(xPos)
            return xPos
        }

        /**
         * Calculate the time from the mouse position on the seekbar
         * @function
         * @param {number} xPosition The X coordinate of the mouse.
         * @return {Number} Time.
         */
        const calculateTimeFromMouse = (xPosition) => {
            return duration > 0
                ? (calculateProgressFromMouse(xPosition) / 100) * duration
                : 0
        }

        const getWidth = () => {
            if (!hasSeekbar()) {
                return 0
            }
            // @ts-ignore
            return ref.current.clientWidth
        }

        /**
         * A function that gets called when the mouse leaves the seekbar. Put any logic
         * that needs to proceed that event here.
         * @function
         */
        const handleMouseLeave = () => {
            mouseDown.current = false
            setMouseOver(false)
        }

        /**
         * On Mouse Enter handler.
         * @function
         * @param {Object} e Mouse Event.
         */
        const handleMouseEnter = (e) => {
            updateSeekbarMouseX(e)
            setShowFullSeekbar(!alwaysMin)
            setMouseOver(true)
        }

        /**
         * Calculate the percentage progress relative to the width of the seekbar
         * @function
         * @param {number} xPosition The X coordinate of the mouse.
         * @return {Number} Progress with range [0,1]
         */
        const calculateProgressFromMouse = (xPosition) => {
            return hasSeekbar()
                ? // @ts-ignore
                  (xPosition / ref.current.clientWidth) * 100
                : 0
        }

        const onSeekbarClick = (e) => {
            const xPosition = updateSeekbarMouseX(e)
            const progress = calculateProgressFromMouse(xPosition)
            onSeek(e, progress)
        }

        /**
         * On Mouse Move Handler.
         * @function
         * @param {Object} e Mouse Eevent.
         */
        const handleMouseMove = (e) => {
            // If user is seeking
            if (mouseDown.current) {
                onSeekbarClick(e)
            } else {
                updateSeekbarMouseX(e)
            }
        }

        /**
         * On Mouse Up Handler.
         * @function
         */
        const handleMouseUp = (e) => {
            mouseDown.current = false
        }

        /**
         * On Mouse Down Handler.
         * @function
         */
        const handleMouseDown = (e) => {
            mouseDown.current = true
        }

        const timeStringFromSeconds = (time) => {
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

        /**
         * A Marker to indicate the current time of the video playback.
         * Appears inside progress on the right
         */
        const renderCurrentTimeMarker = () => {
            const curTimeDiv = <div>{timeStringFromSeconds(currentTime)}</div>
            const curMousePos = (progress * getWidth()) / 100
            const sixD = currentTime >= 3600
            const buffer = 10
            let top =
                Math.abs(mousePos.current - curMousePos) > 75 + buffer
                    ? -35
                    : sixD
                    ? -55
                    : Math.abs(mousePos.current - curMousePos) > 50 + buffer
                    ? -35
                    : -55
            top = adjustTimeMarker ? top : -35

            return (
                <div>
                    {showFullSeekbar && (
                        <div className={classes.seekbarCurrentTimeMarker}></div>
                    )}
                    {(showFullSeekbar || (showTime && mouseOver)) && (
                        <div
                            className={classes.seekbarCurrentTimeBox}
                            style={{
                                top: top,
                            }}
                        >
                            {curTimeDiv}
                        </div>
                    )}
                </div>
            )
        }

        const renderTrimStart = () => {
            const className = showFullSeekbar
                ? classes.ppeTrimmedFullProgress
                : classes.ppeTrimmedMinProgress

            return (
                <div
                    style={{
                        width: `${trimStartPercent}%`,
                        left: 0,
                    }}
                    className={className}
                ></div>
            )
        }

        const renderTrimEnd = () => {
            const className = showFullSeekbar
                ? classes.ppeTrimmedFullProgress
                : classes.ppeTrimmedMinProgress

            return (
                <div
                    style={{
                        width: `${trimEndPercent}%`,
                        left: `${100 - trimEndPercent}%`,
                    }}
                    className={className}
                ></div>
            )
        }

        /**
         * The progress of the video
         */
        const renderProgress = () => {
            const className = showFullSeekbar
                ? classes.ppeSeekbarFullProgress
                : classes.ppeSeekbarMinProgress

            return (
                <div
                    style={{
                        width: `${progress}%`,
                        left: 0,
                    }}
                    className={className}
                >
                    {renderCurrentTimeMarker()}
                </div>
            )
        }

        /**
         * Render the duration to the right
         */
        const renderDuration = () => {
            return (
                <div className={classes.seekbarDuration}>
                    {timeStringFromSeconds(duration)}
                </div>
            )
        }

        /**
         * This is how the mouse cursor should look when
         * user hovers over seekbar
         */
        const renderCursor = () => {
            const curMouseTime =
                mouseOverTime >= 0
                    ? mouseOverTime
                    : calculateTimeFromMouse(seekbarMouseX)
            //HACK:
            let leave = false
            if (mouseOverTime >= 0) {
                leave = false
            } else if (
                !hasSeekbar() ||
                curMouseTime < 0 ||
                isNaN(curMouseTime) ||
                !mouseOver
            ) {
                leave = true
            }
            if (leave) {
                mousePos.current = 0
                return null
            }

            const curMouseTimeStr = timeStringFromSeconds(curMouseTime)
            // HACK: -1 on the pixel location to avoid click jack.
            mousePos.current =
                curMouseTime != null && hasSeekbar()
                    ? // @ts-ignore
                      (ref.current.clientWidth * curMouseTime) / duration
                    : seekbarMouseX - 1

            return (
                <div
                    className={classes.seekbarCursor}
                    style={{ left: mousePos.current + 'px', zIndex: 0 }}
                >
                    <div
                        className={classes.seekbarCurrentTimeBox}
                        style={{ zIndex: 0 }}
                    >
                        {curMouseTimeStr}
                    </div>
                </div>
            )
        }

        /**
         * Marker renderer which controlbar can use to display the interval
         * Want to display the active slide interval on the control bar
         */
        function renderMarker(): JSX.Element {
            // Need to scale down the duration to progress space
            // and display that on the controlbar progress
            const slideDuration = 0
            const slideStart = 0
            const ratio = slideDuration / duration
            const globalControlBarWidth = getWidth()
            const startTime = slideStart + startOffset
            const xPosition = (startTime / duration) * globalControlBarWidth
            return (
                <Marker
                    key='1'
                    width={globalControlBarWidth * ratio}
                    xPosition={xPosition}
                />
            )
        }

        /**
         * Render the large seekbar, occurs when mouse over
         */
        const renderFull = () => {
            return (
                <div
                    className={`${classes.ppeSeekbar} ${classes.ppeSeekbarFull}`}
                    style={{ height: fullHeight }}
                >
                    {renderDisabledSegments()}
                    {renderTrimStart()}
                    {renderTrimEnd()}
                    {renderProgress()}
                    {renderCursor()}
                    {renderDuration()}
                </div>
            )
        }

        /**
         * Render the small seekbar. Can also consider this the inactive state.
         */
        const renderMinimal = () => {
            const detectorClass = detector
                ? classes.ppeSeekbarMinExpandable
                : ''
            return (
                <div
                    className={`${classes.ppeSeekbar} ${classes.ppeSeekbarMin} ${detectorClass}`}
                    style={{
                        height: detector ? minHeight : '100%',
                    }}
                >
                    {renderDisabledSegments()}
                    {renderTrimStart()}
                    {renderTrimEnd()}
                    {renderPlayedIntervals()}
                    {renderProgress()}
                    {renderCursor()}
                </div>
            )
        }

        const render = () => {
            let internal

            if (showFullSeekbar && !alwaysMin) internal = renderFull()
            else internal = renderMinimal()

            const secondClass = detector
                ? classes.superslideParent
                : classes.controlbarParent
            return (
                // NOTE: use onMouseEnter/Leave instead of onMouseOver/Out to avoid
                // flickering
                <div
                    ref={ref}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={onSeekbarClick}
                    className={`${classes.ppeSeekbarWrapper} ${secondClass}`}
                    data-test='ppeSeekbarWrapper'
                    style={{
                        height: detector ? fullHeight : minHeight,
                    }}
                    role='region'
                    aria-label={`Seekbar for video player`}
                >
                    {internal}
                </div>
            )
        }

        return render()
    }
)

export default Seekbar
