/** @format */
import { useState, useEffect, useContext } from 'react'
import { TrimHook } from './commonRequirements'
import moment, { Moment } from 'moment'
import VideoPlayerContext from '../VideoPlayer/VideoPlayerContext'

export default function useTrimming(): TrimHook {
    const { duration, currentTime } = useContext(VideoPlayerContext)
    const [trimStartMoment, setTrimStartMoment] = useState<Moment>(
        moment().set({
            hour: 0,
            minute: 0,
            second: 0,
        })
    )
    const [trimEndMoment, setTrimEndMoment] = useState<Moment>(
        moment().set({
            hour: 0,
            minute: 0,
            second: 0,
        })
    )
    const [trimStartPercent, setTrimStartPercent] = useState<number>(0)
    const [trimEndPercent, setTrimEndPercent] = useState<number>(0)
    const [trimStart, setTrimStart] = useState<number>(0)
    const [trimEnd, setTrimEnd] = useState<number>(0)

    useEffect(() => {
        if (duration > 0) {
            setTrimTime('end', duration)
        }
    }, [duration])

    useEffect(() => {
        const time = trimEnd
        if (time > 0) {
            const d = duration > time ? duration : time
            setTrimEndPercent((100 * (d - time)) / d)
            if (trimTime('start', 'number') > time) {
                setTrimTime('start', time)
            }
        }
    }, [trimEnd])

    useEffect(() => {
        const time = trimStart
        if (time > 0) {
            const d = duration > time ? duration : time
            setTrimStartPercent((100 * time) / d)
        }
    }, [trimStart])

    function setTrimTime(type: 'start' | 'end', value: number | Moment): void {
        if (type === 'start') {
            if (typeof value == 'number') {
                setTrimStart(value)
                setTrimStartMoment(
                    moment()
                        .set({
                            hour: 0,
                            minute: 0,
                            second: 0,
                        })
                        .add(value, 'seconds')
                )
            } else {
                setTrimStartMoment(value)
                setTrimStart(
                    value.hours() * 3600 +
                        value.minutes() * 60 +
                        value.seconds() +
                        value.milliseconds() / 1000
                )
            }
        } else {
            if (typeof value == 'number') {
                setTrimEnd(value)
                setTrimEndMoment(
                    moment()
                        .set({
                            hour: 0,
                            minute: 0,
                            second: 0,
                        })
                        .add(value, 'seconds')
                )
            } else {
                setTrimEndMoment(value)
                setTrimEnd(
                    value.hours() * 3600 +
                        value.minutes() * 60 +
                        value.seconds() +
                        value.milliseconds() / 1000
                )
            }
        }
    }

    function trimTime(
        type: 'start' | 'end',
        returnType: 'number' | 'moment' | 'percent'
    ): number | Moment {
        if (returnType === 'number') {
            return type === 'start' ? trimStart : trimEnd
        } else if (returnType === 'percent') {
            return type === 'start' ? trimStartPercent : trimEndPercent
        }
        return type === 'start' ? trimStartMoment : trimEndMoment
    }

    function setTrimTimeToCurrentTime(type: 'start' | 'end'): void {
        const t = currentTime()
        setTrimTime(type, t)
    }

    return {
        setTrimTimeToCurrentTime: setTrimTimeToCurrentTime,
        setTrimTime,
        trimTime,
    }
}
