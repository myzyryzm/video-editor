import os
import pathlib
from utils import subprocess_check_output
from natsort import natsorted

def split_video(video_path, folder_path, splits):
    """
    video_path => full path to video \n
    folder_path => full path to folder \n
    splits => array of dictionaries containing keys of start and duration which are used for splitting
    """
    basename = os.path.split(video_path)[-1]
    extension = ''.join(pathlib.Path(basename).suffixes)
    videoname = basename.split('.')[0]
    
    split_video = ['ffmpeg', '-nostdin', '-y', '-i', video_path]
    for i, split in enumerate(splits):
        file_name = f'{videoname}-{i}{extension}'
        file_path = os.path.join(folder_path, file_name)
        split_video += ['-ss', split['start'], '-t', split['duration'], '-codec', 'copy', file_path]
    ret, failed = subprocess_check_output(split_video)
    outputpath = os.path.join(folder_path, f'output{extension}')
    ret, failed = subprocess_check_output(split_video)
    return ret, failed

def combine_videos(output_path, folder_path):
    files = []
    for file in os.listdir(folder_path):
        file_name = os.path.join(folder_path, file)
        extension = ''.join(pathlib.Path(file_name).suffixes)
        if 'mp4' in extension:
            files.append(os.path.join(folder_path, file))
    files = natsorted(files)
    print(files)
    ffmpeg_txt = os.path.join(folder_path, 'ffmpeg_split.txt')
    with open(ffmpeg_txt, 'w') as tf:
        for file in files:
            tf.write(f'file {file}\n')

    join_videos = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', ffmpeg_txt, '-c', 'copy', output_path]
    ret, failed = subprocess_check_output(join_videos)
    return ret, failed