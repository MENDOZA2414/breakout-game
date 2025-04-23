let pelota;
let barra;
let bloques = [];
let lanzada = false;
let izquierdaPresionada = false;
let derechaPresionada = false;
let vidas = 3;
let score = 0;
let nivel = 1;
let mostrandoTransicion = false;
let tiempoTransicionFin = 0;
let textoTransicion = "";
let sonidoRebote, sonidoBloque, sonidoCaida, sonidoLanzar;
let sonidoGameOver, sonidoVictoria, sonidoSiguienteNivel;
let juegoTerminado = false;
let sonidoGameOverReproducido = false;
let botonReinicio;
let botonMostrado = false;
let activarGameOver = false;
let esVictoria = false;
let mute = false;
let tamañoIcono = 50;

function setup() {
  createCanvas(620, 600).position((windowWidth - width) / 2, (windowHeight - height) / 2);
  barra = new Barra();
  pelota = new Pelota(barra);
  document.body.style.backgroundColor = '#000000';
  crearBloques();
}

function draw() {
  background('#1C1820');

  if (mostrandoTransicion) {
    fill('#FFD700');
    stroke(0);
    strokeWeight(3);
    textAlign(CENTER, CENTER);
    textSize(64);
    textStyle(BOLD);
    text(textoTransicion, width / 2, height / 2);
  
    if (frameCount >= tiempoTransicionFin) {
      mostrandoTransicion = false;
  
      if (textoTransicion === "¡NIVEL 2!") {
        pasarANivel2();
      } else if (textoTransicion === "¡NIVEL 3!") {
        pasarANivel3();
      } else if (textoTransicion === "¡GANASTE!") {
        noLoop();
      }
    }
  
    return;
  }
  

  // Mostrar corazones
  for (let i = 0; i < 3; i++) {
    dibujarCorazon(60 + i * 35, 37, 34, i < vidas);
  }

  // Mostrar score
  fill(255);
  noStroke();
  textSize(32);
  textAlign(CENTER, TOP);
  text(nf(score, 5), width / 2, 20);

  for (let bloque of bloques) {
    bloque.mostrar();
  }

  if (!lanzada) {
    pelota.x = barra.x + barra.ancho / 2;
    pelota.y = barra.y - pelota.radio;
  } else {
    pelota.mover();
    pelota.rebotar();
  }

  if (pelota.y - pelota.radio > height) {
    vidas = max(0, vidas - 1);
    sonidoCaida.play();

    if (vidas > 0) {
      reiniciarPosicionPelota();
    } else {
      activarGameOver = true;
    }
  }

  pelota.mostrar();
  barra.direccion = izquierdaPresionada && !derechaPresionada ? -1 : derechaPresionada ? 1 : 0;
  barra.mover();
  barra.mostrar();
  pelota.revisarBarra(barra);
  pelota.revisarBloques(bloques);

  verificarTransiciones();

  if (juegoTerminado) {
    if (!esVictoria) mostrarGameOver();
    if (!botonMostrado) {
      crearBotonReinicio();
      botonMostrado = true;
    }
    noLoop();
  }

  if (activarGameOver) {
    juegoTerminado = true;
    if (!sonidoGameOverReproducido) {
      sonidoGameOver.play();
      sonidoGameOverReproducido = true;
    }
    activarGameOver = false;
  }

  dibujarIconoSonido(width - tamañoIcono - 30, 10, tamañoIcono, mute);
}

function reiniciarPosicionPelota() {
  lanzada = false;
  pelota.velX = 0;
  pelota.velY = 0;
  barra.x = width / 2 - barra.ancho / 2;
  pelota.x = barra.x + barra.ancho / 2;
  pelota.y = barra.y - pelota.radio;
}

function verificarTransiciones() {
  const todosDestruidos = bloques.every(b => !b.visible);
  if (todosDestruidos && nivel === 1) mostrarTransicion("¡NIVEL 2!", 120);
  if (todosDestruidos && nivel === 2) mostrarTransicion("¡NIVEL 3!", 120);
  if (nivel === 3 && bloques.filter(b => b.visible && !b.indestructible).length === 0) {
    juegoTerminado = true;
    esVictoria = true;
    mostrarVictoria();
    if (!botonMostrado) {
      sonidoVictoria.play();
      crearBotonReinicio();
      botonMostrado = true;
    }
    noLoop();
  }
}

function preload() {
  sonidoRebote = loadSound('sonido/pelota.mp3');
  sonidoBloque = loadSound('sonido/bloque.mp3');
  sonidoCaida = loadSound('sonido/caida.mp3');
  sonidoLanzar = loadSound('sonido/lanzarPelota.mp3');
  sonidoGameOver = loadSound('sonido/gameOver.mp3');
  sonidoVictoria = loadSound('sonido/victoria.mp3');
  sonidoSiguienteNivel = loadSound('sonido/siguienteNivel.mp3');
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) izquierdaPresionada = true;
  if (keyCode === RIGHT_ARROW) derechaPresionada = true;

  if ((key === ' ' || keyCode === UP_ARROW) && !lanzada) {
    lanzada = true;
    sonidoLanzar.play();
    const direccion = random([-1, 1]);
    if (nivel === 1) {
      pelota.velX = direccion * random(4, 4.5); 
      pelota.velY = -6;                         
    } else if (nivel === 2) {
      pelota.velX = direccion * random(4.5, 5);
      pelota.velY = -6.5;
    } else if (nivel === 3) {
      pelota.velX = direccion * random(5.5, 6);
      pelota.velY = -7;
    }
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) izquierdaPresionada = false;
  if (keyCode === RIGHT_ARROW) derechaPresionada = false;
}

function mousePressed() {
  let x = width - tamañoIcono - 30;
  let y = 10;
  if (mouseX >= x && mouseX <= x + tamañoIcono && mouseY >= y && mouseY <= y + tamañoIcono) {
    mute = !mute;
    let volumen = mute ? 0 : 1;
    sonidoRebote.setVolume(volumen);
    sonidoBloque.setVolume(volumen);
    sonidoCaida.setVolume(volumen);
    sonidoLanzar.setVolume(volumen);
    sonidoGameOver.setVolume(volumen);
    sonidoVictoria.setVolume(volumen);
    sonidoSiguienteNivel.setVolume(volumen);
  }
}

function windowResized() {
  resizeCanvas(620, 600);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
