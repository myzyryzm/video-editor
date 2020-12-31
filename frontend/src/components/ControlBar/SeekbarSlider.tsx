/** @format */

import React, { forwardRef, ChangeEvent, useRef, useState } from 'react'
import CustomSlider from '../Common/CustomSlider'
import { timeStringFromSeconds, useCombinedRefs } from '../Common/utils'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    currentTimeBox: {
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
    currentTimeMarker: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        height: '100%',
        width: '5px',
        background: 'white',
    },
    trimmedSection: {
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
    duration: {
        fontSize: '10pt',
        color: 'rgba(0,0,0,0.8)',
        position: 'absolute',
        top: 8.75,
        right: 30,
        bottom: -35,
    },
    cursor: {
        position: 'absolute',
        height: '100%',
        width: 'auto',
        borderLeft: '1px solid black',
    },
})

interface ISeekbarSlider {
    onSeek: (newProgress: number) => void
    duration: number
    currentTime: number
    mouseOverTime: number
    trimStartPercent: number
    trimEndPercent: number
    adjustTimeMarker: boolean
}

const SeekbarSlider = forwardRef<HTMLSpanElement, Partial<ISeekbarSlider>>(
    (
        {
            onSeek = () => {},
            duration = 1,
            currentTime = 0,
            mouseOverTime = -1,
            trimStartPercent = 0,
            trimEndPercent = 0,
            adjustTimeMarker = true,
        },
        ref: React.Ref<HTMLSpanElement>
    ) => {
        const classes = useStyles()
        const defaultRef = useRef(null)
        const combinedRef = useCombinedRefs(ref, defaultRef)
        const [seekbarMouseX, setSeekbarMouseX] = useState<number>(0)
        const [mouseOver, setMouseOver] = useState<boolean>(false)
        const mouseDown = useRef<boolean>(false)
        const mousePos = useRef<number>(0)

        const hasSeekbar = (): boolean => combinedRef && combinedRef.current

        function getWidth(): number {
            return combinedRef.current ? combinedRef.current.clientWidth : 0
        }

        function onTimeChange(e: ChangeEvent<{}>, time: number | number[]) {
            if (!Array.isArray(time) && duration > 0) {
                const newProgress = time > duration ? 1 : time / duration
                onSeek(newProgress)
                const w = getWidth()
                if (w > 0) {
                    const min: number = combinedRef.current.getBoundingClientRect()
                        .x
                    setSeekbarMouseX(min + w * newProgress)
                }
            }
        }

        function updateSeekbarMouseX(
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>
        ) {
            if (!combinedRef.current || !event.nativeEvent) {
                return 0
            }
            const xPos =
                event.nativeEvent.clientX -
                combinedRef.current.getBoundingClientRect().x
            setSeekbarMouseX(xPos)
            return xPos
        }

        /**
         * On Mouse Enter handler.
         * @function
         */
        function onMouseEnter(
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>
        ) {
            updateSeekbarMouseX(event)
            setMouseOver(true)
        }

        /**
         * A function that gets called when the mouse leaves the seekbar. Put any logic
         * that needs to proceed that event here.
         * @function
         */
        function onMouseLeave(
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>
        ) {
            mouseDown.current = false
            setMouseOver(false)
        }

        /**
         * On Mouse Move Handler.
         * @function
         * @param {Object} e Mouse Eevent.
         */
        const onMouseMove = (
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>
        ) => {
            // If the user is just hovering then we want to update seekbarmousex
            if (!mouseDown.current) {
                updateSeekbarMouseX(event)
            }
        }

        /**
         * On Mouse Up Handler.
         * @function
         */
        function onMouseUp(
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>
        ) {
            mouseDown.current = false
        }

        /**
         * On Mouse Down Handler.
         * @function
         */
        function onMouseDown(
            event: React.MouseEvent<HTMLSpanElement, MouseEvent>
        ) {
            mouseDown.current = true
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

        /**
         * Calculate the percentage progress relative to the width of the seekbar
         * @function
         * @param {number} xPosition The X coordinate of the mouse.
         * @return {Number} Progress with range [0,1]
         */
        function calculateProgressFromMouse(xPosition: number) {
            return combinedRef.current
                ? (xPosition / combinedRef.current.clientWidth) * 100
                : 0
        }

        /**
         * A Marker to indicate the current time of the video playback.
         * Appears inside progress on the right
         */
        function renderCurrentTimeMarker(): JSX.Element {
            const progress = currentTime > duration ? 1 : currentTime / duration
            const curMousePos = (progress * getWidth()) / 100
            const sixD = currentTime >= 3600 //six digits b/c > 1 hour (i.e. 00:00:00 vs 00:00 for less than 1 hour)
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
                    <div className={classes.currentTimeMarker}></div>
                    <div
                        className={classes.currentTimeBox}
                        style={{
                            top: top,
                        }}
                    >
                        <div>{timeStringFromSeconds(currentTime)}</div>
                    </div>
                </div>
            )
        }

        function renderTrimStart() {
            return (
                <div
                    style={{
                        width: `${trimStartPercent}%`,
                        left: 0,
                    }}
                    className={classes.trimmedSection}
                ></div>
            )
        }

        function renderTrimEnd() {
            return (
                <div
                    style={{
                        width: `${trimEndPercent}%`,
                        left: `${100 - trimEndPercent}%`,
                    }}
                    className={classes.trimmedSection}
                ></div>
            )
        }

        /**
         * Render the duration to the right
         */
        function renderDuration() {
            return (
                <div className={classes.duration}>
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
                    ? (combinedRef.current.clientWidth * curMouseTime) /
                      duration
                    : seekbarMouseX - 1

            return (
                <div
                    className={classes.cursor}
                    style={{ left: mousePos.current + 'px', zIndex: 0 }}
                >
                    <div
                        className={classes.currentTimeBox}
                        style={{ zIndex: 0 }}
                    >
                        {curMouseTimeStr}
                    </div>
                </div>
            )
        }

        return (
            <CustomSlider
                ref={combinedRef}
                getAriaLabel={() => 'time'}
                onChange={onTimeChange}
                value={currentTime}
                max={duration}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
            />
        )
    }
)

export default SeekbarSlider
