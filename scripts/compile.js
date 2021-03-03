const baseScheme = [
    Array('src/packages/core'),
    Array('src/packages/theme','src/packages/router')
   ];

async function compile(package) {
    let scheme = schemeForPackage(package)
    return await scheme.reduce( async (previousPromise, nextScheme) => {
        await previousPromise;
        return Promise.all(nextScheme.map(scheme => 
            buildTask(scheme)
        ))
    }, Promise.resolve());
}

function buildTask(scheme) {    
    return new Promise( resolve => {
        console.log("👉 Building: " + scheme + "\r")
        console.log(" ")

        var spawn = require('child_process').spawn;

        if(scheme === 'packages/badgerherald.org') {
            var ls = spawn('npm', ['run','build','--dev'], { cwd: scheme });
        } else {
            var ls = spawn('npm', ['run','build'], { cwd: scheme });
        }

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

function schemeForPackage(package) {
    var scheme = Array()
    baseScheme.map(schemePackages => {
        if(scheme.length > 0) {
            scheme.push(schemePackages)
            return
        }
        schemePackages.map(schemePackage => {
            if(package === schemePackage) {
                scheme.push([package])
                return
            }
        })
    })
    return scheme
}

compile(process.argv[2] || 'packages/core')