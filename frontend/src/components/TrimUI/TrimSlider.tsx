/** @format */

import React from 'react'
import CustomSlider from '../Common/CustomSlider'

interface ITrimBar {
    trimStart: number
    trimEnd: number
    setTrimTimes: (start: number, end: number) => void
    maxTimeSeconds: number
}

export default function TrimSlider({
    trimStart = 0,
    trimEnd = 50,
    setTrimTimes = () => {},
    maxTimeSeconds = 50,
}: Partial<ITrimBar>): JSX.Element {
    function validateValues(values: number[]) {
        let end = values[1]
        if (end > maxTimeSeconds) {
            end = maxTimeSeconds
        }
        let start = values[0]
        if (start > end) {
            start = end
        }
        setTrimTimes(start, end)
    }

    return (
        <CustomSlider
            getAriaLabel={(index) => (index === 0 ? 'Trim start' : 'Trim end')}
            defaultValue={[trimStart, maxTimeSeconds]}
            onChange={(e, values) => {
                console.log('values', values)
                if (values && Array.isArray(values)) {
                    validateValues(values)
                }
            }}
            value={[trimStart, trimEnd]}
            min={0}
            max={maxTimeSeconds}
            step={0.1}
        />
    )
}
