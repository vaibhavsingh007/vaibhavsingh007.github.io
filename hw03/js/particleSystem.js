"use strict";

/* Get or create the application global variable */
var App = App || {};

var ParticleSystem = function () {

    // setup the pointer to the scope 'this' variable
    var self = this;

    // data container
    var data = [];

    // scene graph group for the particle system
    var sceneObject = new THREE.Group();

    // bounds of the data
    var bounds = {};

    var coordPrecision = 1;
    var planeIncrements = 0.5;

    // create the containment box.
    // This cylinder is only to guide development.
    // TODO: Remove after the data has been rendered
    self.drawContainment = function () {

        // get the radius and height based on the data bounds
        var radius = (bounds.maxX - bounds.minX) / 2.0 + 1;
        var height = (bounds.maxY - bounds.minY) + 1;

        // create a cylinder to contain the particle system
        var geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
        var cylinder = new THREE.Mesh(geometry, material);

        // add the containment to the scene
        sceneObject.add(cylinder);
    };

    var colors = [];
    var pointCloud;

    // creates the particle system
    self.createParticleSystem = function () {

        // use self.data to create the particle system
        //This will add a starfield to the background of a scene
        var starsGeometry = new THREE.Geometry();
        var color = new THREE.Color(1, 1, 1);

        var k = 0;

        for (var i = 0; i < data.length; i++) {

            var star = new THREE.Vector3();
            star.x = data[i].X;
            star.y = data[i].Z;
            star.z = data[i].Y;

            var intensity = data[i].concentration;
            //colors[3 * k] = color.r * intensity;
            //colors[3 * k + 1] = color.g * intensity;
            //colors[3 * k + 2] = color.b * intensity;

            starsGeometry.vertices.push(star);
            colors[k] = color.clone().multiplyScalar(intensity);
            k++;
        }

        starsGeometry.colors = colors;
        starsGeometry.computeBoundingBox();
        var starsMaterial = new THREE.PointCloudMaterial({ size: 0.03, vertexColors: THREE.VertexColors, side: THREE.DoubleSide });
        //new THREE.PointsMaterial({ color: 0x888888 });

        pointCloud = new THREE.PointCloud(starsGeometry, starsMaterial);
        //pointCloud.scale.set(2, 2, 2);
        pointCloud.position.set(0, -5, 0);
        sceneObject.add(pointCloud);

        // Add plane
        var planeGeometry = new THREE.PlaneGeometry(15, 15);
        var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xb0b0b0, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
        self.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        self.plane.matrixAutoUpdate = false;

        //plane.rotateX(- Math.PI / 2);

        console.log(self.plane.position.z);
        self.show2Dpoints(parseFloat(self.plane.position.z.toFixed(coordPrecision)), colors);
        sceneObject.add(self.plane);
    };

    self.onKeyUpDown = function (delta) {
        var newZ = parseFloat(self.plane.position.z.toFixed(coordPrecision)) + delta;    // Considering 3 dec places instead of 5
        newZ = parseFloat(newZ.toFixed(coordPrecision));
        self.plane.position.z = parseFloat(newZ.toFixed(coordPrecision));
        self.plane.updateMatrix();
        console.log(self.plane.position.z);
        self.show2Dpoints(newZ, colors);
    };

    var previous2DColors = [];
    self.show2Dpoints = function (planeZ, colors) {
        var pointColors = [];
        var data2D = data.filter((d, i) => {
            var pointY = parseFloat(d.Y.toFixed(coordPrecision));
            if (pointY === planeZ) {
                pointColors.push({ c: colors[i].clone(), i: i });
                return pointY === planeZ;
            }
        });

        showPoints(data2D, pointColors.map(pc => pc.c));
        self.highlightPlanePoints(pointColors, previous2DColors);
        previous2DColors = pointColors;
    };

    self.highlightPlanePoints = function (pointColors, previous2DColors) {
        var color = new THREE.Color(255, 0, 0);

        // Set current indices
        for (var m = 0; m < pointColors.length; m++) {
            pointCloud.geometry.colors[pointColors[m].i].set(color.clone());
        }

        for (var n = 0; n < previous2DColors.length; n++) {
            pointCloud.geometry.colors[previous2DColors[n].i].set(previous2DColors[n].c);
        }
        pointCloud.geometry.colorsNeedUpdate = true;
    };

    // data loading function
    self.loadData = function (file) {

        // read the csv file
        d3.csv(file)
            // iterate over the rows of the csv file
            .row(function (d) {

                // get the min bounds
                bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
                bounds.minY = Math.min(bounds.minY || Infinity, d.Points1);
                bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2);

                // get the max bounds
                bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
                bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1);
                bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2);

                // add the element to the data collection
                data.push({
                    // concentration density
                    concentration: Number(d.concentration),
                    // Position
                    X: Number(d.Points0),
                    Y: Number(d.Points1),
                    Z: Number(d.Points2),   // This corresponds to height of cylinder in data
                    // Velocity
                    U: Number(d.velocity0),
                    V: Number(d.velocity1),
                    W: Number(d.velocity2)
                });
            })
            // when done loading
            .get(function () {
                // draw the containment cylinder
                // TODO: Remove after the data has been rendered
                //self.drawContainment();

                // create the particle system
                self.createParticleSystem();
                //self.show2Dpoints();
            });
    };

    // publicly available functions
    var publiclyAvailable = {

        // load the data and setup the system
        initialize: function (file) {
            self.loadData(file);
        },

        // accessor for the particle system
        getParticleSystems: function () {
            return sceneObject;
        },

        keyup: function () {
            self.onKeyUpDown(planeIncrements);
        },

        keydown: function () {
            self.onKeyUpDown(-planeIncrements);
        }

    };

    return publiclyAvailable;

};