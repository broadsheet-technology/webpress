import fs from 'fs';

export interface WebpressThemeOptions {
    name: string,
    themeDir: string
}
export function theme(options : WebpressThemeOptions) {
    return {
        generateBundle() {
            fs.copyFile(__dirname + '/www/index.php', options.themeDir + 'index.php', (err) => {
                if (err) throw err;
            });
            fs.copyFile(__dirname + '/www/functions.php', options.themeDir + 'functions.php', (err) => {
                if (err) throw err;
            });
        }
    }
}
