/** @format */

import { useState } from 'react'
import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg'
import MediaInfo from 'mediainfo.js'
import { FFmpegHook } from './commonRequirements'

export default function useFFmpeg(): FFmpegHook {
    const ffmpeg: FFmpeg = createFFmpeg({
        logger: log,
    })
    const [inputFile, setInputFile] = useState<File | undefined>()
    const [inputMetadata, setInputMetadata] = useState<Array<any>>([])
    const [inputSrc, setInputSrc] = useState<string>('')
    const [outputSrc, setOutputSrc] = useState<string>('')
    const [message, setMessage] = useState<string>('Click Start to Compress')

    const doTranscode = async () => {
        if (inputFile) {
            setMessage('Loading ffmpeg-core.js')
            await ffmpeg.load()
            setMessage('Start compression')
            ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(inputFile))
            await ffmpeg.run(
                '-i',
                'input.mp4',
                '-c:v',
                'libx264',
                '-b:v',
                '0.8M',
                'output.mp4'
            )
            setMessage('Complete compression')
            const data = ffmpeg.FS('readFile', 'output.mp4')
            console.log('data', typeof data, data)
            setOutputSrc(
                URL.createObjectURL(
                    new Blob([data.buffer], { type: 'video/mp4' })
                )
            )
        }
    }

    function log({ type, message }: { type: string; message: string }) {
        console.log(message)
    }

    async function uploadFile(file: File) {
        setInputFile(file)
        setInputSrc(URL.createObjectURL(file))
        let mediainfo
        let videoMetaData: Array<any> = [false, false, false]
        try {
            mediainfo = await MediaInfo({ format: 'object' })
            const getSize = () => file.size
            const readChunk = (chunkSize, offset) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                        if (event.target) {
                            if (event.target.error) {
                                reject(event.target.error)
                            }
                            const result = event.target.result
                            if (result && typeof result !== 'string') {
                                resolve(new Uint8Array(result))
                            }
                        }
                    }
                    reader.readAsArrayBuffer(
                        file.slice(offset, offset + chunkSize)
                    )
                })
            videoMetaData = await mediainfo
                .analyzeData(getSize, readChunk)
                .then((data) => data.media.track)
            setInputMetadata(videoMetaData)
            console.log('videoMetadata', videoMetaData)
        } catch (error) {
            console.error(error)
        } finally {
            mediainfo && mediainfo.close()
        }
        // setInputMetadata([true, true, true])
    }

    function resetUpload() {
        setInputFile(undefined)
        setInputSrc('')
    }

    return {
        doTranscode,
        outputSrc,
        uploadFile,
        message,
        inputFile,
        resetUpload,
        inputSrc,
        inputMetadata,
    }
}
