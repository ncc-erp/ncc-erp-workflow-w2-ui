import axios from 'api/axiosInstant';
import { useMemo } from 'react';
import { AxiosContext } from 'api/axiosInstant';

const AxiosProvider = ({ children }: React.PropsWithChildren<unknown>) => {
	const axiosValue = useMemo(() => {
		return axios;
	}, []);

	return (
		<AxiosContext.Provider value={axiosValue}>{children}</AxiosContext.Provider>
	);
};

export default AxiosProvider;
