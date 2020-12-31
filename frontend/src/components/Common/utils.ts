/** @format */

import { MutableRefObject, useRef, useEffect } from 'react'

export function timeStringFromSeconds(time) {
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

export function useCombinedRefs(...refs): MutableRefObject<any> {
    const targetRef = useRef()

    useEffect(() => {
        refs.forEach((ref) => {
            if (!ref) return

            if (typeof ref === 'function') {
                ref(targetRef.current)
            } else {
                ref.current = targetRef.current
            }
        })
    }, [refs])

    return targetRef
}
