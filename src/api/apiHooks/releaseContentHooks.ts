import { QueryKeys } from 'common/constants';
import { IReleaseContent } from 'models/request';
import { useGetOne } from '.';

export const useReleaseContent = () => {
  return useGetOne<IReleaseContent[]>(
    [QueryKeys.GET_RELEASE_CONTENT],
    '/app/external-resource/github-release-content'
  );
};
