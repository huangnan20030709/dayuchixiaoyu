import { Application, Assets,   Sprite, TextStyle } from 'pixi.js';
import { useEffect, useRef } from 'react';
import { GameController } from './core/GameController';
import TouchableText from './base/ui/TouchableText';
function App() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const app = new Application();

    await app.init({ resizeTo: window });
    divRef.current?.appendChild(app.canvas);
    // 加载outer背景图
    const outerTexture = await Assets.load('/bg-outer.png');
    const outerSprite = new Sprite(outerTexture);
    outerSprite.width = window.innerWidth;
    outerSprite.height = window.innerHeight;
    app.stage.addChild(outerSprite);

    // 加载控制类
    const gameController = new GameController();
    app.stage.addChild(gameController);
    // 加载inner背景图
    const innerTexture = await Assets.load('/bg-inner.jpg');
    const innerSprite = new Sprite(innerTexture);
    innerSprite.width = app.screen.width * 0.82;
    innerSprite.height = app.screen.width * 0.41;

    gameController.x = (window.innerWidth - innerSprite.width) / 2;
    gameController.y = 60;
    gameController.addChild(innerSprite);

    // 添加开始按钮
    let text = new TouchableText(
      '开始游戏',
      new TextStyle({
        fill: '#ffffff',
        stroke: { color: '#004620', width: 12, join: 'round' },
        fontSize: 48
      }),
      () => {
        gameController.start(text);
      }
    );
    text.x = gameController.width / 2;
    text.y = app.screen.height / 2 - 20;
    text.anchor.set(0.5);
    gameController.addChild(text);

  };

  return <div ref={divRef} style={{ width: '100vw', height: '100vh' }}></div>;
}

export default App;
