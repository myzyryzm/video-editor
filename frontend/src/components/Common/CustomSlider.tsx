/** @format */

import React, { forwardRef } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'

const StylizedSlider = withStyles((theme) => ({
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
}))(Slider)

function CustomThumb(props) {
    return (
        <span {...props}>
            <span className='bar' />
            <span className='bar' />
            <span className='bar' />
        </span>
    )
}

interface ICustomSlider {
    'aria-label'?: string
    'aria-labelledby'?: string
    'aria-valuetext'?: string
    color?: 'primary' | 'secondary'
    defaultValue?: number | number[]
    disabled?: boolean
    getAriaLabel?: (index: number) => string
    getAriaValueText?: (value: number, index: number) => string
    // marks?: boolean | Mark[];
    max?: number
    min?: number
    name?: string
    onChange?: (event: React.ChangeEvent<{}>, value: number | number[]) => void
    onChangeCommitted?: (
        event: React.ChangeEvent<{}>,
        value: number | number[]
    ) => void
    orientation?: 'horizontal' | 'vertical'
    step?: number | null
    scale?: (value: number) => number
    // ThumbComponent?: React.ElementType<React.HTMLAttributes<HTMLSpanElement>>
    track?: 'normal' | false | 'inverted'
    value?: number | number[]
    // ValueLabelComponent?: React.ElementType<ValueLabelProps>;
    valueLabelDisplay?: 'on' | 'auto' | 'off'
    valueLabelFormat?:
        | string
        | ((value: number, index: number) => React.ReactNode)
    onMouseEnter?: (
        event: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => void
    onMouseLeave?: (
        event: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => void
    onMouseMove?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
    onMouseUp?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
    onMouseDown?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

const CustomSlider = forwardRef<HTMLSpanElement, Partial<ICustomSlider>>(
    (
        {
            getAriaLabel = () => '',
            defaultValue = 0,
            onChange = () => {},
            value = 0,
            min = 0,
            max = 100,
            step = 0.1,
            onMouseEnter = () => {},
            onMouseLeave = () => {},
            onMouseMove = () => {},
            onMouseUp = () => {},
            onMouseDown = () => {},
        },
        ref
    ) => {
        return (
            <StylizedSlider
                ref={ref}
                ThumbComponent={CustomThumb}
                getAriaLabel={getAriaLabel}
                defaultValue={defaultValue}
                onChange={onChange}
                value={value}
                min={min}
                max={max}
                step={step}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
            />
        )
    }
)

export default CustomSlider
