import React from 'react';

const AppInfo = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'UnitMaster';
  const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
  const environment = import.meta.env.VITE_ENVIRONMENT || 'development';
  const isDebug = import.meta.env.VITE_DEBUG === 'true';

  return {
    appName,
    appVersion,
    environment,
    isDebug,
    fullInfo: `${appName} v${appVersion} (${environment})`
  };
};

export default AppInfo;
