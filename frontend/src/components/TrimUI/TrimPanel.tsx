/** @format */

import React, { useContext, useRef } from 'react'
import MomentUtils from '@date-io/moment'
import moment, { Moment } from 'moment'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from '@material-ui/pickers'
import {
    Card,
    CardContent,
    CardHeader,
    withStyles,
    Typography,
    Button,
} from '@material-ui/core'
import useTrimming from './useTrimming'
import TrimSlider from './TrimSlider'
import SeekbarSlider from '../ControlBar/SeekbarSlider'
import VideoPlayerContext from '../VideoPlayer/VideoPlayerContext'

const Header = withStyles((theme) => ({
    root: {
        fontWeight: 'bold',
        width: '100%',
        padding: 0,
        color: 'white',
        marginBottom: 10,
    },
}))(Typography)

interface ITimePicker {
    type: 'start' | 'end'
    time: Moment
    onChange: (type: 'start' | 'end', value: Moment) => void
    maxTimeSeconds: number
    setToTime: () => void
}
function TimePicker({
    type,
    time,
    onChange,
    maxTimeSeconds,
    setToTime,
}: ITimePicker) {
    const validateTimeValue = (value: Moment): Moment => {
        const maxEndTime: Moment = moment()
            .set({
                hour: 0,
                minute: 0,
                second: 0,
            })
            .add(maxTimeSeconds, 'seconds')

        if (value >= maxEndTime) {
            return maxEndTime
        } else {
            return value
        }
    }

    return (
        <Card
            style={{
                width: '94%',
                marginBottom: 10,
                display: 'flex',
            }}
        >
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardTimePicker
                    label={`${type == 'start' ? 'Start Time:' : 'End Time:'}`}
                    ampm={false}
                    keyboardIcon={null}
                    format='HH:mm:ss'
                    onChange={(date, value) => {
                        onChange(type, date as Moment)
                    }}
                    value={validateTimeValue(time)}
                    style={{
                        margin: 5,
                        width: '40%',
                    }}
                />
            </MuiPickersUtilsProvider>
            <Button
                autoFocus
                variant='contained'
                color='primary'
                style={{
                    margin: 'auto',
                    marginRight: 5,
                    height: '50%',
                    minHeight: 28,
                    maxHeight: 40,
                    fontSize: 13,
                }}
                onClick={setToTime}
            >
                Set To Time
            </Button>
        </Card>
    )
}

interface ITrimPanel {}

export default function TrimPanel({}: ITrimPanel) {
    const { setTrimTimeToCurrentTime, setTrimTime, trimTime } = useTrimming()
    const { duration, currentTime, onSeek: videoOnSeek } = useContext(
        VideoPlayerContext
    )
    const seekbarRef = useRef<HTMLSpanElement>({} as HTMLSpanElement)

    function setTrimTimes(start: number | Moment, end: number | Moment) {
        setTrimTime('start', start)
        setTrimTime('end', end)
    }
    function onSeek(newProgress: number) {
        videoOnSeek(newProgress * duration)
    }

    const trimStart = trimTime('start', 'number') as number
    const trimEnd = trimTime('end', 'number') as number
    const trimStartMoment = trimTime('start', 'moment') as Moment
    const trimEndMoment = trimTime('end', 'moment') as Moment

    return (
        <Card
            style={{
                height: 'auto',
                paddingBottom: 20,
                backgroundColor: 'rgb(63, 62, 143)',
            }}
        >
            <CardContent
                style={{
                    marginLeft: 20,
                    padding: 0,
                    marginRight: 20,
                }}
            >
                <CardHeader
                    title={'Trim Video'}
                    component={Header}
                    style={{ fontSize: 20 }}
                />
                <Typography style={{ color: 'white' }}>
                    Something about whatever it is this does.
                </Typography>
                <SeekbarSlider
                    ref={seekbarRef}
                    onSeek={onSeek}
                    currentTime={currentTime()}
                    duration={duration}
                />
                <TrimSlider
                    trimStart={trimStart}
                    trimEnd={trimEnd}
                    setTrimTimes={setTrimTimes}
                    maxTimeSeconds={duration}
                />
                {/* <TimePicker
                    type='start'
                    time={trimStartMoment}
                    onChange={setTrimTime}
                    maxTimeSeconds={trimEnd}
                    setToTime={() => setTrimTimeToCurrentTime('start')}
                />
                <TimePicker
                    type='end'
                    time={trimEndMoment}
                    onChange={setTrimTime}
                    maxTimeSeconds={duration}
                    setToTime={() => setTrimTimeToCurrentTime('end')}
                /> */}
            </CardContent>
        </Card>
    )
}
