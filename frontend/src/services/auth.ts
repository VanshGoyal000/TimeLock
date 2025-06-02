import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const getNetwork = (networkName: string) => {
  return networkName === 'mainnet' 
    ? new StacksMainnet() 
    : new StacksTestnet();
};

export const authenticate = () => {
  showConnect({
    appDetails: {
      name: 'TimeLock Vault',
      icon: window.location.origin + '/logo.png',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
};

export const getUserData = () => {
  if (userSession.isUserSignedIn()) {
    return userSession.loadUserData();
  }
  return null;
};

export const logUserOut = () => {
  userSession.signUserOut('/');
};

export const isUserSignedIn = () => {
  return userSession.isUserSignedIn();
};
