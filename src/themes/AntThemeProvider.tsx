import { useColorModeValue } from '@chakra-ui/react';
import { ConfigProvider } from 'antd';
import { PropsWithChildren } from 'react';
import theme from './theme';

export const AntThemeProvider = ({ children }: PropsWithChildren) => {
  const colors = useColorModeValue(
    {
      colorText: theme.colors.stone['700'],
    },
    {
      colorText: theme.colors.stone['300'],
    }
  );

  const treeColors = useColorModeValue(
    {
      nodeSelectedBg: theme.colors.gray['100'],
    },
    { nodeSelectedBg: theme.colors.stone['900'] }
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: 'transparent',
          colorText: colors.colorText,
        },
        components: {
          Tree: {
            nodeSelectedBg: treeColors.nodeSelectedBg,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
