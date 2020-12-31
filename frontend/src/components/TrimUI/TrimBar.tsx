/** @format */

import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'

const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.main,
        height: 17,
        padding: '13px 0',
    },
    thumb: {
        height: 30,
        width: 30,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        marginTop: -8,
        marginLeft: -13,
        boxShadow: '#ebebeb 0 2px 2px',
        '&:focus, &:hover, &$active': {
            boxShadow: '#ccc 0 2px 3px 1px',
        },
        '& .bar': {
            // display: inline-block !important;
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    active: {},
    track: {
        height: 17,
        color: theme.palette.primary.main,
    },
    rail: {
        color: 'white',
        opacity: 1,
        height: 17,
        borderRadius: 4,
    },
}))

function CustomThumb(props) {
    return (
        <span {...props}>
            <span className='bar' />
            <span className='bar' />
            <span className='bar' />
        </span>
    )
}

interface ITrimBar {
    trimStart: number
    trimEnd: number
    updateTrimTimes: (start: number, end: number) => void
    maxTimeSeconds: number
}

export default function TrimBar({
    trimStart = 0,
    trimEnd = 50,
    updateTrimTimes = () => {},
    maxTimeSeconds = 100,
}: Partial<ITrimBar>): JSX.Element {
    const classes = useStyles()
    function validateValues(values: number[]) {
        let start = values[0]
        let end = values[1]
        if (start > end) {
            start = end
        }
        if (end > maxTimeSeconds) {
            end = maxTimeSeconds
        }
        updateTrimTimes(start, end)
    }

    return (
        <Slider
            ThumbComponent={CustomThumb}
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
            classes={{
                root: classes.root,
                thumb: classes.thumb,
                active: classes.active,
                track: classes.track,
                rail: classes.rail,
            }}
        />
    )
}
