const { ipcRenderer } = require('electron')
const { Scene, Engine, ArcRotateCamera, PhotoDome, VideoDome, Color4 } = require('babylonjs')

var scene = null
const canvas = document.getElementById('renderCanvas')
const engine = new Engine(canvas, true);
scene = createScene(engine, canvas)


document.getElementById('selectFile').onclick = (event) => {
    event.preventDefault()
    ipcRenderer.send('selectPhoto')
}

ipcRenderer.on('selectedPhoto', (event, photoPath, isVideo) => {
    updateScene(scene, photoPath[0], isVideo);

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