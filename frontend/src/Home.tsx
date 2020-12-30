/** @format */

import React, { useContext, useState } from 'react'
import { withStyles } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import UploadZone from './components/Upload/UploadZone'
import FFmpegContext from './components/FFmpeg/FFmpegContext'
import TopBar from './components/TopBar/TopBar'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import TooltipButton from './components/Common/TooltipButton'
import GetAppIcon from '@material-ui/icons/GetApp'
import axios from 'axios'

const UploadProgress = withStyles((theme) => ({
    root: {},
    colorPrimary: {
        color: theme.palette.primary.main,
    },
}))(CircularProgress)

export default function Home() {
    const [fileName, setFileName] = useState<string>('')
    const {
        doTranscode,
        message,
        outputSrc,
        inputFile,
        inputMetadata,
        inputSrc,
    } = useContext(FFmpegContext)

    function upload() {
        const formData = new FormData()
        if (inputFile) {
            inputFile.arrayBuffer
            formData.append('file', inputFile)

            axios
                .post('/api/upload', formData)
                .then((res) => {
                    // console.log(typeof res.data)
                    // const url = URL.createObjectURL(res.data)
                    // console.log('RAN IT LOL')
                    // const url = URL.createObjectURL(new Blob([res.data]))
                    // console.log(url)
                    console.log('res.data.fileName', res.data.fileName)
                    setFileName(res.data.fileName)
                })
                .catch((err) => console.warn(err))
        }
    }

    return (
        <div>
            <TopBar />
            {inputFile ? (
                inputMetadata.length === 0 ? (
                    <UploadProgress color='primary' size={100} />
                ) : inputSrc ? (
                    <>
                        <video src={inputSrc} controls></video>
                        <br />
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
            <Button onClick={upload} variant='contained' color='primary'>
                Upload
            </Button>
            {fileName && (
                <Link
                    href={`/uploads/${fileName}`}
                    target='_blank'
                    rel='noopener'
                >
                    <TooltipButton
                        ariaLabel='download'
                        tooltipPosition='top'
                        children={<GetAppIcon color='secondary' />}
                    />
                </Link>
            )}
        </div>
    )
}
