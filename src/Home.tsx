/** @format */

import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import UploadZone from './components/Upload/UploadZone'
import FFmpegContext from './components/FFmpeg/FFmpegContext'

const UploadProgress = withStyles((theme) => ({
    root: {},
    colorPrimary: {
        color: theme.palette.primary.main,
    },
}))(CircularProgress)

export default function Home() {
    const {
        doTranscode,
        message,
        outputSrc,
        inputFile,
        inputMetadata,
        inputSrc,
    } = useContext(FFmpegContext)

    return (
        <div style={{ textAlign: 'center' }}>
            {inputFile ? (
                inputMetadata.length === 0 ? (
                    <UploadProgress color='primary' />
                ) : inputSrc ? (
                    <>
                        <video src={inputSrc} controls></video>
                        {inputMetadata[1] && <p>Loaded ok!</p>}
                    </>
                ) : (
                    <p>Error Loading Video!</p>
                )
            ) : (
                <UploadZone />
            )}
            <p />
            <video src={outputSrc} controls></video>
            <br />
            <button onClick={doTranscode}>Start</button>
            <p>{message}</p>
        </div>
    )
}
