﻿// PointCloud with Custom, Dynamic Attribute

var renderer, scene, camera, cloud, uniforms;

init();
animate();

function init() {

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    // point cloud geometry
    var geometry = new THREE.SphereBufferGeometry(100, 16, 8);

    // add an attribute
    numVertices = geometry.attributes.position.count;
    var alphas = new Float32Array(numVertices * 1); // 1 values per vertex

    for (var i = 0; i < numVertices; i++) {

        // set alpha randomly
        alphas[i] = Math.random();

    }

    geometry.addAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    // uniforms
    uniforms = {

        color: { value: new THREE.Color(0xffff00) },

    };

    // point cloud material
    var shaderMaterial = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        transparent: true

    });

    // point cloud
    cloud = new THREE.Points(geometry, shaderMaterial);

    scene.add(cloud);

}

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {

    var alphas = cloud.geometry.attributes.alpha;
    var count = alphas.count;

    for (var i = 0; i < count; i++) {

        // dynamically change alphas
        alphas.array[i] *= 0.95;

        if (alphas.array[i] < 0.01) {
            alphas.array[i] = 1.0;
        }

    }

    alphas.needsUpdate = true; // important!

    cloud.rotation.x += 0.005;
    cloud.rotation.y += 0.005;

    renderer.render(scene, camera);

}
