/**
 * Entry point for AMD module system
 */

requirejs.config({
    baseUrl: 'js',
    paths: {
        lib: '../lib'
    },
    urlArgs: "bust=" + (new Date()).getTime() // TODO remove this from production version
});

requirejs(["typing"], function (typing) {
    typing();
});
