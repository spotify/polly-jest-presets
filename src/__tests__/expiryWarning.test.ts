import { resolve } from 'path';
import { getExpiredState, getFiles } from '../expiryWarning';
import {
  COLORS,
} from '../constants';

const RECORDINGS_DIR = resolve(__dirname, '.polly_recordings');
const EXPIRED = `${COLORS.RED}Expired${COLORS.DEFAULT}`;
const ALMOST_EXPIRED = `${COLORS.YELLOW}Expires in less than 3 days${COLORS.DEFAULT}`;

// Set timezone to US/NYC & set current date to 07/30/2019
process.env.TZ = 'America/New_York';
Date.now = () => {
  return 1564510668197;
};

describe('expiryWarning', () => {
  describe('getExpiredState', () => {
    it('returns expired if recording is expired', () => {
      expect(getExpiredState(`${RECORDINGS_DIR}/expired_test_suite/this_is_expired/recording.har`))
        .toEqual(EXPIRED);
    });
    it('returns almost expired if recording will be expired within 3 days', () => {
      expect(getExpiredState(`${RECORDINGS_DIR}/this_is_almost_expired/recording.har`))
        .toEqual(ALMOST_EXPIRED);
    });
    it('returns false if recording is not expired', () => {
      expect(getExpiredState(`${RECORDINGS_DIR}/this_is_not_expired/recording.har`))
        .toEqual(false);
    });
  });

  describe('getFiles', () => {
    it('returns object with file ids and their statuses', async () => {
      const expectedFiles = [{
        "name": "this_is_almost_expired",
        "status": ALMOST_EXPIRED,
      },
      {
        "name": "this_is_expired",
        "status": EXPIRED,
      }];
      expect(await getFiles(RECORDINGS_DIR)).toMatchObject(expectedFiles);
    });
  });
});
