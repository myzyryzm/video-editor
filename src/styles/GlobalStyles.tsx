/** @format */

import { createStyles, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() =>
    createStyles({
        '@global': {
            '*': {
                boxSizing: 'border-box',
                margin: 0,
                padding: 0,
            },
            html: {
                '-webkit-font-smoothing': 'antialiased',
                '-moz-osx-font-smoothing': 'grayscale',
                height: '100%',
                width: '100%',
            },
            body: {
                margin: 0,
                backgroundColor: '#f4f6f8',
                height: '100%',
                width: '100%',
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            },
            a: {
                textDecoration: 'none',
            },
            '#root': {
                height: '100%',
                width: '100%',
            },
        },
    })
)

export default function GlobalStyles() {
    useStyles()
    return null
}
