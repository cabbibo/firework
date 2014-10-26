var sun = new Page( 'sun' );

console.log( 'CC' );
console.log( G.pages );

sun.addToInitArray( function(){

  this.textChunk = [

    "Mani starred as he approached the warmth.",
    "","",
    "The movement, the Life, infront of him  was more than he could comprehend",


  ].join("\n" );

  this.textChunk2 = [

    "He know felt that he knew why the sparkles had mad him leave his friends.",
    "","",
    "Why finding his friends in the darkness meant so much to him,",
    "and how much he wanted to share this view with his bretheren. Especially Sol."
  
  ].join("\n" );



  this.textChunk3 = [

    "Thank You.",
    "",
    " @Cabbibo"

  ].join("\n" );







  this.position.set(  0 , 0 , 0 );
  this.cameraPos.set( 0 , 0 , 1000 );


  this.iPlaneDistance = 1100


  this.audioArray = [
    'hueBoy',
    'hueSparkles',
    'hueAngel',
    'hueHum',
    'hueMids'
  ];


  this.movementRate = 1.5;


}.bind( sun ) );





// Need to load at least 1 thing
sun.addToInitArray( function(){
  
  var f = 'pages/sun/';

  this.loadShader( 'sun' , f + 'ss-sun' , 'simulation' );
  this.loadShader( 'sun' , f + 'vs-sun' , 'vertex'     );
  this.loadShader( 'sun' , f + 'fs-sun' , 'fragment'   );


  var f = 'audio/global/';

  for( var i = 0; i < this.audioArray.length; i++ ){
  
    this.loadAudio( this.audioArray[i] , f + this.audioArray[i] + '.mp3' );

  }

}.bind( sun ) );


sun.addToStartArray( function(){

  G.position.copy( this.position );
  G.camera.position.copy( this.cameraPos );
  G.camera.lookAt( this.position );//= 1000;

  G.iPlaneDistance = this.iPlaneDistance;

}.bind( sun ));


sun.addToStartArray( function(){
  //G.mani.deactivate();

  this.text = new PhysicsText( this.textChunk );
  this.text2 = new PhysicsText( this.textChunk2 );
  this.text3 = new PhysicsText( this.textChunk3 );

  this.text3.distToCam.value = 400;
  this.text3.offsetPos.value.set( -9 , 40 , 0 );


  this.sun = new Sparkles( this , 64 );

  this.looper = new Looper( G.audio , G.timer , {

    beatsPerMinute: 122,
    beatsPerMeasure: 4,
    measuresPerLoop: 8

  });



  for( var i = 0;i < this.audioArray.length; i++ ){
 

    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.reconnect( this.gain );

    if( i == 0 || i == 1 ){
      
      audio.gain.gain.value = 1;

    }else{

      audio.gain.gain.value = 0;

    }

    this.looper.everyLoop( function(){ this.play() }.bind( audio ) );

  }


 this.looper.start();


}.bind( sun ) );


sun.addToActivateArray( function(){


  var offset =  G.pageTurnerOffset;

  var callback = function(){

    this.text.kill();

    this.text2.activate();

    var offset =  G.pageTurnerOffset;

    var callback = function(){

      this.text2.kill( 3000 );

      var start = { val:1 }
      var end = { val:0 }
      
      this.endingTweenVal = start;

      var tween = new G.tween.Tween( start ).to( end , 10000 );
      
      tween.onUpdate( function(t ){

        for( var i = 0;i < this.audioArray.length; i++ ){
  
          if( i !== 1 ){
            
            var audio = G.AUDIO[  this.audioArray[i] ];
            audio.gain.gain.value = 1 - t;

          }

        }

      }.bind( this ));
             
      tween.onComplete(function(){

        console.log('asdbas');
        this.text3.activate();

        var offset =  new THREE.Vector3(0 , 200 , 0 );

        var callback = function(){

          this.text3.kill();
          this.movementRate = 4;


          var tween = new G.tween.Tween( start ).to( end , 20000 );
        
          tween.onUpdate( function(t ){

            for( var i = 0;i < this.audioArray.length; i++ ){
      
              if( i === 1 ){
                
                var audio = G.AUDIO[  this.audioArray[i] ];
                audio.gain.gain.value = 1 - t;

              }

            }

          }.bind( this ));



          tween.onComplete(function(){



          }.bind( this ));


          tween.start();          

        }.bind( this );


        this.transitionMesh3 = this.createTurnerMesh( offset , callback );
        this.scene.add( this.transitionMesh3 ); 


      }.bind( this));

      tween.start();


    }.bind( this );

        
    this.transitionMesh2 = this.createTurnerMesh( offset , callback );

    setTimeout( function(){
      this.scene.add( this.transitionMesh2 );
    }.bind( this ) , 3000 );

  }.bind( this );

  this.transitionMesh1 = this.createTurnerMesh( offset , callback );

  this.scene.add( this.transitionMesh1 );
  

}.bind( sun ) );

sun.addToActivateArray( function(){

  this.text.activate();

  this.sun.activate();
    
  for( var i = 0;i < this.audioArray.length; i++ ){

    console.log(this.audioArray[i]);
    var audio = G.AUDIO[  this.audioArray[i] ];
    audio.gain.gain.value = 1;

  }

 // this.endMesh.add( this );

}.bind( sun ));


sun.addToActiveArray( function(){

  this.sun.update();
  this.text.update();
  this.text2.update();
  this.text3.update();
  

  //this.position.x += this.movementRate;
  //G.camera.position.x += this.movementRate;
  G.position.copy( this.position );
  G.camera.lookAt( this.position );//= 1000;


}.bind( sun ));


sun.addToDeactivateArray( function(){

  this.text.kill();

}.bind( sun) );


sun.addToEndArray( function(){

  this.looper.end();
  this.sun.deactivate();

}.bind( sun) );




