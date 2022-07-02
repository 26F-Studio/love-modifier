const fs = require('fs');
const plist = require('plist');

const plistPath = './love/platform/xcode/macosx/love-macosx.plist';

const parsed = plist['parse'](fs.readFileSync(plistPath, 'utf8'));
parsed['CFBundleName'] = 'Quatrack';

fs.writeFileSync(plistPath, plist['build'](parsed));
