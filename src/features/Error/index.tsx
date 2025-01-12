import { LocalStorageKeys } from 'common/enums';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { removeItem } from 'utils';

const Error = () => {
  // 401. clear, logout
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  console.log('searchParams', searchParams);
  
  // httpStatusCode
  if (searchParams.get('httpStatusCode') == '401' ) {
    removeItem(LocalStorageKeys.accessToken);
    navigate('/login')
  }
  
  return (<></>);
};

export default Error;
