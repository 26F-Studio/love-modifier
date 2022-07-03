const fs = require('fs');
const plist = require('plist');
const xcode = require('xcode');

const pbxprojPath = './love/platform/xcode/love.xcodeproj/project.pbxproj';
const project = xcode.project(pbxprojPath).parseSync();
project.updateBuildProperty('PRODUCT_NAME', 'Techmino_Galaxy', null, 'love-macosx')
const resourcesGroupKey = project.findPBXGroupKey({name: 'Resources'});
const targetKey = project.findTargetKey('"love-macosx"')
project.addResourceFile('./target.love', {target: targetKey}, resourcesGroupKey);
console.info('Project info updated.');
fs.writeFileSync(pbxprojPath, project.writeSync());

const plistPath = './love/platform/xcode/macosx/love-macosx.plist';
const parsed = plist['parse'](fs.readFileSync(plistPath, 'utf8'));
parsed['CFBundleName'] = 'Techmino_Gal_ax_y'.replace(/_/g, ' ');
parsed['NSHumanReadableCopyright'] = 'Copyright © 2019-' + new Date().getFullYear() + ' 26F-Studio. Some Rights Reserved.';
delete parsed['CFBundleDocumentTypes'];
delete parsed['UTExportedTypeDeclarations'];
console.info(parsed);
fs.writeFileSync(plistPath, plist['build'](parsed));

const iconPath = './love/platform/xcode/Images.xcassets/OS X AppIcon.appiconset/Contents.json';
const iconContents = JSON.parse(fs.readFileSync(iconPath, 'utf8'));
iconContents.images.forEach(image => {
    image.filename = 'icon_' + image.size + (image.scale === '2x' ? '@2x' : '') + '.png';
});
console.info(iconContents);
fs.writeFileSync(iconPath, JSON.stringify(iconContents));
