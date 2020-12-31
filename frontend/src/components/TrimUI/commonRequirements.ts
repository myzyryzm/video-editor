/** @format */

import { Moment } from 'moment'
import { Vector2D } from '../Common/commonRequirements'

export interface TrimHook {
    trimStart: Moment
    trimEnd: Moment
    updateTrimTime: (type: 'start' | 'end', value: Moment) => void
    trimStartPercent: number
    trimEndPercent: number
    maxStartTime: number
    setTrimToCurrentTime: (type: 'start' | 'end') => void
    trimVector: () => Vector2D
    _trimStart: number
    _trimEnd: number
    changeTrimTime: (type: 'start' | 'end', value: number) => void
}
