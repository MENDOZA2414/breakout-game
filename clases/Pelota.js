class Pelota {
    constructor(barra) {
      this.x = width / 2;
      this.y = barra.y - this.radio;
      this.radio = 12;
      this.velX = 0;
      this.velY = 0;
    }
  
    mover() {
      this.x += this.velX;
      this.y += this.velY;
    
      if (abs(this.velX) < 0.3) {
        this.velX = random([-1, 1]) * 2;
      }
    
      if (this.x - this.radio <= 0) {
        this.x = this.radio + 1;
        this.velX = abs(this.velX); 
      }
      if (this.x + this.radio >= width) {
        this.x = width - this.radio - 1;
        this.velX = -abs(this.velX); 
      }
    }
    
  
    rebotar() {
      if (this.x - this.radio < 0 || this.x + this.radio > width) {
        this.velX *= -1;
        sonidoRebote.play();
      }
  
      if (this.y - this.radio < 0) {
        this.velY *= -1;
        sonidoRebote.play();
      }
    }
  
    mostrar() {
      noStroke();
      fill(255);
      ellipse(this.x, this.y, this.radio * 2);
    }
  
    revisarBarra(barra) {
      if (
        this.y + this.radio > barra.y &&
        this.x > barra.x &&
        this.x < barra.x + barra.ancho
      ) {
        let centroBarra = barra.x + barra.ancho / 2;
        let diferencia = this.x - centroBarra;
        let porcentaje = diferencia / (barra.ancho / 2);
  
        this.velX = porcentaje * 3;
        this.velY = -this.velY;
        sonidoRebote.play();
        this.y = barra.y - this.radio;
      }
    }
  
    revisarBloques(bloques) {
      for (let bloque of bloques) {
        if (!bloque.visible) continue;
  
        let colisionX = this.x + this.radio > bloque.x && this.x - this.radio < bloque.x + bloque.ancho;
        let colisionY = this.y + this.radio > bloque.y && this.y - this.radio < bloque.y + bloque.alto;
  
        if (colisionX && colisionY) {
          let desdeArriba = Math.abs((this.y + this.radio) - bloque.y);
          let desdeAbajo = Math.abs((this.y - this.radio) - (bloque.y + bloque.alto));
          let desdeIzq = Math.abs((this.x + this.radio) - bloque.x);
          let desdeDer = Math.abs((this.x - this.radio) - (bloque.x + bloque.ancho));
  
          let minDist = min(desdeArriba, desdeAbajo, desdeIzq, desdeDer);
  
          if (minDist === desdeArriba) {
            this.velY *= -1;
            this.y = bloque.y - this.radio - 1;
          } else if (minDist === desdeAbajo) {
            this.velY *= -1;
            this.y = bloque.y + bloque.alto + this.radio + 1;
          } else if (minDist === desdeIzq) {
            this.velX *= -1;
            this.x = bloque.x - this.radio - 1;
          } else if (minDist === desdeDer) {
            this.velX *= -1;
            this.x = bloque.x + bloque.ancho + this.radio + 1;
          }
  
          if (bloque.indestructible) {
            sonidoRebote.play();
          } else {
            sonidoBloque.play();
            let destruido = bloque.recibirGolpe();
            if (destruido) {
              score += 50;
            }
          }
  
          break;
        }
      }
    }
  }
  