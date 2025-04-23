// ----------------- Corazones -----------------
function dibujarCorazon(x, y, tamaño, activo) {
    push();
    translate(x, y);
    scale(tamaño / 100);
  
    if (activo) {
      fill(255);
    } else {
      fill(255, 50);
    }
    noStroke();
  
    beginShape();
    vertex(0, -30);
    bezierVertex(30, -50, 60, -10, 0, 35);
    bezierVertex(-60, -10, -30, -50, 0, -30);
    endShape(CLOSE);
    pop();
  }
  
  // ----------------- Icono de sonido -----------------
  function dibujarIconoSonido(x, y, tamaño, muteado) {
    push();
    translate(x, y);
    noStroke();
    noFill();
    rect(0, 0, tamaño, tamaño); 
  
    fill(255);
    let altavozX = tamaño * 0.1;
    let altavozY = tamaño * 0.35;
    let altavozLado = tamaño * 0.3;
    rect(altavozX, altavozY, altavozLado, altavozLado, 5);
  
    stroke(255);
    strokeWeight(2);
    noFill();
    let centroOndasX = altavozX + altavozLado - 10;
    arc(centroOndasX + 8, tamaño * 0.5, tamaño * 0.5, tamaño * 0.5, -PI / 4, PI / 4);
    arc(centroOndasX + 8, tamaño * 0.5, tamaño * 0.8, tamaño * 0.8, -PI / 4, PI / 4);
  
    if (muteado) {
      stroke(255, 0, 0);
      strokeWeight(4);
      line(tamaño * 0.05, tamaño * 0.25, tamaño * 0.75, tamaño * 0.75);
    }
  
    pop();
  }
  
  // ----------------- Transiciones -----------------
  function mostrarTransicion(texto, duracionFrames) {
    mostrandoTransicion = true;
    textoTransicion = texto;
    tiempoTransicionFin = frameCount + duracionFrames;
  
    if (texto.includes("NIVEL")) {
      sonidoSiguienteNivel.play();
    }
  }  
  
  function pasarANivel2() {
    nivel = 2;
    lanzada = false;
    barra.x = width / 2 - barra.ancho / 2;
    pelota.x = barra.x + barra.ancho / 2;
    pelota.y = barra.y - pelota.radio;
    pelota.velX = 0;
    pelota.velY = 0;
    crearBloques();
  }
  
  function pasarANivel3() {
    nivel = 3;
    lanzada = false;
    barra.x = width / 2 - barra.ancho / 2;
    pelota.x = barra.x + barra.ancho / 2;
    pelota.y = barra.y - pelota.radio;
    pelota.velX = 0;
    pelota.velY = 0;
    crearBloques();
  }
  
  // ----------------- Bloques -----------------
  function crearBloques() {
    let filas, columnas;
    let ancho = 60;
    let alto = 30;
    let espacioX = 6;
    let espacioY = 6;
    let inicioY = 80;
    let resistentes = [];
    let indestructibleKey = "";
  
    if (nivel === 1) {
      filas = 4;
      columnas = 7;
    } else if (nivel === 2) {
      filas = 5;
      columnas = 7;
    } else if (nivel === 3) {
      filas = 6;
      columnas = 7;
    }
  
    if (nivel === 3) {
      while (resistentes.length < 2) {
        let fila = floor(random(0, filas));
        let col = floor(random(0, columnas));
        let key = fila + '-' + col;
        if (!resistentes.includes(key)) resistentes.push(key);
      }
  
      let indestructibleFila = floor(random(0, filas));
      let indestructibleCol = floor(random(0, columnas));
      indestructibleKey = indestructibleFila + '-' + indestructibleCol;
    }
  
    bloques = [];
    let anchoTotal = columnas * ancho + (columnas - 1) * espacioX;
    let inicioX = (width - anchoTotal) / 2;
    let filaResistente = floor(random(0, filas));
    let colResistente = floor(random(0, columnas));
  
    let coloresPorFila = [
      '#5784E6', '#CA423E', '#EBC444',
      '#3C854B', '#C15B39', '#9C27B0'
    ];
  
    for (let fila = 0; fila < filas; fila++) {
      for (let col = 0; col < columnas; col++) {
        let x = inicioX + col * (ancho + espacioX);
        let y = fila * (alto + espacioY) + inicioY;
  
        let key = fila + "-" + col;
        let resistencia = 1;
        let indestructible = false;
  
        if (nivel === 2 && fila === filaResistente && col === colResistente) {
          resistencia = 3;
        }
  
        if (nivel === 3) {
          if (resistentes.includes(key)) {
            resistencia = 3;
          } else if (key === indestructibleKey) {
            indestructible = true;
          }
        }
  
        let baseColor = indestructible
          ? color(130, 130, 130)
          : color(coloresPorFila[fila % coloresPorFila.length]);
  
        let bloque = new Bloque(x, y, ancho, alto, baseColor, resistencia, indestructible);
        bloques.push(bloque);
      }
    }
  }
  
  // ----------------- Resultados -----------------
  function mostrarGameOver() {
    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    fill(20, 20, 20, 240);
    noStroke();
    rect(width / 2, height / 2, 360, 220, 16);
  
    fill(255);
    textStyle(BOLD);
    textSize(32);
    text("FIN DEL JUEGO", width / 2, height / 2 - 60);
  
    textSize(20);
    text("PUNTUACIÓN: " + nf(score, 5), width / 2, height / 2 - 20);
    pop();
  }
  
  function mostrarVictoria() {
    push();
    rectMode(CORNER);
    textAlign(CENTER, CENTER);
    fill(40, 40, 40, 240);
    noStroke();
    rect(0, 0, width, height);
  
    fill('#4CAF50');
    textStyle(BOLD);
    textSize(48);
    text("¡GANASTE!", width / 2, height / 2 - 60);
  
    fill(255);
    textSize(24);
    text("PUNTUACIÓN: " + nf(score, 5), width / 2, height / 2 - 10);
    pop();
  }
  
  // ----------------- Botón Reinicio -----------------
  function crearBotonReinicio() {
    botonReinicio = createButton('JUGAR DE NUEVO');
    botonReinicio.position((windowWidth - 200) / 2, (windowHeight - 40) / 2 + 30);
    botonReinicio.size(200, 40);
    botonReinicio.style('font-size', '16px');
    botonReinicio.style('background-color', '#FFFFFF');
    botonReinicio.style('border', '2px solid black');
    botonReinicio.style('font-family', 'monospace');
    botonReinicio.style('z-index', '10');
  
    botonReinicio.mousePressed(() => {
      location.reload();
    });
  
    noLoop();
  }
  
   // ----------------- Pase de Niveles -----------------
  function pasarANivel2() {
    nivel = 2;
    lanzada = false;
  
    barra.x = width / 2 - barra.ancho / 2;
    pelota.x = barra.x + barra.ancho / 2;
    pelota.y = barra.y - pelota.radio;
    pelota.velX = 0;
    pelota.velY = 0;
  
    crearBloques();
  }
  
  function pasarANivel3() {
    nivel = 3;
    lanzada = false;
    barra.x = width / 2 - barra.ancho / 2;
    pelota.x = barra.x + barra.ancho / 2;
    pelota.y = barra.y - pelota.radio;
    pelota.velX = 0;
    pelota.velY = 0;
    crearBloques();
  }
  