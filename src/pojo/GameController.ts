import { Assets, Container, Rectangle, Texture, Ticker } from 'pixi.js';
import { LitterFish } from './LitterFish';
import { PlayerFish } from './PlayerFish';
import TouchableText from '../base/ui/TouchableText';

enum KeyName {
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
  UP = 'ArrowUp',
  DOWN = 'ArrowDown'
}

export class GameController extends Container {
  // 玩家控制的鱼
  playerFish: PlayerFish | null = null;
  // 所有小鱼
  litterFishArr: LitterFish[] = [];

  textures: Promise<{ [key: string]: Texture }> | null = null;
  constructor() {
    super();
    this.init();

    //
  }

  // 加载纹理
  async init() {
    // 添加玩家控制的鱼纹理
    Assets.add({ alias: '/fish/self-l.png', src: '/fish/self-l.png' });
    Assets.add({ alias: '/fish/self-r.png', src: '/fish/self-r.png' });

    // 添加随机生成的鱼纹理
    for (let i = 1; i < 8; i++) {
      Assets.add({ alias: `/fish/fish${i}-l.png`, src: `/fish/fish${i}-l.png` });
      Assets.add({ alias: `/fish/fish${i}-r.png`, src: `/fish/fish${i}-r.png` });
    }

    this.textures = Assets.load([
      '/fish/fish1-l.png',
      '/fish/fish1-r.png',
      '/fish/fish2-l.png',
      '/fish/fish2-r.png',
      '/fish/fish3-l.png',
      '/fish/fish3-r.png',
      '/fish/fish4-l.png',
      '/fish/fish4-r.png',
      '/fish/fish5-l.png',
      '/fish/fish5-r.png',
      '/fish/fish6-l.png',
      '/fish/fish6-r.png',
      '/fish/fish7-l.png',
      '/fish/fish7-r.png',
      '/fish/self-l.png',
      '/fish/self-r.png'
    ]);
  }

  // 点击开始游戏按钮后的方法
  start = (text: TouchableText) => {
    this.removeChild(text);

    this.textures?.then((textures) => {
      // 添加玩家所控制的鱼
      this.playerFish = new PlayerFish(textures['/fish/self-r.png']);
      this.playerFish.x = this.width / 2;
      this.playerFish.y = this.height / 2;
      this.playerFish.anchor.set(0.5);
      this.addChild(this.playerFish);

      // 添加事件
      this.addEvent(textures);
    });

    // 更新画布
    let countTime = 0;
    Ticker.shared.add(({ deltaMS }) => {
      countTime += deltaMS;

      // 添加小鱼
      if (countTime >= 1200) {
        countTime = 0;
        this.addLittleFish();
      }
      this.playerFish?.speed.down && (this.playerFish.y += 1);
      this.playerFish?.speed.up && (this.playerFish.y -= 1);
      this.playerFish?.speed.left && (this.playerFish.x -= 1);
      this.playerFish?.speed.right && (this.playerFish.x += 1);
      // 移动小鱼
      for (let litterFish of this.litterFishArr) {
        litterFish.x += litterFish.direction === 0 ? 1 : -1;
      }

      // 移动玩家控制的鱼

      // 检查是否碰撞
      this.checkIsHit();
    });
  };

  // 添加小鱼的方法
  addLittleFish = () => {
    this.textures?.then((textures) => {
      const isL2R = Math.random() < 0.5;

      const index = Math.floor(Math.random() * 7);

      const texture = textures[`/fish/fish${index + 1}-${isL2R ? 'l' : 'r'}.png`];
      const littleFish = new LitterFish(texture);
      littleFish.x = isL2R ? 0 : this.width;
      littleFish.y = Math.random() * (this.height - 200) + 100;
      littleFish.anchor.set(0.5);
      // 增加的属性
      littleFish.direction = isL2R ? 0 : 1;

      this.addChild(littleFish);
      this.litterFishArr.push(littleFish);
    });
  };

  // 添加事件
  addEvent(textures: { [key: string]: Texture }) {
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case KeyName.LEFT:
          this.playerFish!.speed.left = 1;
          this.playerFish!.speed.right = 0;
          this.playerFish!.texture = textures['/fish/self-r.png'];
          break;
        case KeyName.RIGHT:
          this.playerFish!.speed.right = 1;
          this.playerFish!.speed.left = 0;
          this.playerFish!.texture = textures['/fish/self-l.png'];
          break;
        case KeyName.UP:
          this.playerFish!.speed.up = 1;
          this.playerFish!.speed.down = 0;
          break;
        case KeyName.DOWN:
          this.playerFish!.speed.down = 1;
          this.playerFish!.speed.up = 0;
          break;
      }
    });

    // 监听键盘抬起事件
    window.addEventListener('keyup', (event) => {
      switch (event.key) {
        case KeyName.LEFT:
          this.playerFish!.speed.left = 0;
          break;
        case KeyName.RIGHT:
          this.playerFish!.speed.right = 0;
          break;
        case KeyName.UP:
          this.playerFish!.speed.up = 0;
          break;
        case KeyName.DOWN:
          this.playerFish!.speed.down = 0;
          break;
      }
    });
  }

  // 检查是否碰撞
  checkIsHit() {
    for (let i = 0; i < this.litterFishArr.length; i++) {
      const litterFish = this.litterFishArr[i];
      const playerBounds = this.playerFish!.getBounds();
      const litterBounds = litterFish.getBounds();
      // console.log(boundsA, boundsB);

      // 玩家鱼和小鱼都是从左向右移动
      if (this.playerFish?.direction === 0 && litterFish.direction === 0) {
        
      }
      // 玩家鱼和小鱼都是从右向左移动
      if (this.playerFish?.direction === 1 && litterFish.direction === 1) {
      }
      // 玩家鱼从左向右，小鱼从右向左
      if (this.playerFish?.direction === 0 && litterFish.direction === 1) {
      }
      // 玩家鱼从右向左，小鱼从左向右
      if (this.playerFish?.direction === 1 && litterFish.direction === 0) {
      }
    }
  }
}
