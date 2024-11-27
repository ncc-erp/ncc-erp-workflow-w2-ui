import { QueryKeys } from 'common/constants';
import { useFetchGithubReleasePage } from '.';
import { IReleaseContent } from 'models/request';

export const useReleaseContent = () => {
  return useFetchGithubReleasePage<IReleaseContent[]>([
    QueryKeys.GET_RELEASE_CONTENT,
  ]);
};
