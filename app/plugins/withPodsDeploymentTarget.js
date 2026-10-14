const { withPodfile } = require('expo/config-plugins');

const MIN_IOS = '15.1';
const MARKER = '# falamigos: pods deployment target';

/**
 * Some pods (SDWebImage, ReachabilitySwift, RNSVG…) declare iOS 9–13 targets,
 * which current Xcode rejects for the simulator (supported range starts at 15).
 */
module.exports = function withPodsDeploymentTarget(config) {
  return withPodfile(config, (config) => {
    let podfile = config.modResults.contents;
    if (podfile.includes(MARKER)) return config;

    const snippet = `
    ${MARKER}
    installer.pods_project.targets.each do |t|
      t.build_configurations.each do |c|
        if Gem::Version.new(c.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] || '0') < Gem::Version.new('${MIN_IOS}')
          c.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${MIN_IOS}'
        end
      end
    end
`;
    podfile = podfile.replace(/(post_install do \|installer\|[\s\S]*?react_native_post_install\([\s\S]*?\)\n)/, `$1${snippet}`);
    config.modResults.contents = podfile;
    return config;
  });
};
