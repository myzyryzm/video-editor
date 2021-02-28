/** @format */

import { Moment } from 'moment'
import { Vector2D } from '../Common/commonRequirements'

export interface TrimHook {
    setTrimTimeToCurrentTime: (type: 'start' | 'end', id: string) => void
    trimTime: (
        type: 'start' | 'end',
        returnType: 'number' | 'moment' | 'percent',
        id: string | number
    ) => number | Moment
    updateInterval: (
        id: string,
        start?: number | Moment,
        end?: number | Moment
    ) => void
    deleteInterval: (id: string) => boolean
}

export interface TrimInterval {
    id: string // id given to the trim slider
    interval: Vector2D // [start, end]
}
