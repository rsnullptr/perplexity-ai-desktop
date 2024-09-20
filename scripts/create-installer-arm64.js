const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define paths
const scriptsDir = __dirname;
const rootDir = path.join(__dirname, '..');
const releaseBuildsDir = path.join(rootDir, 'release-builds');
const perplexityAppPath = path.join(releaseBuildsDir, 'Perplexity-darwin-arm64', 'Perplexity.app');

// Create the AppleScript
const appleScript = `
tell application "Finder"
    set sourceApp to POSIX file "${perplexityAppPath}" as alias
    set destFolder to path to applications folder
    duplicate sourceApp to destFolder with replacing
    set installedApp to (path to applications folder as text) & "Perplexity.app"
    do shell script "xattr -dr com.apple.quarantine " & quoted form of POSIX path of installedApp
    display dialog "Perplexity has been installed to your Applications folder and is ready to use!" buttons {"OK"} default button "OK"
end tell
`;

// Save the AppleScript
const applescriptPath = path.join(scriptsDir, 'InstallPerplexity-arm64.applescript');
fs.writeFileSync(applescriptPath, appleScript);

// Compile the AppleScript
const installAppPath = path.join(scriptsDir, 'Perplexity-installer-arm64.app');
execSync(`osacompile -o "${installAppPath}" "${applescriptPath}"`);
//
// // Create dmg-contents.json
// const dmgContents = [
//     { "x": 448, "y": 344, "type": "link", "path": "/Applications" },
//     { "x": 192, "y": 344, "type": "file", "path": perplexityAppPath },
//     { "x": 192, "y": 128, "type": "file", "path": installAppPath }
// ];
// const dmgContentsPath = path.join(scriptsDir, 'dmg-contents.json');
// fs.writeFileSync(dmgContentsPath, JSON.stringify(dmgContents, null, 2));
//
// // Create the DMG
// execSync(`electron-installer-dmg "${perplexityAppPath}" Perplexity-installer-arm64 --out="${releaseBuildsDir}" --overwrite --icon="${path.join(rootDir, 'icons', 'logo.icns')}" --contents="${dmgContentsPath}"`);

console.log('DMG created successfully!');
