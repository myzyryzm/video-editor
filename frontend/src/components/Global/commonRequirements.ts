/** @format */
import { Vector2D } from '../Common/commonRequirements'
import { TrimInterval } from '../TrimUI/commonRequirements'

export type UpdateType = 'GET' | 'POST' | 'DELETE'
export type TrimType = 'start' | 'end' | number

export interface GlobalHook {
    trimmedRegions: Array<Vector2D>
    setTrimmedRegions: (intervals: Array<TrimInterval>) => void
}
