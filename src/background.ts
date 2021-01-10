const HOSTNAMES = 'hostnames';

interface storeOptions {
    hostnames: string[]
}

class App {
    addHostnameIfNot(url: string, callback: (added: boolean) => void) {
        const hostname = new URL(url).hostname;
        chrome.storage.local.get(HOSTNAMES, function (storage) {
            var data: [string] | null = storage?.hostnames;
            if (data) {
                const notExists = data.indexOf(hostname) == -1;
                const options = {} as storeOptions;
                options[HOSTNAMES] = data;
                if (notExists) {
                    data.push(hostname);
                    chrome.storage.local.set(options, function () {
                        callback(notExists);
                    });
                } else {
                    delete data[data.indexOf(hostname)];
                    chrome.storage.local.set(options, function () {
                        callback(notExists);
                    });
                }
            } else {
                const options = {} as storeOptions;
                options.hostnames = [hostname];
                chrome.storage.local.set(options, () => {
                    callback(true)
                });
            }
        })
    }
    toggleMute(id: number, muted = true) {
        chrome.tabs.update(id, { muted: muted })
    }
}
const app = new App();


const tabChangeHandler = function (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, _tab: chrome.tabs.Tab) {
    if (changeInfo.url) {
        const url = new URL(changeInfo.url);
        chrome.storage.local.get(HOSTNAMES, function (stroage) {
            const hostnames = (stroage as storeOptions)?.hostnames ?? [];
            hostnames.forEach(hostname => {
                if (hostname === url.hostname) {
                    app.toggleMute(tabId);
                }
            });
        })
    }
};
chrome.tabs.onUpdated.addListener(tabChangeHandler);

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.query({ active: true }, function (tabs) {
        tabs.forEach(tab => {
            if (tab.url) {
                app.addHostnameIfNot(tab.url!, added => {
                    if (added) {
                        app.toggleMute(tab.id!)
                    } else {
                        app.toggleMute(tab.id!, false)
                    }
                });

            }
        })
    })
});
