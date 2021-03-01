/** @format */
import { useState, useEffect, useContext } from 'react'
import { TrimHook, TrimInterval } from './commonRequirements'
import moment, { Moment } from 'moment'
import VideoPlayerContext from '../VideoPlayer/VideoPlayerContext'
import GlobalContext from '../Global/GlobalContext'

export default function useTrimming(): TrimHook {
    const { duration, currentTime } = useContext(VideoPlayerContext)
    const { setTrimmedRegions } = useContext(GlobalContext)
    const [trimIntervals, setTrimIntervals] = useState<Array<TrimInterval>>([])

    useEffect(() => {
        if (duration > 0) {
            // setTrimTime('end', duration)
        }
    }, [duration])

    useEffect(() => {
        setTrimmedRegions(trimIntervals)
    }, [trimIntervals])

    function getTrimInterval(id: string | number): TrimInterval | undefined {
        let trimInterval: TrimInterval | undefined = undefined
        if (typeof id === 'string') {
            // id is being used here
            trimInterval = trimIntervals.find((interval) => interval.id === id)
        } else if (id < trimIntervals.length && id >= 0) {
            // id is being used here as an index for the trimInterval array
            trimInterval = trimIntervals[0]
        }
        return trimInterval
    }

    function numberTime(
        time: number | Moment | undefined,
        defaultTime: number = 0
    ): number {
        if (typeof time == 'number') {
            return time
        }
        if (typeof time == 'undefined') {
            return defaultTime
        }
        return (
            time.hours() * 3600 +
            time.minutes() * 60 +
            time.seconds() +
            time.milliseconds() / 1000
        )
    }

    /**
     * deletes an interval. will return true if it found the interval else it returns false
     * @param id
     */
    function deleteInterval(id: string): boolean {
        const trimInterval = getTrimInterval(id)
        if (trimInterval) {
            setTrimIntervals(
                trimIntervals.filter((interval) => {
                    return interval.id !== id
                })
            )
        }
        return trimInterval != undefined
    }

    function updateInterval(
        id: string,
        start?: number | Moment,
        end?: number | Moment
    ) {
        const trimInterval = getTrimInterval(id)
        if (trimInterval) {
            setTrimIntervals(
                trimIntervals.map((interval) => {
                    if (interval.id !== id) {
                        return interval
                    }
                    start = numberTime(start, interval[0])
                    end = numberTime(end, interval[1])
                    return {
                        ...interval,
                        interval: [start, end],
                    }
                })
            )
        } else {
            // create a new interval
            start = numberTime(start, 0)
            end = numberTime(end, duration)
            setTrimIntervals([
                ...trimIntervals,
                {
                    id,
                    interval: [start, end],
                },
            ])
        }
    }

    function trimTime(
        type: 'start' | 'end',
        returnType: 'number' | 'moment' | 'percent',
        id: string | number
    ): number | Moment {
        let trimInterval = getTrimInterval(id)
        let time: number = 0
        if (trimInterval) {
            time =
                type === 'start'
                    ? trimInterval.interval[0]
                    : trimInterval.interval[1]
        } else {
            // TODO: how to handle an undefined trimInterval?
        }
        // const time = type === 'start' ? trimStart : trimEnd
        if (returnType === 'number') {
            return time
        } else if (returnType === 'percent') {
            return (100 * (duration - time)) / duration
        }
        return moment()
            .set({
                hour: 0,
                minute: 0,
                second: 0,
            })
            .add(time, 'seconds')
    }

    function setTrimTimeToCurrentTime(type: 'start' | 'end', id: string): void {
        const t = currentTime()
        if (type === 'start') {
            updateInterval(id, t, undefined)
        } else {
            updateInterval(id, undefined, t)
        }
    }

    return {
        setTrimTimeToCurrentTime,
        trimTime,
        updateInterval,
        deleteInterval,
    }
}
