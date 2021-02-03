const electron = require('electron');
const ipc = electron.ipcRenderer;

window.$ = window.jQuery = window.jquery = require("jquery");
window.Velocity = require('velocity-animate');
const bootstrap = require('bootstrap');

const Application = require('./../modules/ui/Application');

let appStartTimer = 0;

$('document').ready(function() {
   console.log("Application is ready");

   let app = new Application();

   appStartTimer = setTimeout(() => {
      app.start();
   }, 1000);
});