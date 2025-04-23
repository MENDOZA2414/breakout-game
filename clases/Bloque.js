class Bloque {
    constructor(x, y, ancho, alto, colorPrincipal, resistencia = 1, indestructible = false) {
      this.x = x;
      this.y = y;
      this.ancho = ancho;
      this.alto = alto;
      this.colorPrincipal = colorPrincipal;
      this.visible = true;
      this.resistencia = resistencia;
      this.indestructible = indestructible;
  
      let r = red(colorPrincipal) * 0.7;
      let g = green(colorPrincipal) * 0.7;
      let b = blue(colorPrincipal) * 0.7;
      this.colorBorde = color(r, g, b);
    }
  
    mostrar() {
      if (this.visible) {
        let intensidad = map(this.resistencia, 1, 3, 255, 100);
        fill(red(this.colorPrincipal), green(this.colorPrincipal), blue(this.colorPrincipal), intensidad);
        stroke(this.colorBorde);
        strokeWeight(3);
        rect(this.x, this.y, this.ancho, this.alto, 8);
      }
    }
  
    recibirGolpe() {
      if (this.indestructible) return false;
  
      this.resistencia--;
      if (this.resistencia <= 0) {
        this.visible = false;
        return true;
      }
      return false;
    }
  }
  