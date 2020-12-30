import boto3
from botocore.client import ClientError
import subprocess
import os, sys
thispath = os.path.dirname(os.path.abspath(__file__))

s3 = boto3.client('s3')
s3_resource = boto3.resource('s3')

def s3_download_folder(bucket: str, key: str, localpath: str):
    s3_bkt = s3_resource.Bucket(bucket)
    key = key if key[-1] =='/' else f'{key}/'
    for obj in s3_bkt.objects.filter(Prefix = key):
        filename = obj.key.split('/')[-1]
        full_path = f'{localpath}/{filename}'
        full_key=f'{key}{filename}'
        s3_download_file(bucket, full_key, full_path)
        
def s3_download_file(bucket: str, key: str, localpath: str):
    try:
       resp = s3.download_file(bucket, key, localpath)
       return 200
    except:
        print(f'unable to download {localpath} to {bucket}/{key}') 
        return 400

def s3_upload_folder(bucket: str, key: str, localpath: str):
    files = [os.path.join(localpath, ff) for ff in os.listdir(localpath)]
    for file in files:
        filename = os.path.basename(file)
        full_key = f'{key}/{filename}'
        s3_upload_file(bucket, full_key, file)

def s3_upload_file(bucket: str, key: str, localpath: str):
    try:
       resp = s3.upload_file(localpath, bucket, key)
       print(f'uploaded {localpath} to {bucket}/{key}')
       return 200
    except:
        print(f'unable to upload {localpath} to {bucket}/{key}') 
        return 400

def subprocess_check_output(args, kwargs={}, assert_hard=False, printcmd:bool=True):
    assert isinstance(args,list) or isinstance(args,tuple), str(type(args))
    failed = False
    if 'stderr' not in kwargs:
        kwargs['stderr'] = subprocess.STDOUT
    args = [str(arg) for arg in args]
    if printcmd:
        print("running: \'"+str(' '.join(args))+"\'")
    
    try:
        ret = subprocess.check_output(args, **kwargs) # return code would always be zero, would fail otherwise
        print('ret')
        print(ret)
    except subprocess.CalledProcessError as eee:
        mymsg = "failed command:\n"+str(args)+"\n" \
               +str(eee.output.decode('utf-8'))
        if assert_hard:
            assert 0, mymsg
        ret = "WARNING: subprocess_check_output: "+mymsg
        # print(ret)
        #raise subprocess.CalledProcessError
        failed = True
    
    if isinstance(ret,bytes):
        ret = ret.decode('utf-8')
    return ret, failed

def subprocess_call(args, kwargs={}, assert_hard=False):
    assert isinstance(args,list) or isinstance(args,tuple), str(type(args))
    args = [str(arg) for arg in args]
    print("running: \'"+str(' '.join(args))+'\'')
    ccode = subprocess.call(args, **kwargs)
    if ccode != 0:
        prstr = "warning: return value "+str(ccode)+" != 0 from command\n"+str(args)+"\n"
        if assert_hard:
            assert 0, prstr
        else:
            print(prstr)
    return ccode

def fstr(val:float):
    return str(round(val,3))

def file_exist_check(location: str):
    """
    Check if a file exists on the system. If so return the location.
    Otherwise assert.
    """
    loc_abs = os.path.abspath(location)
    assert os.path.exists(loc_abs), '%s does not exist on the filesystem!' % loc_abs
    return loc_abs

def make_directory(location: str):
    """
    Make a directory if it does not exist
    """
    if not os.path.exists(location):
        os.makedirs(location)
    return

def get_file_name(file_path: str) -> str:
    """
    Get the file name given the file path.
    """
    return file_path.split('/')[-1]  # os.path.basename(file_path)

def append_slash(to_append: str) -> str:
    if to_append[-1] == '/':
        return to_append
    return to_append + '/'

def append_postfix(media_file_path: str, post_fix: str) -> str:
    """
    Appends a postfix string before the extension.
    """
    return '.'.join([media_file_path.split('.')[0] + post_fix, media_file_path.split('.')[1]])
