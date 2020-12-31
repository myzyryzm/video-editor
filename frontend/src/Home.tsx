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
import Grid from '@material-ui/core/Grid'
import VideoPlayer from './components/VideoPlayer/VideoPlayer'
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
        <div>
            <TopBar />
            {inputFile ? (
                inputMetadata.length === 0 ? (
                    <UploadProgress color='primary' size={100} />
                ) : (
                    <Grid
                        item
                        xs={9}
                        children={
                            <VideoPlayer
                                styles={{
                                    midWrapper: {
                                        position: 'relative',
                                        zIndex: 1,
                                        background: 'transparent',
                                    },
                                    innerWrapper: {
                                        flexDirection: 'column',
                                    },
                                    video: {
                                        height: 'auto',
                                        width: '100%',
                                        position: 'relative',
                                    },
                                    controlBar: {
                                        height: 70,
                                        maxHeight: 70,
                                        position: 'relative',
                                    },
                                }}
                                dynamicHeights={false}
                                enableFullScreen={false}
                                enableTracking={false}
                                fadeControlBar={false}
                            />
                        }
                        style={{ margin: 'auto', marginTop: 0 }}
                    />
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
