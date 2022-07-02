const fs = require('fs');
const plist = require('plist');
const xcode = require('xcode');

const pbxprojPath = './love/platform/xcode/love.xcodeproj/project.pbxproj';
const project = xcode.project(pbxprojPath).parseSync();
project.updateProductName('${{ inputs.appName }}');
const resourcesGroupKey = project.findPBXGroupKey({name: 'Resources'});
const targetKey = project.findTargetKey('"love-macosx"')
project.addResourceFile('./target.love', {target: targetKey}, resourcesGroupKey);
fs.writeFileSync(pbxprojPath, project.writeSync());

const plistPath = './love/platform/xcode/macosx/love-macosx.plist';
const parsed = plist['parse'](fs.readFileSync(plistPath, 'utf8'));
parsed['CFBundleName'] = '${{ inputs.appName }}';
fs.writeFileSync(plistPath, plist['build'](parsed));

// project.addBuildProperty('CODE_SIGN_ENTITLEMENTS', 'App/App.entitlements');
// project.addBuildProperty('DEVELOPMENT_TEAM', developmentTeamId);
// project.addFile('App.entitlements', resourcesGroupKey);
// project.removeFile('GoogleService-Info.plist', resourcesGroupKey);
