/** @format */

import React, { useContext } from 'react'
import Dropzone from 'react-dropzone'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core'
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons'
import VideoPlayerContext from '../VideoPlayer/VideoPlayerContext'

const DropZonePaper = withStyles((theme) => ({
    root: {
        padding: 16,
        backgroundColor: 'white',
        mozBoxShadow: 'inset 0 0 10px #9c9c9c',
        webkitBoxShadow: 'inset 0 0 10px #9c9c9c',
        boxShadow: 'inset 0 0 3px 3px #9c9c9c',
        color: 'black',
    },
}))(Paper)

/**
 * Functional Component for rendering Upload Zone
 *
 * @format
 * @param {object} props - RFF Field props
 * @param {object} form - form handler, can manipulate or read values
 * @param {object} values - form values, read only
 */

export default function UploadZone() {
    const { uploadFile } = useContext(VideoPlayerContext)

    async function onDrop(files: Array<File>) {
        // do not allow multiple file uploads
        if (files.length == 1) {
            const file = files[0]
            uploadFile(file)
        }
    }

    return (
        <Dropzone onDrop={onDrop} accept={'video/mp4'}>
            {({ getRootProps, getInputProps }) => (
                <div>
                    <DropZonePaper
                        {...getRootProps()}
                        square={false}
                        elevation={0}
                    >
                        <input {...getInputProps()} />
                        <div>
                            <strong>
                                Click The Cloud Icon to Open a File Browser or
                                Drag and Drop a Video Here
                            </strong>
                            <br />
                            <CloudUploadIcon
                                style={{
                                    fontSize: '5em',
                                }}
                            />
                        </div>
                    </DropZonePaper>
                </div>
            )}
        </Dropzone>
    )
}
