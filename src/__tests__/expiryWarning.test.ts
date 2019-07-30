import { resolve } from 'path';
import { isExpired, getFiles } from '../expiryWarning';
import {
  COLORS,
} from '../constants';

const RECORDINGS_FOLDER = resolve(__dirname, '.polly_recordings');
const EXPIRED = `${COLORS.RED}Expired${COLORS.DEFAULT}`;
const ALMOST_EXPIRED = `${COLORS.YELLOW}Expires in less than 3 days${COLORS.DEFAULT}`;

Date.now = () => {
  // Returns epoch time for 07/30/2019
  return 1564510668197;
};

describe('expiryWarning', () => {
  describe('isExpired', () => {
    it('returns expired if recording is expired', () => {
      expect(isExpired(`${RECORDINGS_FOLDER}/expired_test_suite/this_is_expired/recording.har`))
        .toEqual(EXPIRED);
    });
    it('returns almost expired if recording will be expired within 3 days', () => {
      expect(isExpired(`${RECORDINGS_FOLDER}/this_is_almost_expired/recording.har`))
        .toEqual(ALMOST_EXPIRED);
    });
    it('returns false if recording is not expired', () => {
      expect(isExpired(`${RECORDINGS_FOLDER}/this_is_not_expired/recording.har`))
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
      expect(await getFiles(RECORDINGS_FOLDER)).toMatchObject(expectedFiles);
    });
  });
});
