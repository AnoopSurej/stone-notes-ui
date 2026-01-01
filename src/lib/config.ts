export const config = {
  apiUrl: import.meta.env.VITE_STONE_NOTES_API_URL,
};

export const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: window.location.origin,
  response_type: import.meta.env.VITE_OIDC_RESPONSE_TYPE,
  scope: import.meta.env.VITE_OIDC_SCOPE,
  automaticSilentRenew: true,
  monitorSession: true,
  post_logout_redirect_uri: window.location.origin + "/signedout",
  onSigninCallback: () => {
    const returnUrl = sessionStorage.getItem('returnUrl');

    if (returnUrl) {
      sessionStorage.removeItem('returnUrl');
      window.location.replace(returnUrl);
    } else {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  },
};