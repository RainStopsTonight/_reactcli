
const path = require('path')
const os = require('os')
const chalk = require('chalk');
const { Command } = require('commander');
const execSync = require('child_process').execSync;
const semver = require('semver');
const fs = require('fs-extra');
const spawn = require('cross-spawn');
const packageJson = require('./package.json')
const log = console.log
let projectName

function init(params) {
    const program = new Command()
    program.option('--verbose', 'xxxxxxxxx')
        .option('--info', 'print environment debug info')
        .action(name => {
            console.log('name: ', name);
            projectName = name;
        })
        .option('--use-npm')
        .on('--help', () => {
            console.log('helping!!!!');
        })
        .parse(process.argv)

    createApp(projectName, program.verbose)
}

function createApp(name, verbose, useNpm) {
    name = 'default'
    console.log('name: ', name);
    // 没有目录的话自动创建目录
    fs.ensureDirSync(name);
    console.log(`Creating a new React app in ${chalk.green(root)}.`);

    const root = path.resolve(name);
    const appName = path.basename(root); // 不懂
    log('root: ', root);
    // const unsupportedNodeVersion = !semver.satisfies(process.version, '>=10');
    const packageJson = {
        name: appName,
        version: '0.1.0',
        private: true,
    };

    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL
    );

    const useYarn = useNpm ? false : shouldUseYarn

    // process.chdir(root); // 不懂
    if (!useYarn) {
        const npmInfo = checkNpmVersion()
        if (!npmInfo.hasMinNpm) {
            if (npmInfo.npmVersion) {
                console.log(
                    chalk.yellow(
                        `You are using npm ${npmInfo.npmVersion} so the project will be bootstrapped with an old unsupported version of tools.\n\n` +
                        `Please update to npm 6 or higher for a better, fully supported experience.\n`
                    )
                );
            }
            // Fall back to latest supported react-scripts for npm 3
            version = 'react-scripts@0.9.x';
        }
    } else {
        let yarnUsesDefaultRegistry = true;
        try {
            yarnUsesDefaultRegistry =
                execSync('yarnpkg config get registry').toString().trim() ===
                'https://registry.yarnpkg.com';
        } catch (e) {
            // ignore
        }
        if (yarnUsesDefaultRegistry) {
            fs.copySync(
                require.resolve('./yarn.lock.cached'),
                path.join(root, 'yarn.lock')
            );
        }
    }

    const originalDirectory = process.cwd(); // 这一步是文件夹目录有变??

    run(root,
        appName,
        version,
        verbose,
        originalDirectory,
        useYarn)

}

function shouldUseYarn(params) {
    try {
        execSync(`yarn --version`, { stdio: 'ignore' })
        return true
    } catch (error) {
        return false
    }
}

function run(root, appName, version, verbose, originalDirectory, useYarn) {
    
}

function checkNpmVersion() {
    let hasMinNpm = false;
    let npmVersion = null;
    try {
        npmVersion = execSync('npm --version').toString().trim();
        hasMinNpm = semver.gte(npmVersion, '6.0.0');
    } catch (err) {
        // ignore
    }
    return {
        hasMinNpm: hasMinNpm,
        npmVersion: npmVersion,
    };
}






module.exports = {
    init
}