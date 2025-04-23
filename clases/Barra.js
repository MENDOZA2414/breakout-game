class Barra {
    constructor() {
      this.ancho = 120;
      this.alto = 12;
      this.x = width / 2 - this.ancho / 2;
      this.y = height - 50;
      this.velocidad = 8;
      this.direccion = 0;
    }
  
    mover() {
      this.x += this.velocidad * this.direccion;
      this.x = constrain(this.x, 0, width - this.ancho);
    }
  
    mostrar() {
      noStroke();
      fill(255);
      rect(this.x, this.y, this.ancho, this.alto);
    }
  }