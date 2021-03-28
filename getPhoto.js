const { ipcRenderer } = require('electron')
const { Scene, Engine, ArcRotateCamera, PhotoDome, VideoDome, Color4 } = require('babylonjs')

var scene = null
const canvas = document.getElementById('renderCanvas')
const filenameRendering = document.getElementById('filename')
const loader = document.getElementById('loaderContainer')

const engine = new Engine(canvas, true);
scene = createScene(engine, canvas)


document.getElementById('selectFile').onclick = (event) => {
    event.preventDefault()
    loader.classList.remove('hidden')
    ipcRenderer.send('selectPhoto')
}

ipcRenderer.on('selectedPhoto', (event, photoPath, isVideo) => {
    updateScene(scene, photoPath[0], isVideo);

    if (process.platform.startsWith('win')) {
        const splitingPath = photoPath[0].split('\\')
        filenameRendering.innerText = splitingPath[splitingPath.length - 1]
    } else {
        const splitingPath = photoPath[0].split('/')
        filenameRendering.innerText = splitingPath[splitingPath.length - 1]
    }
    loader.classList.add('hidden')


})

ipcRenderer.on('abordSelection', (event) => {
    loader.classList.add('hidden')
})

function createScene(engine, canvas) {
    var scene = new Scene(engine);

    scene.clearColor = new Color4(1, 1, 1, 1)
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));

    camera.attachControl(canvas, true);

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        scene.render();
    });
    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });

    return scene

}


function updateScene(scene, filePath, isVideo) {
    photoNode = scene.getNodeByName('myPhotodome')
    if (photoNode != null) {
        photoNode.dispose()
    }
    videoNode = scene.getNodeByName('myVideoDome')
    if (videoNode != null) {
        videoNode.dispose()
    }
    if (isVideo) {
        videoDome = new VideoDome('myVideoDome', filePath, {}, scene)
        console.log(videoDome)
    } else {
        photoDome = new PhotoDome("myPhotodome", filePath, {}, scene);
        console.log(photoDome)
    }
}