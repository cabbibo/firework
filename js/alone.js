var alone = new Page( 'alone' );

alone.addToInitArray( function(){


  this.title = "Alone";
  
  this.textChunk = [

    "When Mani awoke, he was surrounded by darkness."

  ].join("\n" );


  this.textChunk2 = [

    "Mani swam through the nothingness, but could not tell if he was even moving.",
    "","",
    "The darkness reached farther than he could see, and he couldn't comprehend that there was anything on the other side of it.",
    "","",
    "However Mani was a space puppy and was curious, no matter how much darkness there was."

  ].join("\n" );


  this.textChunk3 = [

    "As Mani explored each new piece of the black, He wondered if there could be anything else."

  ].join("\n" );

  this.position.set(  0 , 0 , 0 );
  this.cameraPos.set( 0 , 0 , 2000 );
  this.cameraPos2 = new THREE.Vector3( 0 , 0 , 1000 );
  this.cameraPos3 = new THREE.Vector3( 0 , 0 , 1500 );
  this.cameraPos4 = new THREE.Vector3( 0 , 0 , 1000 );
  this.iPlaneDistance = 1000

}.bind( alone ) );

// Need to load at least 1 thing
alone.addToInitArray( function(){
  
  var f = 'audio/global/';
  this.audio =  this.loadAudio( 'hueSparkles' , f + 'hueSparkles.mp3' );

  var t = 'eden';
  this.textTexture = this.loadTexture( 'text_' + t , 'img/extras/' + t + '.png' );
  
  var t = 'sand';
  this.normalTexture = this.loadTexture( 'normal_' + t , 'img/normals/' + t + '.png' );

  var t = 'turq';
  this.iriTexture = this.loadTexture( 'iri_' + t , 'img/iri/' + t + '.png' );
  var t = 'gold';
  this.iriTextureFace = this.loadTexture( 'iri_' + t , 'img/iri/' + t + '.png' );
  
  
  var f = 'pages/alone/'
  
  this.loadShader( 'title' , f + 'vs-title' , 'vertex'     );
  this.loadShader( 'title' , f + 'fs-title' , 'fragment'   );


}.bind( alone ) );


alone.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( alone ));


alone.addToStartArray( function(){

  this.text   = new PhysicsText( this.textChunk   );
  this.text2  = new PhysicsText( this.textChunk2  );
  this.text3  = new PhysicsText( this.textChunk3  );


  this.titleTexture = G.textCreator.createTexture( this.title ,{
    size:.4,
  });

  var tt = this.titleTexture
  var scale = new THREE.Vector2( .5 , (.5 * tt.scaledHeight) / tt.scaledWidth );
 
console.log('SCALED')
  console.log( scale );

  var titleGeo = new THREE.PlaneGeometry( 1000 , 1000 , 100 , 100 );


  var uniforms = {

    t_audio: G.t_audio,
    t_normal: { type:"t" , value: this.normalTexture },
    t_iri: { type:"t" , value: this.iriTexture },
    t_iriFace: { type:"t" , value: this.iriTextureFace },
    t_text:{ type:"t" , value: this.textTexture },
    textureScale:{ type:"v2" , value: scale },
    normalScale:{ type:"f" , value: 2.4 },
    texScale:{ type:"f" , value: 1.5 },
    cameraPos:{ type:"v3" , value: G.camera.position },
    lightPos:{ type:"v3" , value: G.iPoint },
    lightCutoff:{ type:"f" , value: 400 },
    lightPower:{ type:"f" , value: 1},
    timer: G.timer,
    bumpHeight:{ type:"f" , value: 40},
    bumpSize:{ type:"f" , value: .003},
    bumpSpeed:{ type:"f" , value: .1},
    bumpCutoff:{ type:"f" , value: .4},
    opacity:{ type:"f" , value:1.},




  }

  var titleMat = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader: G.shaders.vs.title,
    fragmentShader: G.shaders.fs.title,
    transparent: true,

  });
  this.titleMesh = new THREE.Mesh( titleGeo , titleMat );
  this.titleMesh.position.z = 1500;
  this.titleOpacity = titleMat.uniforms.opacity;

  this.scene.add( this.titleMesh );


  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 122,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });

  this.looper.everyLoop( function(){ this.play() }.bind( this.audio ) );

  this.audio.reconnect( this.gain );

  this.looper.start();


}.bind( alone ) );


alone.addToActivateArray( function(){


   
  var offset = new THREE.Vector3( 0 , 0 , 100 );
  
  var callback = function(){


    var s={b:1};
    var e={b:2};

    var tween = new G.tween.Tween( s ).to( e , 3000);
  
    tween.onUpdate( function( t ){

      this.titleOpacity.value = 1- t;

    }.bind( this ));

    tween.onComplete( function( t ){

      this.tweenCamera( this.cameraPos2 , 5000 , function(){

        this.text.activate();
        this.scene.remove( this.titleMesh );
      
        var offset = G.pageTurnerOffset;
        
        var callback = function(){

          this.text.kill( 5000 );

          this.tweenCamera( this.cameraPos3 , 1000 , function(){

            this.text2.activate();

            var callback = function(){

              this.text2.kill( 5000 );
              this.tweenCamera( this.cameraPos4 , 1000 , function(){


                this.text3.activate();
                this.endMesh.add( this , G.pageTurnerOffset );




              }.bind( this ));



            }.bind( this );


            this.transitionMesh3 = this.createTurnerMesh( offset , callback );
            this.scene.add( this.transitionMesh3 );

          }.bind( this ) );

        }.bind( this );

        this.transitionMesh2 = this.createTurnerMesh( offset , callback );
        this.scene.add( this.transitionMesh2 );

      }.bind( this) );

    
    }.bind( this ));

    tween.start();




  }.bind( this );


  var mesh = this.createTurnerMesh( offset , callback );
  this.scene.add( mesh );

  mesh.scale.multiplyScalar( 300.5 )


  G.mani.activate();

}.bind( alone ));


alone.addToAllUpdateArrays( function(){

  this.text.update();
  this.text2.update();
  this.text3.update();

}.bind( alone ));


alone.addToDeactivateArray( function(){

  this.text3.kill();

}.bind( alone) );


alone.addToEndArray( function(){

  this.looper.end();

}.bind( alone ) );