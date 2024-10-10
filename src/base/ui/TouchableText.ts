import { Text, TextStyle } from 'pixi.js';

export default class TouchableText extends Text {
  //定义属性用来判断，pointup事，是否是在按下状态时触发的
  isDown = false;

  constructor(text: string, style: TextStyle, cb: () => void) {
    super({ text, style });
    this.interactive = true;
    this.cursor = 'pointer';

    this.on('pointerdown', () => {
      this.alpha = 0.5;
      this.isDown = true;
    });

    this.on('pointerupoutside', () => {
      this.alpha = 1;
    });

    this.on('pointerup', () => {
      this.alpha = 1;
      if (this.isDown) {
        cb();
        this.isDown = false;
      }
    });
  }
}
