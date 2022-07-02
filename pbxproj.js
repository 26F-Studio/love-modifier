const fs = require('fs');
const xcode = require('xcode');

const pbxprojPath = './love/platform/xcode/love.xcodeproj/project.pbxproj';

const project = xcode.project(pbxprojPath).parseSync();

project.updateProductName('Quatrack');
const resourcesGroupKey = project.findPBXGroupKey({name: 'Resources'});
const targetKey = project.findTargetKey('"love-ios"')
project.addResourceFile('./target.love', {target: targetKey}, resourcesGroupKey);

fs.writeFileSync(pbxprojPath, project.writeSync());

// project.addBuildProperty('CODE_SIGN_ENTITLEMENTS', 'App/App.entitlements');
// project.addBuildProperty('DEVELOPMENT_TEAM', developmentTeamId);
// project.addFile('App.entitlements', resourcesGroupKey);
// project.removeFile('GoogleService-Info.plist', resourcesGroupKey);
