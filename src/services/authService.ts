import { UserManager } from 'oidc-client';

const { VITE_OAUTH_CLIENT_ID, VITE_GOOGLE_LOGIN_REDIRECT, VITE_AUTHORITY_URL } =
  import.meta.env;
const oidcConfig = {
  authority: VITE_AUTHORITY_URL,
  client_id: VITE_OAUTH_CLIENT_ID,
  redirect_uri: `${VITE_GOOGLE_LOGIN_REDIRECT}/callback`,
  response_type: 'id_token token',
  scope: 'email openid profile',
  popup_post_logout_redirect_uri: VITE_GOOGLE_LOGIN_REDIRECT,
};

const userManager = new UserManager(oidcConfig);

export { userManager };
