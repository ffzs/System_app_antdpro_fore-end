export class Weather {

  constructor(temperature, direction, speed, date = Math.floor(new Date().getTime() / 1000)) {
    this.temperature = temperature;
    this.direction = direction;
    this.speed = speed;
    this.date = date;
  }

  toObject(data) {
    Object.assign(this, data);
    return this;
  }

  toString() {
    return `Message{temperature=${ this.temperature
      }, direction=${ this.direction
      }, speed=${ this.speed
      }, date=${ this.date
      }}`;
  }
}
