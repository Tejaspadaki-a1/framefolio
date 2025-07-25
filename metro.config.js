const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for Firebase and Hermes compatibility
config.resolver.assetExts.push('cjs');

// Add polyfills for Hermes engine
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;