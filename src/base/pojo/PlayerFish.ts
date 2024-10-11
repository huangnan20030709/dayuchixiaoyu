import { Sprite, Text, Texture } from 'pixi.js';

export class PlayerFish extends Sprite {
  direction = 0; // 0 从左到右， 1 从右到左
  _level = 10; //通过level来决定鱼的大小和速度
  speed = {
    left: 0,
    right: 0,
    up: 0,
    down: 0
  };
  text: Text = new Text('' + this._level, { fill: '#F00', fontSize: 28 });

  constructor(texture: Texture) {
    super(texture);

    this.text.anchor.set(0.5);
    this.text.text = '' + this._level;

    this.addChild(this.text);
  }

  get level() {
    return this._level;
  }

  set level(value: number) {
    this._level = value;
    this.text.text = '' + this._level;
  }
}
