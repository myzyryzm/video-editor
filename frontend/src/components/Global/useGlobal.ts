/** @format */
import { useState, useRef } from 'react'
import { TrimInterval } from '../TrimUI/commonRequirements'
import { Vector2D } from '../Common/commonRequirements'
import { UpdateType, GlobalHook } from './commonRequirements'

export default function useGlobal(): GlobalHook {
    const trimmedRegionsRef = useRef<Array<Vector2D>>([])
    const [_trimmedRegions, setTrimmedRegions] = useState<Array<Vector2D>>([])

    function trimmedRegions(
        type: UpdateType = 'GET',
        intervals?: Array<TrimInterval>
    ): Array<Vector2D> {
        let regions = trimmedRegionsRef.current
        if (type !== 'GET' && intervals) {
            regions = intervals.map((interval) => {
                return interval.interval
            })
        }
        setTrimmedRegions(regions)
        trimmedRegionsRef.current = regions
        return regions
    }

    return {
        trimmedRegions,
    }
}
