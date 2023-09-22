import { Box } from '@chakra-ui/react';
import { FilterAll } from 'common/constants';
import { useMemo } from 'react';
import Select, { SingleValue } from 'react-select';
import { useUserIdentity } from 'api/apiHooks/userIdentityHooks';
import { FilterUserParams } from 'models/userIdentity';
import { UserSortField } from 'common/enums';
import { FilterTasks } from 'models/task';

const initialFilterUser: FilterUserParams = {
  filter: '',
  maxResultCount: 1000, //FIXME: Currently getting 1000 users
  skipCount: 0,
  sorting: [UserSortField.userName, 'asc'].join(' '),
};

interface Props {
  filter: FilterTasks;
  onChange: (
    e: SingleValue<{
      value: string | undefined;
      label: string;
    }>
  ) => void;
}

export const MenuUser = ({ filter, onChange }: Props) => {
  const { data: listUser } = useUserIdentity(initialFilterUser);

  const userOptions = useMemo(() => {
    const defaultOptions = {
      value: '',
      label: FilterAll.USER,
    };

    const options =
      listUser?.items?.map(({ email }) => ({
        value: email,
        label: email,
      })) ?? [];

    return [defaultOptions, ...options];
  }, [listUser]);

  return (
    <Box w={'300px'}>
      <Select
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            borderRadius: '0.375rem',
            borderColor: 'inherit',
            paddingBottom: 1,
            fontSize: 14,
          }),
        }}
        value={{
          value: filter.email,
          label: filter.email || FilterAll.USER,
        }}
        options={userOptions}
        onChange={onChange}
      />
    </Box>
  );
};
