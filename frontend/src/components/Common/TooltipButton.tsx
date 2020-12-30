/** @format */

import React, { useState, CSSProperties } from 'react'
import { withStyles } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'

const LargeTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: 'gray',
        color: 'white',
        boxShadow: theme.shadows[1],
        fontSize: 10,
    },
}))(Tooltip)

interface IStyles {
    wrapper: CSSProperties
    inner: CSSProperties
}

interface ITooltipButton {
    children: JSX.Element | Array<JSX.Element>
    className: string
    ariaLabel: string
    onClick: (...args: any) => void
    tooltipLabel: string
    tooltipPosition:
        | 'bottom'
        | 'left'
        | 'right'
        | 'top'
        | 'bottom-end'
        | 'bottom-start'
        | 'left-end'
        | 'left-start'
        | 'right-end'
        | 'right-start'
        | 'top-end'
        | 'top-start'
    styles: Partial<IStyles>
    id: string
    hideTooltip: boolean
    disabled: boolean
    tabIndex: number
}

export default function TooltipButton({
    children = <></>,
    className = '',
    ariaLabel = '',
    onClick = () => {},
    tooltipLabel = '',
    tooltipPosition = 'top',
    styles = { wrapper: {}, inner: {} },
    id = '',
    hideTooltip = false,
    disabled = false,
    tabIndex = 0,
}: Partial<ITooltipButton>) {
    const [useOutline, setOutline] = useState<boolean>(false)
    const aLabel = ariaLabel.length > 0 ? ariaLabel : tooltipLabel
    id = id.length > 0 ? id : `${className} ${aLabel}`
    let wrapperStyle: CSSProperties = styles.wrapper ? styles.wrapper : {}
    wrapperStyle = {
        ...wrapperStyle,
        outline: useOutline ? '' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
    }
    let innerStyle: CSSProperties = styles.inner ? styles.inner : {}
    innerStyle = {
        ...innerStyle,
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: 14,
        fontWeight: 500,
        alignItems: 'center',
        textTransform: 'uppercase',
    }

    const wrapped = (inner) => {
        const hide =
            hideTooltip || (tooltipLabel.length === 0 && aLabel.length === 0)
        if (hide) {
            return inner
        }
        const label = tooltipLabel.length > 0 ? tooltipLabel : aLabel
        return (
            <LargeTooltip title={label} placement={tooltipPosition}>
                {inner}
            </LargeTooltip>
        )
    }
    return (
        <div
            id={id}
            className={className}
            onClick={onClick}
            aria-label={aLabel}
            tabIndex={tabIndex}
            onKeyDown={(e) => {
                if (e.key === ' ') {
                    setOutline(true)
                    if (document.activeElement) {
                        const element: HTMLElement = document.activeElement as HTMLElement
                        element.click()
                    }
                }
            }}
            onKeyUp={(e) => {
                if (e.key === 'Tab') {
                    setOutline(true)
                }
            }}
            onMouseDown={(e) => {
                setOutline(false)
            }}
            style={wrapperStyle}
        >
            {wrapped(<div style={innerStyle}>{children}</div>)}
        </div>
    )
}
