/** @format */

import { useState } from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

export default function useFFmpeg() {
    const [uploadedFile, setUploadedFile] = useState('')
    const [uploadAlert, setUploadAlert] = useState('')
    const [videoSrc, setVideoSrc] = useState('')
    const [message, setMessage] = useState('Click Start to transcode')
    const ffmpeg = createFFmpeg({
        log: true,
    })

    const doTranscode = async () => {
        setMessage('Loading ffmpeg-core.js')
        await ffmpeg.load()
        setMessage('Start transcoding')
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(uploadedFile))
        await ffmpeg.run(
            '-i',
            'input.mp4',
            '-c:v',
            'libx264',
            '-b:v',
            '0.8M',
            'output.mp4'
        )
        setMessage('Complete transcoding')
        const data = ffmpeg.FS('readFile', 'output.mp4')
        setVideoSrc(
            URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
        )
    }

    return {
        doTranscode,
        videoSrc,
        setUploadedFile,
        setUploadAlert,
        message,
    }
}
