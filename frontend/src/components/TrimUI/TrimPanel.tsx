/** @format */

import React, { useContext, useRef } from 'react'
import { Moment } from 'moment'
import {
    Card,
    CardContent,
    CardHeader,
    withStyles,
    Typography,
} from '@material-ui/core'
import TrimmingContext from './TrimmingContext'
import TrimSlider from './TrimSlider'
import SeekbarSlider from '../ControlBar/SeekbarSlider'
import VideoPlayerContext from '../VideoPlayer/VideoPlayerContext'

const Header = withStyles((theme) => ({
    root: {
        fontWeight: 'bold',
        width: '100%',
        padding: 0,
        color: 'white',
        marginBottom: 10,
    },
}))(Typography)

interface ITrimPanel {}

export default function TrimPanel({}: ITrimPanel) {
    const { updateInterval, deleteInterval } = useContext(TrimmingContext)
    const { duration, currentTime, onSeek: videoOnSeek } = useContext(
        VideoPlayerContext
    )
    const seekbarRef = useRef<HTMLSpanElement>({} as HTMLSpanElement)

    function setTrimTimes(
        start: number | Moment,
        end: number | Moment,
        id: string = ''
    ) {
        updateInterval(id, start, end)
    }

    function onSeek(newProgress: number) {
        videoOnSeek(newProgress * duration)
    }

    return (
        <Card
            style={{
                height: 'auto',
                paddingBottom: 20,
                backgroundColor: 'rgb(63, 62, 143)',
            }}
        >
            <CardContent
                style={{
                    marginLeft: 20,
                    padding: 0,
                    marginRight: 20,
                }}
            >
                <CardHeader
                    title={'Trim Video'}
                    component={Header}
                    style={{ fontSize: 20 }}
                />
                <Typography style={{ color: 'white' }}>
                    Something about whatever it is this does.
                </Typography>
                <SeekbarSlider
                    ref={seekbarRef}
                    onSeek={onSeek}
                    currentTime={currentTime()}
                    duration={duration}
                />
                <TrimSlider
                    setTrimTimes={setTrimTimes}
                    maxTimeSeconds={duration}
                    minTimeSeconds={0}
                    deleteInterval={deleteInterval}
                />
            </CardContent>
        </Card>
    )
}
