// Fernando Version - Pallet Town story scene with enterable house and lab.
(function () {
  const TILE = 32;
  const WORLD_W = 30 * TILE;
  const WORLD_H = 20 * TILE;

  const ASSET = {
    grass: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Autotiles/Light grass.png"),
    path: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Autotiles/Brick path.png"),
    tree1: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Characters/Object tree 1.png"),
    tree2: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Characters/Object tree 2.png"),
    player: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Characters/trainer_POKEMONTRAINER_Leaf.png"),
    professor: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Characters/trainer_PROFESSOR.png"),
    introBg: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Pictures/introbg.png"),
    introBase: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Pictures/introbase.png"),
    introOak: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Pictures/introOak.png"),
    introBoy: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Pictures/introBoy.png"),
    introGirl: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Pictures/introGirl.png"),
    introMarill: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Pictures/introMarill.png"),
  };

  const LINKS = {
    resume: "../assets/Banal_CV.pdf",
    github: "https://github.com/",
    projects: "../index.html#projects",
  };

  const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    parent: "game",
    backgroundColor: "#6fb9e8",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: { preload, create, update },
  };

  new Phaser.Game(config);

  function preload() {
    this.load.image("grass", ASSET.grass);
    this.load.image("path", ASSET.path);
    this.load.image("tree1", ASSET.tree1);
    this.load.image("tree2", ASSET.tree2);
    this.load.spritesheet("player", ASSET.player, { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet("professor", ASSET.professor, { frameWidth: 32, frameHeight: 48 });
    this.load.image("introBg", ASSET.introBg);
    this.load.image("introBase", ASSET.introBase);
    this.load.image("introOak", ASSET.introOak);
    this.load.image("introBoy", ASSET.introBoy);
    this.load.image("introGirl", ASSET.introGirl);
    this.load.image("introMarill", ASSET.introMarill);
  }

  function create() {
    this.routeChoice = null;
    this.starterChoice = null;
    this.currentArea = "intro";
    this.sceneMode = "title";
    this.lastFacing = "down";
    this.isTalking = false;
    this.areaObjects = [];
    this.interactions = [];
    this.activeInteraction = null;

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    createPlayer.call(this);
    createHUD.call(this);
    createIntro.call(this);
    bindInput.call(this);
    createAnimations.call(this);
    buildArea.call(this, "town");
    setAreaVisible.call(this, false);
    this.cameraText.setVisible(false);
    this.helpText.setVisible(false);
    this.routeBadge.setVisible(false);
    this.interactionHint.setVisible(false);
    this.dialog.setVisible(false);
    this.cameras.main.stopFollow();
  }

  function preloadWorld() {
    // kept for structure parity
  }

  function bindInput() {
    this.controls = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      action: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    this.input.keyboard.on("keydown-ENTER", () => handleAdvance.call(this));
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.sceneMode === "world") {
        if (this.activeInteraction) {
          activateInteraction.call(this, this.activeInteraction);
        } else {
          tryTalk.call(this);
        }
        return;
      }
      handleAdvance.call(this);
    });
  }

  function createPlayer() {
    this.player = this.physics.add.sprite(15 * TILE, 15 * TILE, "player", 0);
    this.player.setSize(20, 24).setOffset(6, 20);
    this.player.setCollideWorldBounds(true);
  }

  function createHUD() {
    this.titlePanel = this.add.rectangle(480, 600, 960, 80, 0x0d1b2a, 0.92).setScrollFactor(0).setStrokeStyle(2, 0xffffff, 0.15);
    this.routeBadge = this.add.text(24, 548, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      color: "#ffe66d",
      wordWrap: { width: 900 },
    }).setScrollFactor(0);
    this.cameraText = this.add.text(24, 566, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#f7f7f7",
      wordWrap: { width: 760 },
    }).setScrollFactor(0);
    this.helpText = this.add.text(24, 620, "Move: Arrow Keys / WASD   Interact: Space   Enter doors: Space", {
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      color: "#cde7ff",
    }).setScrollFactor(0);
    this.interactionHint = this.add.text(764, 568, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ffffff",
      align: "right",
      wordWrap: { width: 180 },
    }).setScrollFactor(0);
    this.dialog = this.add.text(24, 24, "", dialogStyle(328, 18)).setScrollFactor(0).setVisible(false).setDepth(1100);

    this.hudButtons = [
      makeHudButton.call(this, 820, 556, "R", "Resume", () => window.open(LINKS.resume, "_blank")),
      makeHudButton.call(this, 880, 556, "G", "GitHub", () => window.open(LINKS.github, "_blank")),
      makeHudButton.call(this, 940, 556, "P", "Projects", () => window.open(LINKS.projects, "_blank")),
    ];
  }

  function createAnimations() {
    createDirectionalAnimation.call(this, "walk-down", 0, 3);
    createDirectionalAnimation.call(this, "walk-left", 4, 7);
    createDirectionalAnimation.call(this, "walk-right", 8, 11);
    createDirectionalAnimation.call(this, "walk-up", 12, 15);
    createDirectionalAnimation.call(this, "professor-idle", 0, 0, "professor");
    this.player.anims.stop();
  }

  function createDirectionalAnimation(key, start, end, texture = "player") {
    this.anims.create({
      key,
      frames: this.anims.generateFrameNumbers(texture, { start, end }),
      frameRate: 6,
      repeat: -1,
    });
  }

  function createIntro() {
    this.introLayer = this.add.container(0, 0).setScrollFactor(0).setDepth(2000);
    this.introBg = this.add.image(0, 0, "introBg").setOrigin(0).setScrollFactor(0);
    this.introBase = this.add.image(480, 450, "introBase").setScrollFactor(0);
    this.introOak = this.add.image(350, 240, "introOak").setScale(0.95).setScrollFactor(0);
    this.introBoy = this.add.image(125, 390, "introBoy").setScale(0.8).setScrollFactor(0);
    this.introGirl = this.add.image(825, 390, "introGirl").setScale(0.8).setScrollFactor(0);
    this.introMarill = this.add.image(780, 270, "introMarill").setScale(0.85).setScrollFactor(0);
    this.introShade = this.add.rectangle(480, 320, 960, 640, 0x00111f, 0.2).setScrollFactor(0);
    this.introTitle = this.add.text(480, 92, "FERNANDO VERSION", {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      color: "#ffffff",
      stroke: "#0b0b0b",
      strokeThickness: 6,
      align: "center",
    }).setOrigin(0.5).setScrollFactor(0);
    this.introPrompt = this.add.text(480, 134, "PRESS ENTER", {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#ffe66d",
      align: "center",
    }).setOrigin(0.5).setScrollFactor(0);
    this.introBox = makeBox.call(this, 20, 420, 920, 190, 0x000000, 0.88, 4, 0xffffff, 0.7);
    this.introText = this.add.text(42, 442, "", dialogStyle(876, 17)).setScrollFactor(0).setDepth(2001);
    this.introCards = [];

    this.introLayer.add([
      this.introBg,
      this.introBase,
      this.introOak,
      this.introBoy,
      this.introGirl,
      this.introMarill,
      this.introShade,
      this.introTitle,
      this.introPrompt,
      this.introBox,
      this.introText,
    ]);

    setIntroPage.call(this, 0);
  }

  function buildArea(area) {
    clearAreaObjects.call(this);
    this.currentArea = area;
    this.interactions = [];
    this.walls = this.physics.add.staticGroup();

    if (area === "town") {
      buildPalletTown.call(this);
      this.player.setPosition(15 * TILE, 15 * TILE);
      this.player.setVisible(true);
      this.player.anims.stop();
      this.player.setFrame(0);
      this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
      return;
    }

    if (area === "house") {
      buildHouseInterior.call(this);
      this.player.setPosition(15 * TILE, 16 * TILE);
      this.player.setVisible(true);
      this.player.anims.stop();
      this.player.setFrame(0);
      this.cameras.main.setBounds(0, 0, 960, 640);
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
      return;
    }

    if (area === "lab") {
      buildLabInterior.call(this);
      this.player.setPosition(15 * TILE, 16 * TILE);
      this.player.setVisible(true);
      this.player.anims.stop();
      this.player.setFrame(0);
      this.cameras.main.setBounds(0, 0, 960, 640);
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    }
  }

  function buildPalletTown() {
    addAreaObject.call(this, this.add.tileSprite(0, 0, WORLD_W, WORLD_H, "grass").setOrigin(0));

    const road = [
      { x: 0, y: 12, w: 30, h: 2 },
      { x: 5, y: 10, w: 2, h: 7 },
      { x: 22, y: 8, w: 2, h: 9 },
      { x: 12, y: 10, w: 8, h: 2 },
    ];

    road.forEach((segment) => {
      addAreaObject.call(this, this.add.tileSprite(segment.x * TILE, segment.y * TILE, segment.w * TILE, segment.h * TILE, "path").setOrigin(0));
    });

    addHouse.call(this, 5 * TILE, 5 * TILE, 7 * TILE, 5 * TILE, "HOME", 0x8b4b2c, 0xc75c4a);
    addLab.call(this, 20 * TILE, 4 * TILE, 8 * TILE, 5 * TILE, "LAB", 0x4c5bd5, 0x7c8bfd);

    placeTree.call(this, 2 * TILE, 6 * TILE, "tree1");
    placeTree.call(this, 3 * TILE, 8 * TILE, "tree2");
    placeTree.call(this, 9 * TILE, 7 * TILE, "tree1");
    placeTree.call(this, 11 * TILE, 8 * TILE, "tree2");
    placeTree.call(this, 16 * TILE, 6 * TILE, "tree1");
    placeTree.call(this, 18 * TILE, 7 * TILE, "tree2");
    placeTree.call(this, 27 * TILE, 7 * TILE, "tree1");
    placeTree.call(this, 28 * TILE, 9 * TILE, "tree2");

    addSign.call(this, 14 * TILE, 13 * TILE, "PALLET TOWN");

    addInteraction.call(this, {
      label: "House Door",
      x: 8 * TILE,
      y: 10.2 * TILE,
      radius: 42,
      prompt: "Enter house",
      action: () => setAreaAndRefresh.call(this, "house", "town"),
    });

    addInteraction.call(this, {
      label: "Lab Door",
      x: 23.5 * TILE,
      y: 9.8 * TILE,
      radius: 44,
      prompt: "Enter lab",
      action: () => setAreaAndRefresh.call(this, "lab", "town"),
    });
  }

  function buildHouseInterior() {
    addAreaObject.call(this, this.add.rectangle(480, 320, 960, 640, 0xeed9b7));
    addAreaObject.call(this, this.add.rectangle(480, 300, 930, 580, 0xe7c89d).setStrokeStyle(8, 0x7a4a22, 1));
    addAreaObject.call(this, this.add.rectangle(240, 180, 240, 120, 0xd29c6b));
    addAreaObject.call(this, this.add.rectangle(720, 170, 260, 120, 0xb07b50));
    addAreaObject.call(this, this.add.rectangle(210, 470, 220, 90, 0x6e4d3a));
    addAreaObject.call(this, this.add.rectangle(540, 430, 220, 110, 0x8a6a4a));
    addAreaObject.call(this, this.add.text(480, 60, "Fernando's House", {
      fontFamily: "Arial, sans-serif",
      fontSize: "26px",
      color: "#5a3216",
      align: "center",
    }).setOrigin(0.5));
    addAreaObject.call(this, this.add.text(480, 108, "A quiet room for planning projects.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#5a3216",
      align: "center",
    }).setOrigin(0.5));

    addSolidRect.call(this, 160, 160, 640, 240, 0xffffff, 0.01);
    addSolidRect.call(this, 120, 500, 180, 90, 0xffffff, 0.01);
    addSolidRect.call(this, 650, 470, 180, 110, 0xffffff, 0.01);

    addInteraction.call(this, {
      label: "Front Door",
      x: 480,
      y: 545,
      radius: 52,
      prompt: "Return to town",
      action: () => setAreaAndRefresh.call(this, "town", "house"),
    });
  }

  function buildLabInterior() {
    addAreaObject.call(this, this.add.rectangle(480, 320, 960, 640, 0xdcecff));
    addAreaObject.call(this, this.add.rectangle(480, 300, 930, 580, 0xb5d7f7).setStrokeStyle(8, 0x274472, 1));
    addAreaObject.call(this, this.add.rectangle(210, 190, 180, 90, 0x9fb7ff));
    addAreaObject.call(this, this.add.rectangle(760, 190, 190, 90, 0x9fb7ff));
    addAreaObject.call(this, this.add.rectangle(300, 430, 280, 90, 0x6c7cff));
    addAreaObject.call(this, this.add.rectangle(620, 430, 260, 90, 0x4b5bd1));
    addAreaObject.call(this, this.add.text(480, 60, "Professor Oak's Lab", {
      fontFamily: "Arial, sans-serif",
      fontSize: "26px",
      color: "#274472",
      align: "center",
    }).setOrigin(0.5));
    addAreaObject.call(this, this.add.text(480, 108, "Research, prototypes, and starter ideas live here.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#274472",
      align: "center",
    }).setOrigin(0.5));

    this.professor = this.add.sprite(480, 270, "professor", 0).setOrigin(0.5, 0.8);
    addAreaObject.call(this, this.professor);
    this.professor.anims.play("professor-idle");

    addSolidRect.call(this, 130, 165, 700, 250, 0xffffff, 0.01);
    addSolidRect.call(this, 130, 470, 250, 90, 0xffffff, 0.01);
    addSolidRect.call(this, 560, 470, 260, 90, 0xffffff, 0.01);

    addInteraction.call(this, {
      label: "Professor Oak",
      x: 480,
      y: 270,
      radius: 80,
      prompt: "Talk to Professor Byte",
      action: () => showLabDialog.call(this),
    });

    addInteraction.call(this, {
      label: "Lab Exit",
      x: 480,
      y: 545,
      radius: 52,
      prompt: "Return to town",
      action: () => setAreaAndRefresh.call(this, "town", "lab"),
    });
  }

  function addHouse(x, y, width, height, label, wallColor, roofColor) {
    addAreaObject.call(this, this.add.rectangle(x + width / 2, y + height / 2, width, height, wallColor).setStrokeStyle(3, 0x4c2417, 1));
    addAreaObject.call(this, this.add.rectangle(x + width / 2, y + 10, width, 20, roofColor));
    addAreaObject.call(this, this.add.rectangle(x + 14, y + 18, 14, 14, 0xf7f7f7));
    addAreaObject.call(this, this.add.rectangle(x + width - 14, y + 18, 14, 14, 0xf7f7f7));
    addAreaObject.call(this, this.add.rectangle(x + width / 2, y + height - 8, 18, 24, 0x6f3b14));
    addAreaObject.call(this, this.add.text(x + width / 2, y - 20, label, {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#4a230f",
      align: "center",
    }).setOrigin(0.5));
    addSolidRect.call(this, x + 8, y + 28, width - 16, 36, 0xffffff, 0.01);
    addSolidRect.call(this, x + 8, y + 64, 18, 16, 0xffffff, 0.01);
    addSolidRect.call(this, x + width - 26, y + 64, 18, 16, 0xffffff, 0.01);
  }

  function addLab(x, y, width, height, label, wallColor, roofColor) {
    addAreaObject.call(this, this.add.rectangle(x + width / 2, y + height / 2, width, height, wallColor).setStrokeStyle(3, 0x1d2d8c, 1));
    addAreaObject.call(this, this.add.rectangle(x + width / 2, y + 10, width, 20, roofColor));
    addAreaObject.call(this, this.add.rectangle(x + 18, y + 20, 18, 18, 0xe0f0ff));
    addAreaObject.call(this, this.add.rectangle(x + width - 18, y + 20, 18, 18, 0xe0f0ff));
    addAreaObject.call(this, this.add.rectangle(x + width / 2, y + height - 8, 22, 24, 0x233c9f));
    addAreaObject.call(this, this.add.text(x + width / 2, y - 20, label, {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#1d2d8c",
      align: "center",
    }).setOrigin(0.5));
    addSolidRect.call(this, x + 8, y + 28, width - 16, 36, 0xffffff, 0.01);
    addSolidRect.call(this, x + 8, y + 64, 20, 16, 0xffffff, 0.01);
    addSolidRect.call(this, x + width - 28, y + 64, 20, 16, 0xffffff, 0.01);
  }

  function placeTree(x, y, key) {
    const tree = this.add.image(x + TILE / 2, y + TILE, key).setOrigin(0.5, 1);
    addAreaObject.call(this, tree);
    addSolidRect.call(this, x + 2, y + 20, TILE - 4, TILE - 8, 0xffffff, 0.01);
  }

  function addSign(x, y, label) {
    addAreaObject.call(this, this.add.rectangle(x, y, 112, 26, 0x7d4b2c).setStrokeStyle(2, 0x4a2a17, 1));
    addAreaObject.call(this, this.add.text(x, y - 1, label, {
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      color: "#ffffff",
      align: "center",
    }).setOrigin(0.5));
  }

  function addInteraction(interaction) {
    this.interactions.push(interaction);
    const marker = this.add.circle(interaction.x, interaction.y, 7, 0xffd166, 0.9).setStrokeStyle(2, 0x5a3318, 1);
    addAreaObject.call(this, marker);
  }

  function addSolidRect(x, y, width, height, color, alpha) {
    const rect = this.add.rectangle(x, y, width, height, color, alpha);
    this.physics.add.existing(rect, true);
    this.walls.add(rect);
    addAreaObject.call(this, rect);
    return rect;
  }

  function addAreaObject(obj) {
    this.areaObjects.push(obj);
    return obj;
  }

  function clearAreaObjects() {
    if (this.areaObjects) {
      this.areaObjects.forEach((obj) => {
        if (obj && obj.destroy) {
          obj.destroy();
        }
      });
    }
    this.areaObjects = [];
    this.interactions = [];
    if (this.walls) {
      this.walls.clear(true, true);
    }
    if (this.professor) {
      this.professor.destroy();
      this.professor = null;
    }
  }

  function setArea(area) {
    buildArea.call(this, area);
    this.cameraText.setVisible(true);
    this.helpText.setVisible(true);
    this.routeBadge.setVisible(true);
    this.interactionHint.setVisible(true);
    this.dialog.setVisible(false);
    this.sceneMode = "world";
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.routeBadge.setText(`${routeLabel(this.routeChoice)}  |  ${starterLabel(this.starterChoice)}`);
    updateHUDText.call(this);
    setWorldVisible.call(this, true);
  }

  function setAreaAndRefresh(area, returnArea) {
    this.transitionReturnArea = returnArea;
    setArea.call(this, area);
    if (area === "town") {
      this.currentArea = returnArea === "house" ? "house" : returnArea === "lab" ? "lab" : "town";
    }
  }

  function updateHUDText() {
    const descriptions = {
      town: "Pallet Town | Walk to the house or Professor Oak's lab.",
      house: "Fernandos House | Your room is quiet and full of project notes.",
      lab: "Professor Oak's Lab | Research, prototypes, and starter ideas live here.",
    };
    this.cameraText.setText(descriptions[this.currentArea] || "Pallet Town");
  }

  function setWorldVisible(visible) {
    [this.player, this.cameraText, this.helpText, this.routeBadge, this.interactionHint, this.titlePanel].forEach((item) => {
      if (item && item.setVisible) {
        item.setVisible(visible);
      }
    });
    this.areaObjects.forEach((item) => {
      if (item && item.setVisible) {
        item.setVisible(visible);
      }
    });
    if (this.walls) {
      this.walls.children.iterate((child) => {
        if (child && child.setVisible) {
          child.setVisible(visible);
        }
      });
    }
    if (this.professor && this.professor.setVisible) {
      this.professor.setVisible(visible);
    }
  }

  function update() {
    if (this.sceneMode !== "world") {
      this.introPrompt.setVisible(Math.floor(this.time.now / 500) % 2 === 0);
      return;
    }

    if (this.isTalking) {
      this.player.setVelocity(0, 0);
      return;
    }

    updateInteraction.call(this);

    const left = this.controls.left.isDown || this.controls.a.isDown;
    const right = this.controls.right.isDown || this.controls.d.isDown;
    const up = this.controls.up.isDown || this.controls.w.isDown;
    const down = this.controls.down.isDown || this.controls.s.isDown;
    const speed = 150;

    let vx = 0;
    let vy = 0;
    if (left) {
      vx = -speed;
      this.lastFacing = "left";
    } else if (right) {
      vx = speed;
      this.lastFacing = "right";
    }
    if (up) {
      vy = -speed;
      this.lastFacing = "up";
    } else if (down) {
      vy = speed;
      this.lastFacing = "down";
    }

    this.player.setVelocity(vx, vy);
    if (vx === 0 && vy === 0) {
      this.player.anims.stop();
      this.player.setFrame(facingFrame(this.lastFacing));
    } else {
      this.player.anims.play(animationForFacing(this.lastFacing), true);
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.action)) {
      if (this.activeInteraction) {
        activateInteraction.call(this, this.activeInteraction);
      } else {
        tryTalk.call(this);
      }
    }
  }

  function updateInteraction() {
    this.activeInteraction = null;
    const range = this.currentArea === "town" ? 58 : 64;
    for (let i = 0; i < this.interactions.length; i += 1) {
      const interaction = this.interactions[i];
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, interaction.x, interaction.y);
      if (distance <= range || (interaction.radius && distance <= interaction.radius)) {
        this.activeInteraction = interaction;
        this.interactionHint.setText(`${interaction.prompt}  [SPACE]`);
        this.interactionHint.setVisible(true);
        return;
      }
    }
    this.interactionHint.setText("Explore Pallet Town");
  }

  function activateInteraction(interaction) {
    interaction.action.call(this);
  }

  function tryTalk() {
    if (this.currentArea !== "lab") {
      this.dialog.setVisible(true).setText("Walk to a door or explore the town.");
      this.time.delayedCall(900, () => this.dialog.setVisible(false));
      return;
    }

    const professor = this.professor;
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, professor.x, professor.y);
    if (distance > 90) {
      this.dialog.setVisible(true).setText("Professor Byte: Come closer to talk.");
      this.time.delayedCall(900, () => this.dialog.setVisible(false));
      return;
    }

    this.isTalking = true;
    this.dialog.setVisible(true).setText(
      "Professor Byte:\nWelcome to Professor Oak's Lab.\n\nHere we research projects, applications, robots, and innovations."
    );

    this.time.delayedCall(2600, () => {
      this.dialog.setVisible(false);
      this.isTalking = false;
    });
  }

  function showLabDialog() {
    this.isTalking = true;
    this.dialog.setVisible(true).setText(
      "Professor Byte:\nThis is your lab chapter.\n\nYour portfolio can now branch into skills, services, or projects from Pallet Town."
    );
    this.time.delayedCall(2800, () => {
      this.dialog.setVisible(false);
      this.isTalking = false;
    });
  }

  function handleAdvance() {
    if (this.sceneMode === "title") {
      setIntroPage.call(this, 1);
      return;
    }
    if (this.sceneMode === "dialog") {
      setIntroPage.call(this, 2);
    }
  }

  function setIntroPage(page) {
    clearIntroCards.call(this);

    if (page === 0) {
      this.sceneMode = "title";
      this.introTitle.setVisible(true);
      this.introPrompt.setVisible(true).setText("PRESS ENTER");
      this.introText.setText("---------------------------------\n      FERNANDO VERSION\n---------------------------------");
      return;
    }

    if (page === 1) {
      this.sceneMode = "dialog";
      this.introTitle.setVisible(false);
      this.introPrompt.setVisible(true).setText("PRESS ENTER");
      this.introText.setText(
        "Professor Byte:\nWelcome to the world of technology!\n\nMy name is Professor Byte.\n\nPeople call me the Coding Professor.\n\nThis world is inhabited by projects,\napplications, robots, and innovations."
      );
      return;
    }

    if (page === 2) {
      this.sceneMode = "dialog";
      this.introPrompt.setVisible(false);
      this.introText.setText(
        "Some people build websites.\nSome develop mobile apps.\nOthers create intelligent systems.\n\nAs for Fernando...\nHe explores them all."
      );
      this.time.delayedCall(900, () => {
        if (this.sceneMode === "dialog") {
          showRouteChoice.call(this);
        }
      });
    }
  }

  function showRouteChoice() {
    clearIntroCards.call(this);
    this.sceneMode = "route-choice";
    this.introPrompt.setVisible(true).setText("PICK A JOURNEY");
    this.introText.setText("Are you a Recruiter?\nAre you a Client?\nAre you a Fellow Developer?");

    const choices = [
      { value: "recruiter", title: "Recruiter", x: 180, note: "Skills / Experience / Resume / Certifications" },
      { value: "client", title: "Client", x: 480, note: "Services / Case Studies / Pricing / Contact" },
      { value: "developer", title: "Developer", x: 780, note: "Projects / GitHub / Architecture / Blogs" },
    ];

    choices.forEach((choice) => {
      this.introCards.push(
        makeChoiceCard.call(this, choice.x, 550, 250, 90, choice.title, choice.note, () => {
          this.routeChoice = choice.value;
          showStarterChoice.call(this);
        })
      );
    });
  }

  function showStarterChoice() {
    clearIntroCards.call(this);
    this.sceneMode = "starter-choice";
    this.introPrompt.setVisible(true).setText("SELECT STARTER SPECIALIZATION");
    this.introText.setText(
      `${routeLabel(this.routeChoice)}\n\nChoose your starter specialization:`
    );

    const starters = [
      { value: "frontend", title: "Frontendmon", x: 180, note: "React / Next.js / Tailwind" },
      { value: "backend", title: "Backendmon", x: 480, note: "Node.js / APIs / Databases" },
      { value: "hardware", title: "Hardwarmon", x: 780, note: "Arduino / RFID / IoT" },
    ];

    starters.forEach((starter) => {
      this.introCards.push(
        makeChoiceCard.call(this, starter.x, 550, 250, 90, starter.title, starter.note, () => {
          this.starterChoice = starter.value;
          finalizeIntro.call(this);
        })
      );
    });
  }

  function finalizeIntro() {
    clearIntroCards.call(this);
    this.sceneMode = "starting-world";
    this.introPrompt.setVisible(true).setText("ENTER TO BEGIN");
    this.introText.setText(
      `${starterLabel(this.starterChoice)} selected.\n\nThe map opens in Pallet Town.`
    );

    this.time.delayedCall(1000, () => {
      this.introLayer.setVisible(false);
      setArea.call(this, "town");
      this.currentArea = "town";
      this.sceneMode = "world";
      this.cameraText.setVisible(true);
      this.helpText.setVisible(true);
      this.routeBadge.setVisible(true);
      this.interactionHint.setVisible(true);
      this.titlePanel.setVisible(true);
      this.routeBadge.setText(`${routeLabel(this.routeChoice)}  |  ${starterLabel(this.starterChoice)}`);
      this.cameraText.setText("Pallet Town | Walk to the house or Professor Oak's lab.");
    });
  }

  function clearIntroCards() {
    if (!this.introCards) {
      this.introCards = [];
      return;
    }
    this.introCards.forEach((card) => {
      card.destroy();
    });
    this.introCards = [];
  }

  function makeChoiceCard(x, y, width, height, title, note, handler) {
    const panel = this.add.rectangle(x, y, width, height, 0x3b3b77, 1).setStrokeStyle(3, 0xffffff, 0.9).setScrollFactor(0).setDepth(2002).setInteractive({ useHandCursor: true });
    const titleText = this.add.text(x, y - 18, title, {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffe66d",
      align: "center",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2003);
    const noteText = this.add.text(x, y + 14, note, {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: width - 30 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2003);

    panel.on("pointerdown", handler);
    panel.on("pointerover", () => panel.setFillStyle(0x5e5ec8, 1));
    panel.on("pointerout", () => panel.setFillStyle(0x3b3b77, 1));

    const card = {
      destroy() {
        panel.destroy();
        titleText.destroy();
        noteText.destroy();
      },
    };

    return card;
  }

  function makeHudButton(x, y, shortLabel, tooltip, onClick) {
    const box = this.add.rectangle(x, y, 38, 38, 0x2e2e5a).setInteractive({ useHandCursor: true }).setDepth(1200);
    const txt = this.add.text(x, y, shortLabel, {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ffffff",
      align: "center",
    }).setOrigin(0.5).setDepth(1201);
    const hint = this.add.text(x, y + 30, tooltip, {
      fontFamily: "Arial, sans-serif",
      fontSize: "10px",
      color: "#cde7ff",
      align: "center",
    }).setOrigin(0.5).setDepth(1201);

    box.on("pointerdown", () => onClick());
    box.on("pointerover", () => box.setFillStyle(0x4e4eb8));
    box.on("pointerout", () => box.setFillStyle(0x2e2e5a));

    return { box, txt, hint };
  }

  function setAreaVisible(visible) {
    [this.cameraText, this.helpText, this.routeBadge, this.interactionHint, this.titlePanel].forEach((item) => {
      if (item && item.setVisible) {
        item.setVisible(visible);
      }
    });
    this.areaObjects.forEach((item) => {
      if (item && item.setVisible) {
        item.setVisible(visible);
      }
    });
    if (this.player && this.player.setVisible) {
      this.player.setVisible(visible);
    }
    if (this.professor && this.professor.setVisible) {
      this.professor.setVisible(visible);
    }
    this.hudButtons.forEach((button) => {
      button.box.setVisible(visible);
      button.txt.setVisible(visible);
      button.hint.setVisible(visible);
    });
  }

  function routeLabel(route) {
    if (route === "recruiter") return "Recruiter Path";
    if (route === "client") return "Client Path";
    if (route === "developer") return "Developer Path";
    return "Pallet Town";
  }

  function starterLabel(starter) {
    if (starter === "frontend") return "Frontendmon";
    if (starter === "backend") return "Backendmon";
    if (starter === "hardware") return "Hardwarmon";
    return "Starter";
  }

  function animationForFacing(direction) {
    if (direction === "left") return "walk-left";
    if (direction === "right") return "walk-right";
    if (direction === "up") return "walk-up";
    return "walk-down";
  }

  function facingFrame(direction) {
    if (direction === "left") return 4;
    if (direction === "right") return 8;
    if (direction === "up") return 12;
    return 0;
  }

  function dialogStyle(width, fontSize) {
    return {
      fontFamily: "Arial, sans-serif",
      fontSize: `${fontSize}px`,
      color: "#ffffff",
      wordWrap: { width },
    };
  }

  function makeBox(x, y, width, height, fill, alpha, strokeWidth, strokeColor, strokeAlpha) {
    return this.add.rectangle(x, y, width, height, fill, alpha).setScrollFactor(0).setDepth(2000).setStrokeStyle(strokeWidth, strokeColor, strokeAlpha);
  }
})();
