import { Assets, Container, Texture, Ticker } from 'pixi.js';
import { LitterFish } from '../base/pojo/LitterFish';
import { PlayerFish } from '../base/pojo/PlayerFish';
import TouchableText from '../base/ui/TouchableText';
import { rondom } from '../utils';

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

  //
  ticker: Ticker | null = null;
  countTime = 0;
  update = ({ deltaMS }: Ticker) => {
    console.log('update');

    this.countTime += deltaMS;

    // 添加小鱼
    if (this.countTime >= 1200) {
      this.countTime = 0;
      this.addLittleFish();
    }

    // 移动小鱼
    for (let litterFish of this.litterFishArr) {
      litterFish.x += litterFish.direction === 0 ? 1 : -1;
    }
    // 移动玩家控制的鱼
    let plusSpeed = Math.floor(this.playerFish!.level / 50) / 2;

    this.playerFish?.speed.down && (this.playerFish.y = this.playerFish.y + 2 + plusSpeed);
    this.playerFish?.speed.up && (this.playerFish.y = this.playerFish.y - 2 - plusSpeed);
    this.playerFish?.speed.left && (this.playerFish.x = this.playerFish.x - 2 - plusSpeed);
    this.playerFish?.speed.right && (this.playerFish.x = this.playerFish.x + 2 + plusSpeed);

    //
    this.litterFishArr = this.litterFishArr.filter((item) => {
      if (item.x < 0 || item.x > this.width) {
        this.removeChild(item);
        return false;
      }
      return true;
    });

    // 检查是否碰撞
    let { isHit, litterFish } = this.checkIsHit();

    if (isHit) {
      this.removeChild(litterFish!);
      this.litterFishArr = this.litterFishArr.filter((item) => item !== litterFish);
      //
      console.log(this.playerFish!.level, litterFish?.level);
      this.playerFish!.level = this.playerFish!.level + litterFish?.level!;
      console.log(this.playerFish!.level, litterFish);

      this.playerFish!.scale.set(1 + (this.playerFish!.level / 100) * 0.6);
    }
  };

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
  start = (text: TouchableText | null) => {
    if (text != null) this.removeChild(text);

    this.textures?.then((textures) => {
      // 添加玩家所控制的鱼
      this.playerFish = new PlayerFish(textures['/fish/self-r.png']);
      this.playerFish.x = this.width / 2;
      this.playerFish.y = this.height / 2;
      this.playerFish.anchor.set(0.5);
      this.playerFish!.scale.set(1 + (this.playerFish.level / 100) * 0.6);
      this.addChild(this.playerFish);
      //

      // 添加事件
      this.addEvent(textures);
    });

    // 更新画布
    this.ticker = Ticker.shared.add(this.update, this);
  };

  // 添加小鱼的方法
  addLittleFish = () => {
    this.textures?.then((textures) => {
      const isL2R = Math.random() < 0.5;

      const index = Math.floor(Math.random() * 7);

      const texture = textures[`/fish/fish${index + 1}-${isL2R ? 'l' : 'r'}.png`];
      const littleFish = new LitterFish(texture, rondom(this.playerFish!.level, this.playerFish!.level));

      littleFish.x = isL2R ? 0 : this.width;
      littleFish.y = Math.random() * (this.height - 200) + 100;
      littleFish.anchor.set(0.5);
      // 增加的属性
      littleFish.direction = isL2R ? 0 : 1;
      littleFish.scale.set((1 + littleFish.level / 100) * 0.3);
      this.addChild(littleFish);
      this.litterFishArr.push(littleFish);

      //
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
  checkIsHit(): { isHit: boolean; litterFish: LitterFish | null } {
    for (let i = 0; i < this.litterFishArr.length; i++) {
      const litterFish = this.litterFishArr[i];

      const playerBounds = this.playerFish!.getBounds();
      const litterBounds = litterFish.getBounds();

      const checkTopOrDownHit = () => {
        //判断玩家的鱼是下边挨到
        if (playerBounds.y < litterBounds.y && playerBounds.y + playerBounds.height > litterBounds.y) {
          return true;
        }
        //判断玩家的鱼是上边挨到
        if (playerBounds.y > litterBounds.y && playerBounds.y < litterBounds.y + litterBounds.height) {
          return true;
        }
      };

      // 玩家鱼和小鱼都是从左向右移动
      if (this.playerFish?.direction === 0 && litterFish.direction === 0 && playerBounds.x < litterBounds.x && playerBounds.x + playerBounds.width > litterBounds.x) {
        if (checkTopOrDownHit()) {
          if (this.playerFish?.level! == litterFish.level) {
            continue;
          } else if (this.playerFish?.level! < litterFish.level) {
            alert('游戏结束，最后得分为：' + this.playerFish?.level + ', 点击确定重新开始游戏');
            this.reStart();
            return { isHit: false, litterFish: null };
          } else if (this.playerFish?.level! > litterFish.level) {
            return { isHit: true, litterFish };
          }
        }
      }

      // 玩家鱼和小鱼都是从右向左移动
      if (this.playerFish?.direction === 1 && litterFish.direction === 1 && playerBounds.x > litterBounds.x && playerBounds.x < litterBounds.x + litterBounds.width) {
        if (checkTopOrDownHit()) {
          if (this.playerFish?.level! == litterFish.level) {
            continue;
          } else if (this.playerFish?.level! < litterFish.level) {
            alert('游戏结束，最后得分为：' + this.playerFish?.level + ', 点击确定重新开始游戏');
            this.reStart();
            return { isHit: false, litterFish: null };
          } else if (this.playerFish?.level! > litterFish.level) {
            return { isHit: true, litterFish };
          }
        }
      }

      // 玩家鱼从左向右，小鱼从右向左
      if (this.playerFish?.direction === 0 && litterFish.direction === 1 && playerBounds.x < litterBounds.x && playerBounds.x + playerBounds.width > litterBounds.x) {
        if (checkTopOrDownHit()) {
          if (this.playerFish?.level! == litterFish.level) {
            continue;
          } else if (this.playerFish?.level! < litterFish.level) {
            alert('游戏结束，最后得分为：' + this.playerFish?.level + ', 点击确定重新开始游戏');
            this.reStart();
            return { isHit: false, litterFish: null };
          } else if (this.playerFish?.level! > litterFish.level) {
            return { isHit: true, litterFish };
          }
        }
      }

      // 玩家鱼从右向左，小鱼从左向右
      if (this.playerFish?.direction === 1 && litterFish.direction === 0 && playerBounds.x > litterBounds.x && playerBounds.x < litterBounds.x + litterBounds.width) {
        if (checkTopOrDownHit()) {
          if (this.playerFish?.level! == litterFish.level) {
            continue;
          } else if (this.playerFish?.level! < litterFish.level) {
            alert('游戏结束，最后得分为：' + this.playerFish?.level + ', 点击确定重新开始游戏');
            this.reStart();
            return { isHit: false, litterFish: null };
          } else if (this.playerFish?.level! > litterFish.level) {
            return { isHit: true, litterFish };
          }
        }
      }
    }

    return { isHit: false, litterFish: null };
  }

  reStart() {
    console.log('remove');

    Ticker.shared.remove(this.update, this);
    this.removeChild(this.playerFish!);
    this.litterFishArr.forEach((item) => {
      this.removeChild(item);
    });
    this.litterFishArr = [];
    this.playerFish = null;
    this.countTime = 0;
    
    //
    this.start(null);
  }
}
