/** @format */

export interface FFmpegHook {
    doTranscode: () => Promise<void>
    outputSrc: string
    uploadFile: (file: File) => void
    message: string
    inputFile: File | undefined
    resetUpload: () => void
    inputSrc: string
    inputMetadata: Array<any>
}
