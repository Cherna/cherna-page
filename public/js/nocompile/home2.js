$(document).ready(function() {
  // Global Variables
  var scene, camera, renderer;

  var center = new THREE.Vector3(0, 0, 0);

  var mouseX = 0;
  var mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  // Utility functions
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  };

  // function onDocMouseMove(event) {
  //   mouseX = ( event.clientX - windowHalfX ) * 10;
  //   mouseY = ( event.clientY - windowHalfY ) * 10;
  // }

  // INITIALIZATION FUNCTION

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xddeeff, 0, 38 );

    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(winWidth, winHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFShadowMap;

    camera = new THREE.PerspectiveCamera(45, winWidth / winHeight, 0.1, 200000);
    camera.position.set(0, 0, 8);
    // camera.lookAt(center);
    scene.add(camera);

    $(document).on('mousemove', function(event) {
      mouseX = ( event.clientX - windowHalfX ) * 5;
      mouseY = ( event.clientY - windowHalfY ) * 5;
    });

    var axisHelper = new THREE.AxisHelper( 5 );
    // scene.add( axisHelper );

    var gridHelper = new THREE.GridHelper( 50, 1 );
    gridHelper.setColors('#aaaaaa', '#eeeeee');
    // scene.add( gridHelper );

    window.addEventListener('resize', function() {
      var winResWidth = window.innerWidth;
      var winResHeight = window.innerHeight;
      windowHalfX = winResWidth / 2;
      windowHalfY = winResHeight / 2;
      renderer.setSize(winResWidth, winResHeight);
      camera.aspect = winResWidth / winResHeight;
      camera.updateProjectionMatrix();
    });

    var planeGeometry = new THREE.PlaneBufferGeometry( 100, 100, 1, 1 );
    var planeMaterial = new THREE.MeshBasicMaterial({
      color: '#eaeaea'
    });
    var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.y += -2;
    planeMesh.rotation.x = -0.5*Math.PI;
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);

    renderer.setClearColor('#ddeeff', 1);

    var light = new THREE.SpotLight(0xff2200, 1, 0);
    light.position.set(-50, 120, 45);
    light.castShadow = true;
    light.shadowBias = 0.0001;
    light.shadowDarkness = 0.2;
    light.shadowMapWidth = 4096;
    light.shadowMapHeight = 4096;
    scene.add(light);

    var lightOp = new THREE.SpotLight(0xaaccff, 1, 0);
    lightOp.position.set(50, 20, -35);
    // lightOp.castShadow = true;
    lightOp.shadowBias = 0.0001;
    lightOp.shadowDarkness = 0.2;
    lightOp.shadowMapWidth = 4096;
    lightOp.shadowMapHeight = 4096;
    scene.add(lightOp);

    var lightOp2 = new THREE.SpotLight(0x2288ff, 1, 0);
    lightOp2.position.set(30, 20, 40);
    // lightOp2.castShadow = true;
    lightOp2.shadowBias = 0.0001;
    lightOp2.shadowDarkness = 0.2;
    lightOp2.shadowMapWidth = 4096;
    lightOp2.shadowMapHeight = 4096;
    scene.add(lightOp2);

    var boxSize = 1,
        boxSegments = 5,
        // mainGeometry = new THREE.SphereGeometry(1, 16, 16);
        mainGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, boxSegments, boxSegments, boxSegments);
    // var texture = THREE.ImageUtils.loadTexture('assets/images/optimized/sand-texture-lq.jpg', {}, function() {
    //   renderer.render(scene, camera);
    // });

    var mainMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xcececef,
      specular: 0x797979,
      shininess: 25,
      metal: true
    });

    var mainObject = new THREE.Mesh(mainGeometry, mainMaterial);
    mainObject.name = "mainObject";
    mainObject.castShadow = true;
    scene.add(mainObject);

    function recognizeVertex(objName) {
      var obj = scene.getObjectByName(objName),
          geom = obj.geometry,
          objVertex = geom.vertices,
          objFaces = geom.faces,
          modifiedVertex = [];

      geom.verticesNeedUpdate = true;
      geom.facesNeedUpdate = true;

      for (i in objFaces) {
        var thisFace = objFaces[i],
          // Faces indexes to get vertices
            aF = thisFace.a,
            bF = thisFace.b,
            cF = thisFace.c,
          // Get every vertice that makes up the face
            aV = objVertex[aF],
            bV = objVertex[bF],
            cV = objVertex[cF];

        
        // Get the face normal
        var faceNormal = thisFace.normal;
        // aV, bV and cV all belong to the same face in every iteration
        // They can be moved safely outwards along the face normal
        // if (i >= 90 && i <= 100) {
        var rInt = randomInt(0, 2);
            rInt2 = randomInt(0, 1);
        // console.log(rInt, rInt2);
        // Three posible cases in which we decide to move one of the three vertices that make up the face
          // Check if the index of this vertex is in the modifiedVertex array
          if (rInt > 0) {
            if (!(modifiedVertex.indexOf(aF) != -1) && !(modifiedVertex.indexOf(bF) != -1) && !(modifiedVertex.indexOf(cF) != -1)) {
              // Then decide if we add or substract that face normal, moving the vertex ouside or inside the geometry
              if (rInt2 > 0) {
                var thisRanAdd = randomFloat(0, 1);
                aV.add(faceNormal.multiplyScalar(thisRanAdd));
                bV.add(faceNormal.multiplyScalar(thisRanAdd));
                cV.add(faceNormal.multiplyScalar(thisRanAdd));
              } else {
                // var thisRanSub = randomFloat(0, 1);
                //     thisRanSub2 = randomFloat(0, 0.5);
                // aV.sub(faceNormal.multiplyScalar(thisRanSub*thisRanSub2));
                // bV.sub(faceNormal.multiplyScalar(thisRanSub));
                // cV.sub(faceNormal.multiplyScalar(thisRanSub));
              }
              // Then push that vertex index to the modifiedVertex array to
              // keep track of the vertex already moved (thus preventing weird stuff?)
              modifiedVertex.push(aF);
              modifiedVertex.push(bF);
              modifiedVertex.push(cF);
            } else {
              // console.log('one of the vertex already modified');
            }
          } else {
            // console.log('not modifying, rolled 0');
          }
      }
      // console.log(modifiedVertex);
      var modifier = new THREE.SubdivisionModifier( 3 );
      modifier.modify(geom);
      geom.mergeVertices();
      geom.computeFaceNormals();
      geom.computeVertexNormals();
    }

    recognizeVertex('mainObject');

    var facesNormals = new THREE.FaceNormalsHelper(mainObject, 0.2, 0xff0000, 0.2);
    var vertexNormals = new THREE.VertexNormalsHelper(mainObject, 0.2, 0x000000, 0.2);
    var wireframe = new THREE.WireframeHelper(mainObject, 0x0000ff );
    facesNormals.name = 'facesNormals';
    // scene.add(facesNormals);
    // scene.add(wireframe);
    // scene.add(vertexNormals);
  };

  function animate(ts) {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    camera.position.x = ( mouseX - camera.position.x ) * 0.005;
    camera.position.y = ( - mouseY - camera.position.y ) * 0.001;
    // console.log(camera.position.x, camera.position.y);
    camera.lookAt( center );

    // scene.getObjectByName('mainObject').rotation.y += 0.003;
    // scene.getObjectByName('mainObject').rotation.x += 0.001;
    // scene.getObjectByName('mainObject').rotation.z += 0.002;
  }

  init();
  animate();
});