const fs = require('fs');
const plist = require('plist');
const xcode = require('xcode');

const pbxprojPath = './love/platform/xcode/love.xcodeproj/project.pbxproj';
const project = xcode.project(pbxprojPath).parseSync();
project.updateBuildProperty('CODE_SIGN_IDENTITY', '"Developer ID Application"', 'Distribution', 'love-macosx')
project.updateBuildProperty('MACOSX_DEPLOYMENT_TARGET', '10.9', 'Distribution', 'love-macosx')
project.updateBuildProperty('MARKETING_VERSION', '${{ inputs.versionString }}', 'Distribution', 'love-macosx')
project.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', '${{ steps.process-app-name.outputs.bundle-id }}', 'Distribution', 'love-macosx')
project.updateBuildProperty('PRODUCT_NAME', '${{ steps.process-app-name.outputs.product-name }}', 'Distribution', 'love-macosx')
const resourcesGroupKey = project.findPBXGroupKey({name: 'Resources'});
const targetKey = project.findTargetKey('"love-macosx"')
project.addResourceFile('./target.love', {target: targetKey}, resourcesGroupKey);
fs.writeFileSync(pbxprojPath, project.writeSync());

const plistPath = './love/platform/xcode/macosx/love-macosx.plist';
const parsed = plist['parse'](fs.readFileSync(plistPath, 'utf8'));
parsed['CFBundleExecutable'] = '${{ steps.process-app-name.outputs.product-name }}';
parsed['CFBundleName'] = '${{ inputs.appName }}';
parsed['NSHumanReadableCopyright'] = 'Copyright © 2019-' + new Date().getFullYear() + ' 26F-Studio. Some Rights Reserved.';
delete parsed['CFBundleDocumentTypes'];
delete parsed['UTExportedTypeDeclarations'];
fs.writeFileSync(plistPath, plist['build'](parsed));

const exportPlistPath = './love/platform/xcode/macosx/macos-copy-app.plist';
const exportPlist = plist['parse'](fs.readFileSync(exportPlistPath, 'utf8'));
exportPlist['method'] = 'developer-id';
// exportPlist['signingCertificate'] = 'Developer ID Application';
fs.writeFileSync(exportPlistPath, plist['build'](exportPlist));

const iconPath = './love/platform/xcode/Images.xcassets/OS X AppIcon.appiconset/Contents.json';
const iconContents = JSON.parse(fs.readFileSync(iconPath, 'utf8'));
iconContents.images.forEach(image => {
    image.filename = 'icon_' + image.size + (image.scale === '2x' ? '@2x' : '') + '.png';
});
fs.writeFileSync(iconPath, JSON.stringify(iconContents));

console.info('Project info updated.');
