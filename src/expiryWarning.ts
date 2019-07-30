import moment from 'moment';
import { promisify } from 'util';
import { resolve, sep } from 'path';
import fs from 'fs';
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

import {
  DEFAULT_RECORDING_DIR,
  DEFAULT_EXPIRATION_DAYS,
  DEFAULT_DAYS_FOR_EXPIRY_WARNING,
  COLORS,
} from './constants';

// TYPES
interface recordingFile {
  name: string,
  status: string,
}

// CONSTANTS
const DAYS_TO_WARN: number = process.env.POLLY_DAYS_TO_WARN ? parseInt(process.env.POLLY_DAYS_TO_WARN, 10) : DEFAULT_DAYS_FOR_EXPIRY_WARNING;
const DAYS_EXPIRY: number = process.env.POLLY_DAYS_EXPIRY ? parseInt(process.env.POLLY_DAYS_EXPIRY, 10) : DEFAULT_EXPIRATION_DAYS;
const RECORDINGS_FOLDER: string = process.env.POLLY_RECORDINGS_FOLDER || DEFAULT_RECORDING_DIR;
const STATES = {
  EXPIRED: `${COLORS.RED}Expired${COLORS.DEFAULT}`,
  ALMOST_EXPIRED: `${COLORS.YELLOW}Expires in less than ${DEFAULT_DAYS_FOR_EXPIRY_WARNING} days${COLORS.DEFAULT}`,
};

// Get all expired or soon to be expired recordings
export async function getFiles(dir: string, fileList: recordingFile[] = []) {
  let subDirectories;
  let currentFileList = fileList;
  try {
    subDirectories = await readdir(dir);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[Polly Jest Preset] Recordings folder "${dir}" not found`);
    return [];
  }
  await Promise.all(subDirectories.map(async (directory: string) => {
    const absolutePath = resolve(dir, directory);
    if ((await stat(absolutePath)).isDirectory()) {
      currentFileList = await getFiles(absolutePath, fileList)
    } else {
      if (absolutePath.endsWith('.har')) {
        const expiredStatus = isExpired(absolutePath);
        if (expiredStatus) {
          const readableName = absolutePath.split(sep).slice(-2, -1)[0];
          currentFileList.push({ name: readableName, status: expiredStatus });
        }
      }
    }
  }));
  return currentFileList;
}

// Determine if recording is expired or will expire soon
export function isExpired(filePath: string) {
  const recording = fs.readFileSync(filePath);
  const jsonRecording = JSON.parse(recording.toString());
  const startDate = moment(jsonRecording.log.entries[0].startedDateTime);
  const todayDate = moment();
  if (todayDate.diff(startDate, 'days') > DAYS_EXPIRY) {
    return STATES.EXPIRED;
  } else if (todayDate.diff(startDate, 'days') > DAYS_EXPIRY - DAYS_TO_WARN) {
    return STATES.ALMOST_EXPIRED;
  }
  return false;
}

// Report warning in console
function reportWarning(files: recordingFile[]) {
  if (files.length > 0) {
    let fileList: string = '';
    files.forEach((file: recordingFile) => { fileList += `    * ${file.status}: ${file.name}\n`});
    // eslint-disable-next-line no-console
    console.warn(
      `\n${COLORS.RED}#########################  WARNING  ########################\n
      ${COLORS.DEFAULT}The following Polly recordings expired/will expire soon!
      Consider re-recording them now to avoid being blocked from merging.\n\n${fileList}\n${COLORS.DEFAULT}`);
  }
}

getFiles(RECORDINGS_FOLDER).then(files => reportWarning(files));