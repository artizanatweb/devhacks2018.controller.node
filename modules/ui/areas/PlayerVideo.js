const electron = require('electron');
const ipc = electron.ipcRenderer;
const ko = knockout = require('knockout');

window.$ = window.jQuery = window.jquery = require("jquery");
window.Velocity = require('velocity-animate');

const Config = require('./../../config/Config');

class PlayerVideo {
    constructor() {
        this.className = ko.observable("hide");

        this.stared = false;

        this.triggerDistance = Config.get("distanceTrigger");

        this.video = $('#videoPlayer').get(0);

        this.support = $('#video-support');

        this.playerBottom = 1 - $(window).height() - 200;
        $(this.support).css('bottom', `${this.playerBottom}px`);
    }

    init() {
        this.start();
    }

    start() {
        if (this.stared) {
            return;
        }

        this.stared = true;

        ipc.on('distance', (event, distance) => {
            console.log((distance));
            if (distance > this.triggerDistance) {
                return;
            }

            this.open();
        });

        this.video.addEventListener('ended', this.close.bind(this), false);
    }

    open() {
        this.className("show");
        // this.video.play();
        $(this.support).velocity({ bottom: 0 }, {
            duration: 300,
            complete: (evt) => {
                this.video.play();
            }
        });
    }

    close() {
        // this.video.pause();
        // this.className("hide");
        $(this.support).velocity({ bottom: this.playerBottom }, {
            duration: 600,
            complete: (evt) => {
                this.video.pause();
                this.className("hide");
            }
        });
    }
}

module.exports = PlayerVideo;