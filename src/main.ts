
import { makeMap } from "./utils";
import {
  makeBirdEnemy,
  makeFlameEnemy,
  makeGuyEnemy,
  makePlayer,
  setControls,
} from "./entities";
import { globalGameState } from "./state";
import { k } from "./kaboomCtx";
import { TextAlign } from "kaboom";


function showInfoPopup() {
  const centerX = k.width() / 3;
  const centerY = k.height() / 2;

  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0), k.fixed()]);

  const welcomeText = "--Controls--";
  const infoText = " Arrows to Move \n X to Jump \n  Z to Swallow Enemies";
  const startText = ">Press SPACE to start<";

  const textConfig = {
    size: 24, // Font size
    align: "center" as TextAlign,
  };

  // Calculate text heights
  const welcomeTextHeight = k.height() * 0.3;
  const infoTextHeight = welcomeTextHeight + 50; // Offset from welcomeText
  const startTextHeight = centerY + 50; // Offset from centerY

  k.add([
    k.text(welcomeText, { ...textConfig }),
    k.pos(centerX + 70, welcomeTextHeight),
    { origin: "center" },
  ]);

  k.add([
    k.text(infoText, { ...textConfig, size: 18 }),
    k.pos(centerX, infoTextHeight),
    { origin: "center" },
  ]);

  k.add([
    k.text(startText, { ...textConfig, size: 24 }),
    k.pos(centerX, startTextHeight),
    { origin: "center" },
  ]);

  k.onKeyPress("space", () => {
    k.go("level-1");
  });
}


  

async function gameSetup() {
    showInfoPopup()
  k.loadSprite("assets", "./kirby-like.png", {
    sliceX: 9,
    sliceY: 10,
    anims: {
      kirbIdle: 0,
      kirbInhaling: 1,
      kirbFull: 2,
      kirbInhaleEffect: { from: 3, to: 8, speed: 15, loop: true },
      shootingStar: 9,
      flame: { from: 36, to: 37, speed: 4, loop: true },
      guyIdle: 18,
      guyWalk: { from: 18, to: 19, speed: 4, loop: true },
      bird: { from: 27, to: 28, speed: 4, loop: true },
    },
  });
  
  k.loadSprite("level-1", "./level-1.png");
  k.loadSprite("level-2", "./level-2.png");

  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0), k.fixed()]);

  const { map: level1Layout, spawnPoints: level1SpawnPoints } = await makeMap(
    k,
    "level-1"
  );

  const { map: level2Layout, spawnPoints: level2SpawnPoints } = await makeMap(
    k,
    "level-2"
  );

  k.scene("info", () => {
    showInfoPopup();
  });

  k.scene("level-1", async () => {
    globalGameState.setCurrentScene("level-1");
    globalGameState.setNextScene("level-2");
    k.setGravity(2100);
    k.add([
      k.rect(k.width(), k.height()),
      k.color(k.Color.fromHex("#f7d7db")),
      k.fixed(),
    ]);

    k.add(level1Layout);

    const kirb = makePlayer(
      k,
      level1SpawnPoints.player[0].x,
      level1SpawnPoints.player[0].y
    );

    setControls(k, kirb);
    k.add(kirb);
    k.camScale(k.vec2(0.7));
    k.onUpdate(() => {
      if (kirb.pos.x < level1Layout.pos.x + 432)
        k.camPos(kirb.pos.x + 500, 800);
    });

    for (const flame of level1SpawnPoints.flame) {
      makeFlameEnemy(k, flame.x, flame.y);
    }

    for (const guy of level1SpawnPoints.guy) {
      makeGuyEnemy(k, guy.x, guy.y);
    }

    for (const bird of level1SpawnPoints.bird) {
      const possibleSpeeds = [100, 200, 300];
      k.loop(10, () => {
        makeBirdEnemy(
          k,
          bird.x,
          bird.y,
          possibleSpeeds[Math.floor(Math.random() * possibleSpeeds.length)]
        );
      });
    }
  });

  k.scene("level-2", () => {
    globalGameState.setCurrentScene("level-2");
    globalGameState.setNextScene("end");
    k.setGravity(2100);
    k.add([
      k.rect(k.width(), k.height()),
      k.color(k.Color.fromHex("#f7d7db")),
      k.fixed(),
    ]);

    k.add(level2Layout);
    const kirb = makePlayer(
      k,
      level2SpawnPoints.player[0].x,
      level2SpawnPoints.player[0].y
    );

    setControls(k, kirb);
    k.add(kirb);
    k.camScale(k.vec2(0.7));
    k.onUpdate(() => {
      if (kirb.pos.x < level2Layout.pos.x + 2100)
        k.camPos(kirb.pos.x + 500, 800);
    });

    for (const flame of level2SpawnPoints.flame) {
      makeFlameEnemy(k, flame.x, flame.y);
    }

    for (const guy of level2SpawnPoints.guy) {
      makeGuyEnemy(k, guy.x, guy.y);
    }

    for (const bird of level2SpawnPoints.bird) {
      const possibleSpeeds = [100, 200, 300];
      k.loop(10, () => {
        makeBirdEnemy(
          k,
          bird.x,
          bird.y,
          possibleSpeeds[Math.floor(Math.random() * possibleSpeeds.length)]
        );
      });
    }
  });

  k.scene("end", () => {
    
    const bg = k.add([
        k.rect(k.width(), k.height()), 
        k.color(0, 0, 0),  
        
    ]);

    // Display "You Win" text
    const text = k.add([
        k.text("You Win", { size: 24 }),
        k.pos(k.width() / 2, k.height() / 2), 
        { origin: "center" },
        
    ]);
    
    const cleanup = () => {
        bg.destroy();  
        text.destroy();  
    };

    k.wait(3, cleanup);  
});


  k.go("info");
}

gameSetup();