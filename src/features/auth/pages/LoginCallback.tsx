import React, { useEffect } from 'react';
import { userManager } from 'services/authService';

function LoginCallback() {
  useEffect(() => {
    userManager.signinRedirectCallback().then(() => {
      window.location.href = '/';
    });
  }, []);

  return (
    <div>
      <p>Đang xử lý...</p>
    </div>
  );
}

export default LoginCallback;
