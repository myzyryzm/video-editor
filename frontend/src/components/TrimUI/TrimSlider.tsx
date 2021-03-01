/** @format */

import React, { useRef, useEffect, useState } from 'react'
import CustomSlider from '../Common/CustomSlider'
import { TrimInterval } from './commonRequirements'
import moment, { Moment } from 'moment'
import TimePicker from './TimePicker'

interface ITrimBar {
    setTrimTimes: (start: number, end: number, id: string) => void
    deleteInterval: (id: string) => void
    maxTimeSeconds: number
    minTimeSeconds: number
    id: string //id of trimSlider; if you do not initialize then a random id will be created inside the slider
}

export default function TrimSlider({
    setTrimTimes = () => {},
    deleteInterval = () => {},
    maxTimeSeconds = 50,
    minTimeSeconds = 0,
    id = '',
}: Partial<ITrimBar>): JSX.Element {
    const intervalId = useRef<string>(id)
    const [updatingInterval, setUpdatingInterval] = useState<boolean>(false)
    const [trimInterval, setTrimInterval] = useState<TrimInterval | undefined>(
        undefined
    )
    const [startMoment, setStartMoment] = useState<Moment>(moment())
    const [endMoment, setEndMoment] = useState<Moment>(moment())

    useEffect(() => {
        if (intervalId.current.length === 0) {
            intervalId.current = Math.round(100000 * Math.random()).toString()
        }
        setTrimInterval({
            id: intervalId.current,
            interval: [minTimeSeconds, maxTimeSeconds],
        })
        return () => {
            deleteInterval(intervalId.current)
        }
    }, [])

    useEffect(() => {
        if (trimInterval && trimInterval.interval[0] < minTimeSeconds) {
            setTrimInterval({
                ...trimInterval,
                interval: [minTimeSeconds, trimInterval.interval[1]],
            })
        }
    }, [minTimeSeconds])

    useEffect(() => {
        if (trimInterval && trimInterval.interval[1] > maxTimeSeconds) {
            setTrimInterval({
                ...trimInterval,
                interval: [trimInterval.interval[0], maxTimeSeconds],
            })
        }
    }, [maxTimeSeconds])

    useEffect(() => {
        if (trimInterval) {
            if (!updatingInterval) {
                setTrimTimes(
                    trimInterval.interval[0],
                    trimInterval.interval[1],
                    trimInterval.id
                )
            }
            setStartMoment(
                moment()
                    .set({
                        hour: 0,
                        minute: 0,
                        second: 0,
                    })
                    .add(trimInterval.interval[0], 'seconds')
            )
            setEndMoment(
                moment()
                    .set({
                        hour: 0,
                        minute: 0,
                        second: 0,
                    })
                    .add(trimInterval.interval[1], 'seconds')
            )
        }
    }, [trimInterval, updatingInterval])

    function validateValues(values: number[]) {
        if (trimInterval) {
            let end = values[1]
            if (end > maxTimeSeconds) {
                end = maxTimeSeconds
            }
            let start = values[0]
            if (start > end) {
                start = end
            }
            setTrimInterval({
                ...trimInterval,
                interval: [start, end],
            })
        }
    }

    function onTimePickerChange(type: 'start' | 'end', value: Moment) {
        if (trimInterval) {
            let start = trimInterval.interval[0]
            let end = trimInterval.interval[1]
            if (type === 'start') {
                start =
                    value.hours() * 3600 +
                    value.minutes() * 60 +
                    value.seconds() +
                    value.milliseconds() / 1000
            } else {
                end =
                    value.hours() * 3600 +
                    value.minutes() * 60 +
                    value.seconds() +
                    value.milliseconds() / 1000
            }
            setTrimInterval({
                ...trimInterval,
                interval: [start, end],
            })
        }
    }

    return !trimInterval ? (
        <></>
    ) : (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TimePicker
                    type='start'
                    maxTimeSeconds={trimInterval.interval[1]}
                    time={startMoment}
                    onChange={onTimePickerChange}
                />
                <TimePicker
                    type='end'
                    maxTimeSeconds={maxTimeSeconds}
                    time={endMoment}
                    onChange={onTimePickerChange}
                />
            </div>
            <CustomSlider
                onMouseDown={() => {
                    setUpdatingInterval(true)
                }}
                onMouseUp={() => {
                    setUpdatingInterval(false)
                }}
                getAriaLabel={(index) =>
                    index === 0 ? 'Trim start' : 'Trim end'
                }
                defaultValue={[minTimeSeconds, maxTimeSeconds]}
                onChange={(e, values) => {
                    if (values && Array.isArray(values)) {
                        validateValues(values)
                    }
                }}
                value={[trimInterval.interval[0], trimInterval.interval[1]]}
                min={0}
                max={maxTimeSeconds}
                step={0.01}
            />
        </div>
    )
}
