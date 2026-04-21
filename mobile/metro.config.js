const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for .mjs and .cjs for packages like socket.io-client
config.resolver.sourceExts.push('mjs', 'cjs');

// Prioritize entry points for React Native compatibility
config.resolver.resolverMainFields = ['native', 'browser', 'main'];

// Polyfill buffer for react-native-svg
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  buffer: require.resolve('buffer'),
  'socket.io-client': require.resolve('socket.io-client/dist/socket.io.js'),
};

module.exports = withNativewind(config, { inlineRem: 16 });
