/** @format */

import React, { useContext, useState } from 'react'
import { withStyles } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import UploadZone from './components/Upload/UploadZone'
import VideoPlayerContext from './components/VideoPlayer/VideoPlayerContext'
import TopBar from './components/TopBar/TopBar'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import TooltipButton from './components/Common/TooltipButton'
import GetAppIcon from '@material-ui/icons/GetApp'
import TrimUI from './components/TrimUI/TrimUI'
import axios from 'axios'

const UploadProgress = withStyles((theme) => ({
    root: {},
    colorPrimary: {
        color: theme.palette.primary.main,
    },
}))(CircularProgress)

export default function Home() {
    const { inputFile, inputMetadata } = useContext(VideoPlayerContext)
    const [fileName, setFileName] = useState<string>('')

    function upload() {
        const formData = new FormData()
        if (inputFile) {
            formData.append('file', inputFile)
            axios
                .post('/api/upload', formData)
                .then((res) => {
                    console.log('res.data.fileName', res.data.fileName)
                    setFileName(res.data.fileName)
                })
                .catch((err) => console.warn(err))
        }
    }

    return (
        <div
            style={{
                height: '100%',
                backgroundColor: 'rgb(58, 59, 70)',
                width: '100%',
                margin: '0px',
            }}
        >
            <TopBar />
            {inputFile ? (
                inputMetadata.length === 0 ? (
                    <UploadProgress color='primary' size={100} />
                ) : (
                    <TrimUI />
                )
            ) : (
                <UploadZone />
            )}
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
