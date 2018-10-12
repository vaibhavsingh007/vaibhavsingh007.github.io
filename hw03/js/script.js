var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.CylinderGeometry(1, 1, 4);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//create a blue LineBasicMaterial
var lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
var lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
lineGeometry.vertices.push(new THREE.Vector3(0, 10, 0));
lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
lineGeometry.vertices.push(new THREE.Vector3(10, 0, 0));
var line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

//This will add a starfield to the background of a scene
var starsGeometry = new THREE.Geometry();

for (var i = 0; i < 10000; i++) {

    var star = new THREE.Vector3();
    star.x = THREE.Math.randFloatSpread(2000);
    star.y = THREE.Math.randFloatSpread(2000);
    star.z = THREE.Math.randFloatSpread(2000);

    starsGeometry.vertices.push(star);
}

var starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });
var starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 50);
camera.lookAt(0, 0, 0);
//camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();