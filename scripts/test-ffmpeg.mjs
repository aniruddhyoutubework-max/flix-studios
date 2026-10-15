import ffmpeg from '@ffmpeg-installer/ffmpeg';
import cp from 'child_process';

console.log('FFmpeg Path:', ffmpeg.path);
const out = cp.execSync(`"${ffmpeg.path}" -version`).toString();
console.log(out.split('\n')[0]);
