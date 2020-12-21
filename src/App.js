/** @format */

import React from 'react'
import Home from './Home'
import useFFmpeg from './useFFmpeg'
import FFmpegContext from './FFmpegContext'

function App() {
    const ffmpeg = useFFmpeg()

    return (
        <FFmpegContext.Provider value={ffmpeg}>
            <Home />
        </FFmpegContext.Provider>
    )
}

export default App
