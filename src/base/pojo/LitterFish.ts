import { Sprite, Text, Texture } from 'pixi.js';

export class LitterFish extends Sprite {
  direction = 0;
  private _level = 1;
  text: Text = new Text('' + this._level, { fill: '#F00', fontSize: 28 });
  constructor(texture: Texture, level: number) {
    super(texture);

    this._level = level;
    this.text.text = '' + this._level;

    this.text.anchor.set(0.5);
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
