
const baseScheme = [
    Array('src/packages/core'),
    Array('src/packages/tags','src/packages/router'),
    Array('src/themes/badgerherald.org'),
   ];
   
const watch = require('watch');

var currentBuildProcess;

function triggerCompile(package) {
    var spawn = require('child_process').spawn;
    var ls = spawn('node', ['scripts/compile', package]);

    ls.stdout.on('data', function (data) {
        console.log(data.toString().replace(/(\r\n|\n|\r)/gm,""));
    });

    ls.stderr.on('data', function (data) {
        console.log(data.toString().replace(/(\r\n|\n|\r)/gm,""));
    });

    return ls;
}
function main() { 
    baseScheme.map(schemePackages => schemePackages.map(package => watch.watchTree(package + '/src', {ignoreDirectoryPattern: /node_modules|dist|\.stencil/}, (f, curr, prev) => {
        if (typeof f == "object" && prev === null && curr === null) {
            return;
        }
        else if(f.endsWith("dist") || f.endsWith("d.ts")) {
            return;
        }
        console.log("🚨🚨rebuilding...", f);
        currentBuildProcess.kill('SIGINT');
        currentBuildProcess = triggerCompile(package)
    })));
    currentBuildProcess = triggerCompile('packages/core');
}

main()




