/** @format */

import React from 'react'
import Home from './Home'
import useFFmpeg from './components/FFmpeg/useFFmpeg'
import FFmpegContext from './components/FFmpeg/FFmpegContext'
import { ThemeProvider } from '@material-ui/core'
import theme from './styles/theme'
import GlobalStyles from './styles/GlobalStyles'

export default function App() {
    const ffmpeg = useFFmpeg()

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <FFmpegContext.Provider value={ffmpeg}>
                <Home />
            </FFmpegContext.Provider>
        </ThemeProvider>
    )
}
