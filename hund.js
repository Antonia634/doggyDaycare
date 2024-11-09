// Klass för hund, minst en hundskötare måste finnas innan denna kan skapas.
class Hund {
  constructor(namn, box, vilkenSkotare, typAvFoder, mangdFoder) {
    this.namn = namn;
    this.box = box;
    this.vilkenSkotare = vilkenSkotare;
    this.typAvFoder = typAvFoder;
    this.mangdFoder = mangdFoder;
  }

  kollaFoder() {
    alert(this.namn + " Ska ha " + this.mangdFoder + "dl av fodret " + this.typAvFoder);
  }
}
