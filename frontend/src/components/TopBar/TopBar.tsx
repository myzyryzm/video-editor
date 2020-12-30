/** @format */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu'
import TooltipButton from '../Common/TooltipButton'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}))

export default function TopBar(): JSX.Element {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <AppBar color='primary' position='static'>
                <Toolbar>
                    <TooltipButton
                        className={classes.menuButton}
                        ariaLabel='menu'
                        children={<MenuIcon />}
                    />
                </Toolbar>
            </AppBar>
        </div>
    )
}
