/** @format */
import { useState, useEffect, useContext } from 'react'
import { Vector2D } from '../Common/commonRequirements'
import { timeStringFromSeconds } from '../Common/utils'
import { TrimHook } from './commonRequirements'
import moment, { Moment } from 'moment'
import VideoPlayerContext from '../VideoPlayer/VideoPlayerContext'

export default function useTrimming(): TrimHook {
    const { duration, currentTime } = useContext(VideoPlayerContext)
    const [trimStart, setTrimStart] = useState<Moment>(
        moment().set({
            hour: 0,
            minute: 0,
            second: 0,
        })
    )
    const [trimEnd, setTrimEnd] = useState<Moment>(
        moment().set({
            hour: 0,
            minute: 0,
            second: 0,
        })
    )
    const [trimStartPercent, setTrimStartPercent] = useState<number>(0)
    const [trimEndPercent, setTrimEndPercent] = useState<number>(0)
    const [maxStartTime, setMaxStartTime] = useState<number>(0)
    const [_trimStart, _setTrimStart] = useState<number>(0)
    const [_trimEnd, _setTrimEnd] = useState<number>(0)

    useEffect(() => {
        if (duration > 0) {
            _setTrimEnd(duration)
            setTrimEnd(
                moment()
                    .set({
                        hour: 0,
                        minute: 0,
                        second: 0,
                    })
                    .add(duration, 'seconds')
            )
        }
    }, [duration])

    useEffect(() => {
        const value = trimEnd
        if (value.isValid()) {
            let t =
                value.hours() * 3600 + value.minutes() * 60 + value.seconds()
            const d = duration > t ? duration : t
            setTrimEndPercent((100 * (d - t)) / d)
            setMaxStartTime(t)
            const trimStartTime = trimTime('start')
            if (trimStartTime > t) {
                setTrimStart(value)
            }
        }
    }, [trimEnd, duration])

    useEffect(() => {
        const value = trimStart
        if (value.isValid()) {
            let t =
                value.hours() * 3600 + value.minutes() * 60 + value.seconds()
            const d = duration > t ? duration : t
            setTrimStartPercent((100 * t) / d)
        }
    }, [trimStart, duration])

    function trimTime(type: 'start' | 'end'): number {
        const value = type === 'start' ? trimStart : trimEnd
        let t = value.hours() * 3600 + value.minutes() * 60 + value.seconds()
        return t
    }

    function updateTrimTime(type: 'start' | 'end', value: Moment): void {
        if (value.isValid()) {
            if (type === 'start') {
                setTrimStart(value)
                // let t =
                //     value.hours() * 3600 + value.minutes() * 60 + value.seconds()
                // const d = duration.current > t ? duration.current : t
                // setTrimStartPercent((100 * t) / d)
            } else {
                setTrimEnd(value)
            }
        }
    }

    function changeTrimTime(type: 'start' | 'end', value: number): void {
        if (type === 'start') {
            _setTrimStart(value)
        } else {
            _setTrimEnd(value)
        }
    }

    function setTrimToCurrentTime(type: 'start' | 'end'): void {
        const t = currentTime()
        const value: Moment = moment()
            .set({
                hour: 0,
                minute: 0,
                second: 0,
            })
            .add(t, 'seconds')
        updateTrimTime(type, value)
    }

    function trimVector(): Vector2D {
        let value = trimStart
        const startTime =
            value.hours() * 3600 * 1000 +
            value.minutes() * 60 * 1000 +
            value.seconds() * 1000 +
            value.milliseconds()
        value = trimEnd
        const endTime =
            value.hours() * 3600 * 1000 +
            value.minutes() * 60 * 1000 +
            value.seconds() * 1000 +
            value.milliseconds()
        return [startTime, endTime]
    }

    return {
        trimStart,
        trimEnd,
        updateTrimTime,
        trimStartPercent,
        trimEndPercent,
        maxStartTime,
        setTrimToCurrentTime,
        trimVector,
        _trimStart,
        _trimEnd,
        changeTrimTime,
    }
}
