/** @format */

import React from 'react'
import Home from './Home'
import useFFmpeg from './ffmpeg/useFFmpeg'
import FFmpegContext from './ffmpeg/FFmpegContext'

function App() {
    const ffmpeg = useFFmpeg()

    return (
        <FFmpegContext.Provider value={ffmpeg}>
            <Home />
        </FFmpegContext.Provider>
    )
}

export default App
