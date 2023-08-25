import { useEffect } from 'react';
import { userManager } from 'services/authService';

const LoginCallback = () => {
  useEffect(() => {
    userManager.signinPopupCallback();
  }, []);

  return <></>;
};

export default LoginCallback;
