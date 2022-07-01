const fs = require('fs');
const xcode = require('xcode');

const developmentTeamId = process.argv[2];
const path = './love/platform/xcode/love.xcodeproj/project.pbxproj';
const project = xcode.project(path).parseSync();

const targetKey = project.findTargetKey('love-macosx');
const resourcesGroupKey = project.findPBXGroupKey({name: 'Resources'});
// project.addBuildProperty('CODE_SIGN_ENTITLEMENTS', 'App/App.entitlements');
// project.addBuildProperty('DEVELOPMENT_TEAM', developmentTeamId);
// project.addFile('App.entitlements', resourcesGroupKey);
// project.removeFile('GoogleService-Info.plist', resourcesGroupKey);
const pbxFile = project.addFile('./target.love', resourcesGroupKey, {target: targetKey});
pbxFile.uuid = project.generateUuid();
project.addToPbxBuildFileSection(pbxFile);
project.addToPbxResourcesBuildPhase(pbxFile);
fs.writeFileSync(path, project.writeSync());