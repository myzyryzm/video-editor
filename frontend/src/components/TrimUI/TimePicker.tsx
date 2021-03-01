/** @format */

import React from 'react'
import MomentUtils from '@date-io/moment'
import moment, { Moment } from 'moment'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from '@material-ui/pickers'

interface ITimePicker {
    type: 'start' | 'end'
    time: Moment
    onChange: (type: 'start' | 'end', value: Moment) => void
    maxTimeSeconds: number
    setToTime: () => void
}

export default function TimePicker({
    type = 'start',
    time = moment(),
    onChange = () => {},
    maxTimeSeconds = 0,
    setToTime = () => {},
}: Partial<ITimePicker>) {
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
                    width: '20%',
                    minWidth: 100,
                    maxWidth: 150,
                }}
            />
        </MuiPickersUtilsProvider>
    )
}
