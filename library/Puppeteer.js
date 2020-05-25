const puppeteer = require('puppeteer');
const random_useragent = require('random-useragent');
const chalk = require('chalk')

module.exports = class Puppeteer {

    async settingRequest() {
        that.browser = await puppeteer.launch({headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process'
          ],
        });
        that.page = await that.browser.newPage();
       
        // Close poppup
        that.page.on('dialog', async dialog => {
            await dialog.dismiss();
        });
        await that.page.setRequestInterception(true);

        that.page.on('console', message => {
          const type = message.type().substr(0, 3).toUpperCase()
          const colors = {
            LOG: text => text,
            ERR: chalk.red,
            WAR: chalk.yellow,
            INF: chalk.cyan
          }
          if (type == 'ERR') {
            const color = colors[type] || chalk.blue
            console.log(color(`${type} ${message.text()}`))
          }
        })

        that.page.on("request", request => {
            if (["font", "media", "texttrack",
            "object", "beacon", "csp_report",
            "imageset"].indexOf(
                ) !== -1
            ) {
                request.abort();
            } else {
                request.continue();
            }
        });
    }

    async goToCronMessage() {
        let url = process.env.URL_CRON_MESSAGE;

        return await this.goToURL(url);
    }

    async goToURL(url) {
        let object = {
            status: 'success',
            message: ''
        }

        try {
            this.page.setUserAgent(random_useragent.getRandom());
            object.message = await this.page.goto(url, {
                waitUntil: 'networkidle0', 
            });
        } catch(exception) {
            return {
                status: 'error',
                message: exception.message
            }
        }

        return object;
    }

    async closePage() {
        return await that.browser.close();
    }

    delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    }
}
