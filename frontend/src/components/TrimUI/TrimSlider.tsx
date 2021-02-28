/** @format */

import React, { useRef, useEffect, useState } from 'react'
import CustomSlider from '../Common/CustomSlider'
import { TrimInterval } from './commonRequirements'

interface ITrimBar {
    setTrimTimes: (start: number, end: number, id: string) => void
    deleteInterval: (id: string) => void
    maxTimeSeconds: number
    minTimeSeconds: number
    id: string //id of trimSlider; if you do not initialize then
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
        if (trimInterval && !updatingInterval) {
            setTrimTimes(
                trimInterval.interval[0],
                trimInterval.interval[1],
                trimInterval.id
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

    return !trimInterval ? (
        <></>
    ) : (
        <CustomSlider
            onMouseDown={() => {
                setUpdatingInterval(true)
            }}
            onMouseUp={() => {
                setUpdatingInterval(false)
            }}
            getAriaLabel={(index) => (index === 0 ? 'Trim start' : 'Trim end')}
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
    )
}
