/** @format */

import { createContext } from 'react'
import { VideoPlayerHook } from './commonRequirements'

const VideoPlayerContext = createContext<VideoPlayerHook>({} as VideoPlayerHook)
export default VideoPlayerContext
