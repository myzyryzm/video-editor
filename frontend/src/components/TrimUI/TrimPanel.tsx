/** @format */

import React, { useContext } from 'react'
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
import TrimBar from './TrimBar'
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
    const {
        trimEnd,
        trimStart,
        updateTrimTime,
        maxStartTime,
        setTrimToCurrentTime,
        changeTrimTime,
        _trimStart,
        _trimEnd,
    } = useTrimming()
    const { duration } = useContext(VideoPlayerContext)

    function updateTrimTimes(start: number, end: number) {
        changeTrimTime('start', start)
        changeTrimTime('end', end)
        // const newStart: Moment = moment()
        //     .set({
        //         hour: 0,
        //         minute: 0,
        //         second: 0,
        //     })
        //     .add(start, 'seconds')
        // updateTrimTime('start', newStart)
        // const newEnd: Moment = moment()
        //     .set({
        //         hour: 0,
        //         minute: 0,
        //         second: 0,
        //     })
        //     .add(end, 'seconds')
        // updateTrimTime('end', newEnd)
    }

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
                <TrimBar
                    trimStart={_trimStart}
                    trimEnd={_trimEnd}
                    updateTrimTimes={updateTrimTimes}
                    maxTimeSeconds={duration}
                />
                {/* <TimePicker
                    type='start'
                    time={trimStart}
                    onChange={updateTrimTime}
                    maxTimeSeconds={maxStartTime}
                    setToTime={() => setTrimToCurrentTime('start')}
                />
                <TimePicker
                    type='end'
                    time={trimEnd}
                    onChange={updateTrimTime}
                    maxTimeSeconds={duration}
                    setToTime={() => setTrimToCurrentTime('end')}
                /> */}
            </CardContent>
        </Card>
    )
}
