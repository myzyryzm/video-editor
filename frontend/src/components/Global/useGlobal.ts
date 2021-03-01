/** @format */
import { useState, useRef } from 'react'
import { TrimInterval } from '../TrimUI/commonRequirements'
import { Vector2D } from '../Common/commonRequirements'
import { UpdateType, GlobalHook } from './commonRequirements'

export default function useGlobal(): GlobalHook {
    const trimmedRegionsRef = useRef<Array<Vector2D>>([])
    const [_trimmedRegions, _setTrimmedRegions] = useState<Array<Vector2D>>([])

    function setTrimmedRegions(intervals: Array<TrimInterval>) {
        const regions = intervals.map((interval) => {
            return interval.interval
        })
        _setTrimmedRegions(regions)
        trimmedRegionsRef.current = regions
    }

    return {
        trimmedRegions: _trimmedRegions,
        setTrimmedRegions,
    }
}
