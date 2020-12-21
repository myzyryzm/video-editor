/** @format */

import React, { useContext } from 'react'
import UploadZone from './components/UploadZone'
import FFmpegContext from './ffmpeg/FFmpegContext'

function Home() {
    const { doTranscode, message, videoSrc } = useContext(FFmpegContext)

    return (
        <div style={{ textAlign: 'center' }}>
            <UploadZone />
            <p />
            <video src={videoSrc} controls></video>
            <br />
            <button onClick={doTranscode}>Start</button>
            <p>{message}</p>
        </div>
    )
}

export default Home
