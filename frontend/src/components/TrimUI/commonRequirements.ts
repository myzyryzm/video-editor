/** @format */

import { Moment } from 'moment'

export interface TrimHook {
    setTrimTimeToCurrentTime: (type: 'start' | 'end') => void
    setTrimTime: (type: 'start' | 'end', value: number | Moment) => void
    trimTime: (
        type: 'start' | 'end',
        returnType: 'number' | 'moment' | 'percent'
    ) => number | Moment
}
