import { RedirectCodeClient } from "./client/code-client";
import { CLIENT_ID, SCOPES } from "./key";

export const initClient = () => {
  return new RedirectCodeClient({
    clientId: CLIENT_ID,
    scope: SCOPES,
    redirectUri: location.origin,
  });
};
