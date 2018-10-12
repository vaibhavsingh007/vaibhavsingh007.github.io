"use strict";

/* Get or create the application global variable */
var App = App || {};

/* IIFE to initialize the main entry of the application*/
(function() {

    // setup the pointer to the scope 'this' variable
    var self = this;

    /* Entry point of the application */
    App.start = function()
    {
        // create a new scene
        App.scene = new Scene({container:"scene"});

        // initialize the particle system
        var particleSystem = new ParticleSystem();
        particleSystem.initialize('data/058.csv');

        //add the particle system to the scene
        App.scene.addObject( particleSystem.getParticleSystems());

        window.addEventListener('resize', App.scene.resize, false);

        window.addEventListener('keydown', checkKey, false);
        //document.onkeydown = checkKey;

        function checkKey(e) {

            e = e || window.event;

            if (e.keyCode === 38) {
                // up arrow
                particleSystem.keyup();
            }
            else if (e.keyCode === 40) {
                // down arrow
                particleSystem.keydown();
            }
            else if (e.keyCode === 37) {
                // left arrow
            }
            else if (e.keyCode === 39) {
                // right arrow
            }

        }

        // render the scene
        App.scene.render();

        // Prevent browser behavior on keypress
        window.addEventListener("keydown", function (e) {
            // space and arrow keys
            if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);

    };

}) ();