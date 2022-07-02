const fs = require('fs');
const plist = require('plist');

const path = './love/platform/xcode/macosx/love-macosx.plist';

const parsed = plist['parse'](fs.readFileSync(path, 'utf8'));

console.log(JSON.stringify(parsed, null, 2));

parsed['CFBundleName'] = 'Quatrack';

fs.writeFileSync(path, plist['build'](parsed));
