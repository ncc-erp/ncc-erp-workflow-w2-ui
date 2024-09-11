import { QueryKeys } from 'common/constants';
import { useCreate, useDelete, useGetList, useUpdate } from '.';
import {
  FilterSettingParams,
  ISetting,
  ISettingPayload,
} from 'models/settings';

export const useGetSettingList = (
  FilterSettingParams?: FilterSettingParams
) => {
  return useGetList<ISetting>(
    [QueryKeys.GET_SETTING_LIST, FilterSettingParams],
    'app/setting/w2setting-list',
    FilterSettingParams
  );
};

export const useCreateSetting = () => {
  return useCreate<ISettingPayload, ISetting>(
    'app/setting/new-w2setting-value'
  );
};
export const useUpdateSetting = (setting: ISettingPayload) => {
  return useUpdate<undefined, ISettingPayload, ISetting>(
    'app/setting/w2setting-value',
    undefined,
    setting
  );
};

export const useDeleteSetting = () => {
  return useDelete('app/setting/w2setting-value', true);
};
