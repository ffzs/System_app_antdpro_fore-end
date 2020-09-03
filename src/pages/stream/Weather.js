export class Weather {

  constructor(id, temperature, direction, speed, date) {
    this.id = id;
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
    return `Message{id=${ this.id
      }, temperature=${ this.temperature
      }, direction=${ this.direction
      }, speed=${ this.speed
      }, date=${ this.date
      }}`;
  }
}
