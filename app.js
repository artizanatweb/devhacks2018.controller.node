const {app, BrowserWindow, ipcMain} = require('electron');

const path = require('path');
const url = require('url');

process.title = 'SmartShelf';

const Config = require('./modules/config/Config');
const HwController = require('./modules/hardware/HwController');
const DistanceController = require('./modules/hardware/DistanceController');
const ReadersController = require('./modules/readers/ReadersController');
const ServerClient = require('./modules/server/ServerClient');
const Products = require('./modules/drivers/Products');
const DistanceEvents = require('./modules/events/DistanceEvents');

require('electron-reload')(__dirname);

let win = null;

function bindWindow() {
    ipcMain.on('window', function(event, action) {
        if ('reload' !== action) {
            return;
        }

        win.reload();
    });

    ipcMain.on('test', (event, action, message) => {
        console.log("Test message: ", message);
    });

    ipcMain.on('board', (event, action, message) => {
        console.log(typeof message == 'object');
        console.log("Message to board: ", message);
    });

    DistanceEvents.on("message", (action, distance) => {
        if (null === win) {
            return;
        }

        if (!("distance" === action)) {
            return;
        }

        win.webContents.send('distance', distance);
    });
}

function createWindow() {
    win = new BrowserWindow({width: 1920, height: 1080, x: 0, y: 0});
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/main.html'),
        protocol: 'file',
        slashes: true
    }));

    win.on('closed', function(evt) {
        win = null;
    });

    // win.openDevTools();

    win.setMenu(null);
    win.setFullScreen(true);

    bindWindow();
};

app.on('ready', createWindow);

app.on('window-all-closed', function(evt) {
    app.quit();
});

app.on('activate', function(evt) {
    if (win == null) {
        createWindow();
    }
});

try {
    let hardware = new HwController();
    hardware.init();

    let distance = new DistanceController();
    distance.init();

    let readers = new ReadersController();
    readers.init();

    ServerClient.init();

    Products.getCollection();

} catch(e) {
    console.log(e);
    app.quit();
    process.exit();
}

let devName = Config.get("deviceName");
console.log(devName);