/** @format */

import React from 'react'
import Home from './Home'
import useFFmpeg from './components/FFmpeg/useFFmpeg'
import FFmpegContext from './components/FFmpeg/FFmpegContext'
import useVideoPlayer from './components/VideoPlayer/useVideoPlayer'
import VideoPlayerContext from './components/VideoPlayer/VideoPlayerContext'
import { ThemeProvider } from '@material-ui/core'
import theme from './styles/theme'
import GlobalStyles from './styles/GlobalStyles'

export default function App() {
    const ffmpeg = useFFmpeg()
    const videoPlayer = useVideoPlayer()

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <FFmpegContext.Provider value={ffmpeg}>
                <VideoPlayerContext.Provider value={videoPlayer}>
                    <Home />
                </VideoPlayerContext.Provider>
            </FFmpegContext.Provider>
        </ThemeProvider>
    )
}
