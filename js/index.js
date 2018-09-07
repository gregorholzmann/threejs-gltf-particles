let scene, camera, renderer
let geometry, material, parentContainer, originPoints = []
init()

function init() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 300
  parentContainer = new THREE.Object3D()
  let axis = new THREE.Vector3(1,0,0)
  parentContainer.rotateOnAxis(axis, 1.5708)
  scene.add(parentContainer)

  let loader = new THREE.GLTFLoader()

  loader.load(
    'models/flame2.gltf',
    function ( gltf ) {
      material = new THREE.MeshBasicMaterial({
        transparent: false,
        color: 0x003B71,
        opacity: 1
      });
      let sphere = new THREE.SphereGeometry(1)
      let geoPositions = gltf.scene.children[0].geometry.getAttribute('position')
      for (let i = 0; i < geoPositions.count; i++) {
        let particle = new THREE.Mesh(sphere, material)
        particle.position.x = (geoPositions.getX(i) * 30000)
        particle.position.y = (geoPositions.getY(i) * 30000)
        particle.position.z = (geoPositions.getZ(i) * 30000)
        let coords = JSON.parse(JSON.stringify(particle.position))
        originPoints.push({...coords, incremented: 0})
        parentContainer.add(particle)
      }
    },
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
    },
    function ( error ) {
      console.log( 'An error happened', error )
    }
  )

  let light = new THREE.AmbientLight( 0x404040, 10 )
  scene.add( light )
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
}
function animate() {
  requestAnimationFrame(animate)
  let points = scene.children[0].children
  for(let i = 0; i < points.length; i++) {
    if(originPoints[i].incremented > 15 ) {
      points[i].position.z = originPoints[i].z
      originPoints[i].incremented = 0
    } else if (Math.random() < .5){
      points[i].position.z -= Math.random()
      originPoints[i].incremented++
    }
  }
  renderer.render(scene, camera)
}

animate()


