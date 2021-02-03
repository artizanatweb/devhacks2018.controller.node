const electron = require('electron');
const ipc = electron.ipcRenderer;
const ko = knockout = require('knockout');

window.$ = window.jQuery = window.jquery = require("jquery");
window.Velocity = require('velocity-animate');
const bootstrap = require('bootstrap');

const PlayerVideo = require('./areas/PlayerVideo');

class Application {
    constructor() {
        this.height = ko.observable(0);
        this.width = ko.observable(0);

        this.playerVideo = new PlayerVideo();

        ko.applyBindings(this, document.getElementById('app'));
    }

    start() {
        this.height($(window).height());
        this.width($(window).width());

        this.playerVideo.init();
    }
}

module.exports = Application;