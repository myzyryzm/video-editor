/** @format */

import { createMuiTheme, colors } from '@material-ui/core'

const theme = createMuiTheme({
    palette: {
        //purple (15)
        primary: {
            main: '#6c00fc',
            dark: '#3e008f',
        },
        // gold (15)
        secondary: {
            main: '#FFD300',
            dark: '#d3af00',
        },
        // red (75)
        error: {
            main: '#fe004c',
            dark: '#bd0039',
        },
        //indigo/blue
        info: {
            main: '#3c00fc',
            dark: '#230191',
        },
        text: {
            primary: colors.common.white,
            secondary: '#ffe800', //yellow (15)
        },
        background: {
            default: '#404040',
            paper: colors.common.white,
        },
    },
})
// https://paletton.com/#uid=74e0f0k++ZNqYZWBv+V+V-RZXqx
export default theme
