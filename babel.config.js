module.exports = (api) => {
  const environment = api.env();
  const moduleResolverPlugin = [
    'module-resolver',
    {
      root: ['./'],
      extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      alias: {
        "assets": "./src/assets",
        "app-store": "./src/redux",
        "language": "./src/localization",
        "api": "./src/api",
        "utils": "./src/utils",
        "custom-components": "./src/components",
        "screens": "./src/screens",
        "database": "./src/database/Database.ts",
        "firebase-services": "./src/firebase/FirebaseServices.ts",
        "socket": "./src/socket",
        "analytics": "./src/analytics/AnalyticService.ts",
        "intercom": "./src/intercom/IntercomService.ts",
        "rollbar-service": "./src/rollbar"
      }
    }
  ]

  const plugins = [moduleResolverPlugin]
  if (environment !== 'development') {
    plugins.push(['transform-remove-console']);
  }
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ...plugins,
      'react-native-reanimated/plugin'
    ]
  }
};
