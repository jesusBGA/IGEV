var scene, renderer, cameras, camera, helper;

init();

function init(){
    scene = new THREE.Scene();

    //Variables de entorno
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width/height;

    //Creación de la cámara
    const mainC = new THREE.PerspectiveCamera( 40, aspect, 0.1, 1000 );
    mainC.position.set(0, 80, 200);
    scene.add(mainC);
    camera = mainC

    //Posicion y orientacion de la luz
    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set( 1, 10, 6);
    scene.add(light);

    //Creación del suelo
    const groundGeometry = new THREE.PlaneGeometry(300, 300);
    const groundMaterial = new THREE.MeshPhongMaterial({color: 0xCC8866});
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = Math.PI * -.5;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    //Añadimos el render al html
    renderer = new THREE.WebGLRenderer();//var renderer = new THREE.WebGLRenderer( { canvas: artifactCanvas } );
    renderer.setSize( window.innerWidth-200, window.innerHeight-200 );
    document.getElementById('Container').appendChild(renderer.domElement);

    //Controles
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.update();

    //Dimensiones del jeep
    const carWidth = 40;
    const carHeight = 20;
    const carLength = 25;
    const backCarHeight = 10;
    const frontCarHeight = 12.5;

    //Jeep
    const jeep = new THREE.Object3D();
    scene.add(jeep);
    for(let x=0; x<3; x++){
        var bodyMaterial = new THREE.MeshPhongMaterial({color: 0x6688AA});
        if(x==0){
            var bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength);
            var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
            bodyMesh.position.y = 20;
        } else if(x==1){
            var bodyGeometry = new THREE.BoxGeometry(carWidth, backCarHeight, carLength);
            var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
            bodyMesh.position.y = 15;
            bodyMesh.position.x = 30;
        }else{
            var bodyGeometry = new THREE.BoxGeometry(carWidth, frontCarHeight, carLength);
            var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
            bodyMesh.position.y = 16.25;
            bodyMesh.position.x = -15;
        }
        jeep.add(bodyMesh);
    }

    //Dimensión de las ruedas
    const wheelRadius = 7;
    const wheelThickness = 5;
    const wheelSegments = 6;

    //Ruedas del jeep
    const wheelGeometry = new THREE.CylinderGeometry(
        wheelRadius,        // Radio superior
        wheelRadius,        // Radio inferior
        wheelThickness,     // Altura
        wheelSegments);     // Lados
    const wheelMaterial = new THREE.MeshPhongMaterial({color: 0x888888});
    
    //Posición ruedas Jeep
    var altura = -10;
    var prof = 15;
    var lateral1 = -10;
    var lateral2 = 20;
    var lateral3 = 50;
    const wheelPositions = [
        [ lateral1, altura,  prof],    //Rueda 1era izq
        [ lateral2, altura,  prof],    //Rueda 2a izq
        [ lateral3, altura,  prof],    //Rueda 3era izq
        [ lateral1, altura,  -prof],    //Rueda 1era derecha
        [ lateral2, altura,  -prof],    //Rueda 2a derecha
        [ lateral3, altura,  -prof],    //Rueda 3era derecha
        ];
    const wheelMeshes = wheelPositions.map((position) => {
        const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        mesh.position.set(...position);
        mesh.rotation.z = Math.PI * .5;
        mesh.rotation.y = Math.PI * .5;
        mesh.castShadow = true;
        bodyMesh.add(mesh);
        return mesh;
    });

    update();
}

//Actualiza y renderiza
function update(){
    requestAnimationFrame( update );
    renderer.render( scene, camera );
}