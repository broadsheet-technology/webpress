
const buildScheme = [
    'src/packages/core',
    'src/packages/theme',
    'src/packages/router'
   ];

buildScheme.reduce( async (previousPromise, nextScheme) => {
    await previousPromise;
    return buildTask(nextScheme);
  }, Promise.resolve());


function buildTask(scheme) {    
    return new Promise( resolve => {
        console.log("👉 Building: " + scheme + "\r")
        console.log(" ")

        var spawn = require('child_process').spawn;
        var ls = spawn('npm', ['run','build'], { cwd: scheme });

        ls.on("error",function (err) {
            resolve();
            console.log(err);
            console.log(" ")
            console.log(" ")
        });

        ls.stdout.on('data', function (data) {
            console.log(data.toString().replace(/(\r\n|\n|\r)/gm,""));
        });

        ls.stderr.on('data', function (data) {
            console.log(data.toString().replace(/(\r\n|\n|\r)/gm,""));
        });

        ls.on('exit', function (code) {
            resolve();
            console.log(scheme + ' built with exit code ' + code.toString().replace(/(\r\n|\n|\r)/gm,""));
            console.log(" ")
            console.log(" ")
        });
    })
}