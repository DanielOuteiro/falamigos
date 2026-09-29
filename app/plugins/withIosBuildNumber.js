const { withXcodeProject } = require('expo/config-plugins');

/**
 * Expo writes ios.buildNumber to Info.plist CFBundleVersion, but Xcode's
 * General tab reads CURRENT_PROJECT_VERSION from the pbxproj — which
 * prebuild leaves at 1. Keep them in sync.
 */
module.exports = function withIosBuildNumber(config) {
  const buildNumber = config.ios?.buildNumber ?? '1';

  return withXcodeProject(config, (config) => {
    const project = config.modResults;
    const configurations = project.pbxXCBuildConfigurationSection();

    for (const key of Object.keys(configurations)) {
      const buildSettings = configurations[key]?.buildSettings;
      if (buildSettings && buildSettings.PRODUCT_BUNDLE_IDENTIFIER) {
        buildSettings.CURRENT_PROJECT_VERSION = buildNumber;
      }
    }

    return config;
  });
};
