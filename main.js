const fs = require('fs')
const xcode = require('xcode')

if (process.argv.length !== 3) {
    console.error("Please pass the development team ID as the first argument")
    process.exit(1)
}
const developmentTeamId = process.argv[2]
const path = 'ios/App/App.xcodeproj/project.pbxproj'
const project = xcode.project(path)

project.parse(error => {
    const targetKey = project.findTargetKey('App')
    const appGroupKey = project.findPBXGroupKey({path: 'App'})
    project.addBuildProperty('CODE_SIGN_ENTITLEMENTS', 'App/App.entitlements')
    project.addBuildProperty('DEVELOPMENT_TEAM', developmentTeamId)
    project.addFile('App.entitlements', appGroupKey)
    project.removeFile('GoogleService-Info.plist', appGroupKey)
    const f = project.addFile('GoogleService-Info.plist', appGroupKey, {target: targetKey})
    f.uuid = project.generateUuid()
    project.addToPbxBuildFileSection(f)
    project.addToPbxResourcesBuildPhase(f)
    fs.writeFileSync(path, project.writeSync())
})
