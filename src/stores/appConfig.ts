import { atom, useSetRecoilState } from 'recoil';
import { useCallback } from 'react';
import { AppConfig } from 'models/appConfig';

const initialState: AppConfig = {
  openSideBar: false,
};

export const appConfigState = atom({
  key: 'appConfigState',
  default: initialState,
});

export const useSetAppConfig = () => {
  const setAppConfig = useSetRecoilState(appConfigState);

  const onCloseSideBar = useCallback(
    () => setAppConfig((appConfig) => ({ ...appConfig, openSideBar: false })),
    [setAppConfig]
  );

  const onOpenSideBar = useCallback(
    () => setAppConfig((appConfig) => ({ ...appConfig, openSideBar: true })),
    [setAppConfig]
  );

  return {
    onCloseSideBar,
    onOpenSideBar,
  };
};
