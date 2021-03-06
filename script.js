//Erick is cool by Johnny Urosevic
//Set up canvas
var canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//Define some variables
var midx = canvas.width / 2;
var midy = canvas.height / 2;
var FPS = 30;
var frame_counter = 1;
var rect = document.getElementById("canvas").getBoundingClientRect();
var fontBase = canvas.width + 2 * (canvas.width / 6);
//Cheat code variables
var cheat_exists = false;
var combo = "";
var heads_per_click = 1;
var konami_mode = false;
var konami_boost = 1;
var hydra_mode = false;
var spin_boost = 1;
var ram_head = "http://i.imgur.com/fMgakDZ.png";
var ram_mode = false;
var heart_mode = false;
var main_song = document.getElementById("main_song"); 
var num_heads = 1;
// Get canvas offset
var offset = {
    x: rect.left,
    y: rect.top
};
//Utilities
function getFont(fontSize, font) {
    var ratio = fontSize / fontBase;   
    var size = canvas.width * ratio;   
    return (size|0) + 'px ' + font;
}
var neg_or_pos = function(){
  num = Math.floor(Math.random()*2);
    if (!num){
        num = -1;
    }
    return num;
};
function drawImageRot(img,x,y,width,height,deg){
//Convert degrees to radian 
var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);

    //reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}
var randNum = function (min, max){
    return Math.random() * ( max - min ) + min;
};
var draw_array = function(list){
    for (var i = 0; i < list.length; i++) {
        list[i].draw();
    }  
};
var update_array = function(list){
    for (var i = 0; i < list.length; i++) {
        list[i].update();
    }
};
//React to inputs
//Create Ericks on mouse click
window.onmousedown = function(e) {
    // IE doesn't always have e here
    e = e || window.event;
    num_heads += heads_per_click;
  
    var location = {
        x: e.pageX - offset.x,
        y: e.pageY - offset.y
    };
    for (var i = 0; i < heads_per_click; i++){
      create_head(location);
    }
    };
//Cheat codes constructor
function cheat_code(cheat, func){
    this.cheat = cheat;
    this.func = func; 
}
//Codes
var konami = new cheat_code("38384040373937396665", function(){
		konami_mode = true; 
		FPS *= 10; 
		konami_boost *= 100;
		clearInterval(main_loop);
		main_loop = setInterval(tick, 1000 / FPS);
	}
);
var hydra = new cheat_code("7289688265", function(){heads_per_click += 5;});
var vidya = new cheat_code("8673688965", function(){
	alert("Starting awesome secret game...");
    alert("ERROR NOT ENOUGH RAM.\nLinking you to download more ram...");
    window.open("http://upload.wikimedia.org/wikipedia/commons/8/80/Bighorn_ram_animal_ovis_canadensis.jpg");
    ram_mode = true;
    for(var i = 0; i < heads.length; i++){
		heads[i].img.src=ram_head;
		heads[i].width=200;
		heads[i].height=141;
	}
	clearInterval(main_loop);
	main_loop = setInterval(tick, 1000 / FPS);
	}
);
var spin = new cheat_code("7769658483807378", function(){spin_boost *= 10;});
var love = new cheat_code("6982736775886765897665" , function(){
	for(var i = 0; i < heads.length; i++){
        heads[i].img.src="http://i.imgur.com/X7V1pcL.png";
		heart_mode=true;
		}
	}
);
var cotton = new cheat_code("677984847978", function(){
	main_song.setAttribute('src','http://eros.vlo.gda.pl/~mrproper/Rednex%20-%20Cotton%20Eyed%20Joe.mp3');
	main_song.pause(); 
	main_song.play();
	}
 );
//Code array
var codes = [konami, hydra, vidya, spin, love, cotton];
//Check codes
window.onkeydown = function(e) {
    // IE stuff
    e = e || window.event;

    // Get keycode
    code = e.keyCode || e.which;
    combo += code;
        for(var i = 0; i < codes.length; i++){
          if (codes[i].cheat[0] === combo[0] && codes[i].cheat[1] === combo[1]){
             current_cheat = codes[i];
             cheat_exists = true;
             break;
          }
          if(!cheat_exists){
            combo = "" + code;
          }
    }
    if(cheat_exists){
      if(combo === current_cheat.cheat){
        current_cheat.func();
        combo = "";
        cheat_exists = false;
      }
       else{
        for (i = 0; i < combo.length; i++){
           if(combo[i] != current_cheat.cheat[i]) {
                combo = "" + code;
                cheat_exists = false;
                break;
              }
        }
      }
    }
};
//Rainbow
var colors = ['red','orange', 'yellow', 'green', 'blue', 'purple'];
function draw_rainbow() {                            
    if(frame_counter){
    dx = canvas.width / colors.length; 
    for(var i = 0; i < colors.length; i++) {        
      ctx.fillStyle = colors[i];         
      ctx.fillRect(i * dx, 0, dx, canvas.height);
    }
    colors = colors.slice(1, colors.length).concat(colors.slice(0, 1));
    }
    frame_counter *= -1;
}
var draw_text = function(){
    ctx.font=getFont(150, 'Comic Sans MS');
    ctx.textAlign = "center";
    ctx.fillText("Erick is Cool", midx, midy - 100);
    
  
    ctx.font=getFont(50, 'Comic Sans MS');
    ctx.fillText("Number of Ericks: " + num_heads, midx, canvas.height / 10);
};
//Create heads
function head(x, y, vx, vy, dir) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.rotation = 0;
  this.dir = dir;
  this.img = new Image();
  if(ram_mode){
      this.img.src = ram_head;
      this.width = 200;
      this.height = 141;
  }
  else if(heart_mode){
       this.img.src= "http://i.imgur.com/X7V1pcL.png";
       this.width = 138;
       this.height = 192;
  }
  else{
       this.img.src= "http://i.imgur.com/73iMdFh.png";
       this.width = 138;
       this.height = 192;
  }
  this.draw= function() {
	drawImageRot(this.img,this.x,this.y,this.width,this.height,this.rotation);
  };
  this.update = function() {
        this.x += (this.vx * konami_boost) / FPS;
        this.y += (this.vy * konami_boost) / FPS;
        // Collision detection
        if (this.x < 0) {
            this.x = 0;
            this.vx = -this.vx;
        }
        if (this.x > canvas.width - this.width) {
            this.x = canvas.width - this.width;
            this.vx = -this.vx;
        }
        if ( this.y < 0 ) {
            this.y = 0;
            this.vy = -this.vy;
        }
        if ( this.y > canvas.height - this.height ) {
            this.y = canvas.height - this.height;
            this.vy = -this.vy;
        }
        this.rotation += 4 * dir * spin_boost;
    };
 
}
//Set up first head
main_head = new head(midx, midy, 200, 200, 1);
//head array
var heads = [main_head];
//Create more heads
var create_head = function(position){
    vx = randNum(100, 200) * neg_or_pos(); 
    vy = randNum(100, 200) * neg_or_pos();
    dir = neg_or_pos();
    heads.push(new head(position.x - 68 ,position.y - 92 ,vx,vy,dir)); 
};
//Display
function draw() {
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
    draw_rainbow();
    draw_array(heads);
    draw_text();
}
//Website loop update
function update() {
    update_array(heads);
}
//Website loop
function tick() {
    update();
    draw();
}
main_loop = setInterval(tick, 1000 / FPS);