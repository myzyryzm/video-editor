import subprocess
import argparse
import os
import pathlib
from utils import subprocess_check_output
from natsort import natsorted
from ffmpeg_utils import split_video, combine_videos

thispath = os.path.dirname(os.path.abspath(__file__))

parser = argparse.ArgumentParser()
parser.add_argument('--video', type=str, required=True, help='video to split')

args = parser.parse_args()
video = args.video

basename = os.path.split(video)[-1]
extension = ''.join(pathlib.Path(basename).suffixes)
videoname = basename.split('.')[0]

folder_path = os.path.join(thispath, 'temp', videoname)
output_folder = os.path.join(folder_path, 'output')
output_path = os.path.join(output_folder, f'output{extension}')
try:
    os.mkdir(folder_path)
except:
    pass
try:
    os.mkdir(output_folder)
except:
    pass
splits = [
    {
        'start': 0,
        'duration': 5
    },
    {
        'start': 17,
        'duration': 3
    },
]

ret, failed = split_video(video, folder_path, splits)
if failed is True:
    print('failed to split videos!')
    quit(400)

ret, failed = combine_videos(output_path, folder_path)
if failed is True:
    print('failed to combine videos!')
    quit(400)