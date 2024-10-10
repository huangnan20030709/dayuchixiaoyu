import { Sprite, Texture } from 'pixi.js';

interface IPlayerFish {
  direction: number; // 0 从左到右， 1 从右到左
  level: number; //通过level来决定鱼的大小和速度

  speed: {
    left: number;
    right: number;
    up: number;
    down: number;
  };

}

export class PlayerFish extends Sprite implements IPlayerFish {
  direction = 0;
  level = 1;
  speed = {
    left: 0,
    right: 0,
    up: 0,
    down: 0
  };

  constructor(texture: Texture) {
    super(texture);
  }
}