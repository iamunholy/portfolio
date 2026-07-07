// Fernando Version - story intro + route selection + overworld.
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
    npc: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Characters/trainer_PROFESSOR.png"),
    sign: encodeURI("../Pokemon Essentials v21.1 2023-07-30/Graphics/Characters/Object rock.png"),
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
    this.load.image("sign", ASSET.sign);
    this.load.spritesheet("player", ASSET.player, { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet("npc", ASSET.npc, { frameWidth: 32, frameHeight: 48 });
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
    this.sceneMode = "title";
    this.activeArea = "title";
    this.introPage = 0;
    this.pendingChoice = null;
    this.currentZone = "Fernando Version";
    this.currentMessage = "PRESS ENTER";
    this.lastFacing = "down";
    this.isTalking = false;

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    createWorld.call(this);
    createCharacters.call(this);
    createHUD.call(this);
    createIntro.call(this);
    createAnimations.call(this);
    bindInput.call(this);

    setWorldVisible.call(this, false);
    this.cameraText.setVisible(false);
    this.helpText.setVisible(false);
    this.routeBadge.setVisible(false);
    this.dialog.setVisible(false);
    this.cameras.main.stopFollow();
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
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    });

    this.input.keyboard.on("keydown-ENTER", () => handleAdvance.call(this));
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.sceneMode === "world") {
        tryTalk.call(this);
      } else {
        handleAdvance.call(this);
      }
    });
  }

  function createWorld() {
    this.areaDefinitions = {
      town: {
        bounds: { width: WORLD_W, height: WORLD_H },
        spawn: { x: 15 * TILE, y: 14 * TILE },
        view: { x: 0, y: 0, width: WORLD_W, height: WORLD_H },
        label: "Pallet Town",
        message: "The calm town where Fernando's journey begins.",
      },
      house: {
        bounds: { width: 16 * TILE, height: 12 * TILE },
        spawn: { x: 7 * TILE, y: 9 * TILE },
        view: { x: 0, y: 0, width: 16 * TILE, height: 12 * TILE },
        label: "Fernando's House",
        message: "A quiet home base for planning the next build.",
      },
      lab: {
        bounds: { width: 18 * TILE, height: 12 * TILE },
        spawn: { x: 9 * TILE, y: 9 * TILE },
        view: { x: 0, y: 0, width: 18 * TILE, height: 12 * TILE },
        label: "Professor Oak's Lab",
        message: "The lab where ideas, systems, and experiments are explained.",
      },
    };

    this.areaLayers = {
      town: this.add.container(0, 0),
      house: this.add.container(0, 0),
      lab: this.add.container(0, 0),
    };

    this.obstacles = this.physics.add.staticGroup();

    buildPalletTown.call(this);
    buildHouseInterior.call(this);
    buildLabInterior.call(this);
  }

  function createCharacters() {
    const start = this.areaDefinitions.town.spawn;
    this.player = this.physics.add.sprite(start.x, start.y, "player", 0);
    this.player.setSize(20, 24).setOffset(6, 20);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.obstacles);
  }

  function createHUD() {
    this.titlePanel = this.add.rectangle(480, 600, 960, 80, 0x0d1b2a, 0.9).setScrollFactor(0).setStrokeStyle(2, 0xffffff, 0.15);
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
      wordWrap: { width: 900 },
    }).setScrollFactor(0);
    this.helpText = this.add.text(24, 620, "Move: Arrow Keys / WASD   Interact: Space", {
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      color: "#cde7ff",
    }).setScrollFactor(0);
    this.dialog = this.add.text(24, 24, "", dialogStyle(328, 18)).setScrollFactor(0).setVisible(false).setDepth(1100);

    // HUD buttons: Resume, GitHub, Projects
    this.hudButtons = [];
    this.hudButtons.push(makeHudButton.call(this, 820, 556, "Resume", () => window.open(LINKS.resume, "_blank")));
    this.hudButtons.push(makeHudButton.call(this, 880, 556, "GitHub", () => window.open(LINKS.github, "_blank")));
    this.hudButtons.push(makeHudButton.call(this, 940, 556, "Projects", () => window.open(LINKS.projects, "_blank")));
    this.hudButtons.forEach(b => b.setScrollFactor(0).setDepth(1200));
  }

  function createAnimations() {
    createDirectionalAnimation.call(this, "walk-down", 0, 3);
    createDirectionalAnimation.call(this, "walk-left", 4, 7);
    createDirectionalAnimation.call(this, "walk-right", 8, 11);
    createDirectionalAnimation.call(this, "walk-up", 12, 15);
    this.player.anims.play("walk-down");
    this.player.anims.stop();
    createDirectionalAnimation.call(this, "npc-idle", 0, 0, "npc");
    this.npc.anims.play("npc-idle");
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

  function update() {
    if (this.sceneMode !== "world") {
      this.introPrompt.setVisible(Math.floor(this.time.now / 500) % 2 === 0);
      return;
    }

    if (this.isTalking) {
      this.player.setVelocity(0, 0);
      return;
    }

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
      tryTalk.call(this);
    }

    updateZone.call(this);
  }

  function handleAdvance() {
    if (this.sceneMode === "title") {
      setIntroPage.call(this, 1);
      return;
    }
    if (this.sceneMode === "dialog") {
      setIntroPage.call(this, 2);
      return;
    }
  }

  function setIntroPage(page) {
    clearIntroCards.call(this);
    this.introPage = page;

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

    const routeText = {
      recruiter: "Recruiter Path: Skills, Experience, Resume, Certifications",
      client: "Client Path: Services, Case Studies, Pricing, Contact",
      developer: "Developer Path: Projects, GitHub, Architecture, Technical Blogs",
    }[this.routeChoice];

    this.introText.setText(`${routeText}\n\nChoose your starter specialization:`);

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
      `${starterLabel(this.starterChoice)} selected.\n\nThe portfolio map opens and the journey begins.`
    );

    this.time.delayedCall(1100, () => {
      this.introLayer.setVisible(false);
      setWorldVisible.call(this, true);
      this.sceneMode = "world";
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
      this.currentZone = routeLabel(this.routeChoice);
      this.currentMessage = routeIntro(this.routeChoice, this.starterChoice);
      this.routeBadge.setText(`${routeLabel(this.routeChoice)}  |  ${starterLabel(this.starterChoice)}`);
      this.cameraText.setText(zoneText(this.currentZone, this.currentMessage));
      this.cameraText.setVisible(true);
      this.helpText.setVisible(true);
      this.titlePanel.setVisible(true);
      this.player.setVisible(true);
      this.npc.setVisible(true);
    });
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

    return { panel, titleText, noteText };
  }

  function clearIntroCards() {
    if (!this.introCards) {
      this.introCards = [];
      return;
    }
    this.introCards.forEach((card) => {
      card.panel.destroy();
      card.titleText.destroy();
      card.noteText.destroy();
    });
    this.introCards = [];
  }

  function tryTalk() {
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
    if (distance > 60) {
      this.dialog.setVisible(true).setText("No one is nearby.");
      this.time.delayedCall(900, () => this.dialog.setVisible(false));
      return;
    }

    this.isTalking = true;
    const routeCopy = {
      recruiter: "Skills, experience, resume, and certifications are the way forward.",
      client: "Services, case studies, pricing, and contact make the route clear.",
      developer: "Projects, GitHub, architecture, and technical blogs define the build.",
    }[this.routeChoice];

    this.dialog.setVisible(true).setText(
      `Professor Byte:\n${routeCopy}\n\nStarter: ${starterLabel(this.starterChoice)}.`
    );

    this.time.delayedCall(3000, () => {
      this.dialog.setVisible(false);
      this.isTalking = false;
    });
  }

  function updateZone() {
    const x = this.player.x;
    const y = this.player.y;
    let zone = routeLabel(this.routeChoice);
    let message = routeIntro(this.routeChoice, this.starterChoice);

    if (x > 14 * TILE && x < 22 * TILE && y > 4 * TILE && y < 12 * TILE) {
      zone = `${routeLabel(this.routeChoice)} - University City`;
      message = "A place for learning, systems work, and shipping polished UIs.";
    } else if (x > 22 * TILE) {
      zone = `${routeLabel(this.routeChoice)} - Research Lab`;
      message = "Experiments, demos, and deeper technical work happen here.";
    }

    if (zone !== this.currentZone || message !== this.currentMessage) {
      this.currentZone = zone;
      this.currentMessage = message;
      this.cameraText.setText(zoneText(zone, message));
    }
  }

  function setWorldVisible(visible) {
    [this.player, this.npc, this.npcBlock, this.obstacles, this.titlePanel, this.cameraText, this.helpText, this.routeBadge, this.dialog].forEach((item) => {
      if (item && item.setVisible) {
        item.setVisible(visible);
      }
    });
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

  function routeLabel(route) {
    if (route === "recruiter") return "Recruiter Path";
    if (route === "client") return "Client Path";
    return "Developer Path";
  }

  function routeIntro(route, starter) {
    const routeCopy = {
      recruiter: "Skills, experience, resume, and certifications are your guideposts.",
      client: "Services, case studies, pricing, and contact lead the journey.",
      developer: "Projects, GitHub, architecture, and technical blogs define the route.",
    }[route];

    const starterCopy = {
      frontend: "Frontendmon adds polish, motion, and product-focused UI.",
      backend: "Backendmon keeps systems fast, reliable, and well-structured.",
      hardware: "Hardwarmon connects code to the physical world.",
    }[starter];

    return `${routeCopy} ${starterCopy}`;
  }

  function starterLabel(starter) {
    if (starter === "frontend") return "Frontendmon";
    if (starter === "backend") return "Backendmon";
    return "Hardwarmon";
  }

  function zoneText(zone, message) {
    return `${zone}  |  ${message}`;
  }

  function makeBox(x, y, width, height, fill, alpha, strokeWidth, strokeColor, strokeAlpha) {
    return this.add.rectangle(x, y, width, height, fill, alpha).setScrollFactor(0).setDepth(2000).setStrokeStyle(strokeWidth, strokeColor, strokeAlpha);
  }

  function dialogStyle(width, fontSize) {
    return {
      fontFamily: "Arial, sans-serif",
      fontSize: `${fontSize}px`,
      color: "#ffffff",
      wordWrap: { width },
    };
  }

  function makeHudButton(x, y, label, onClick) {
    const size = 38;
    const box = this.add.rectangle(x, y, size, size, 0x2e2e5a).setInteractive({ useHandCursor: true }).setDepth(1200);
    const txt = this.add.text(x, y, label[0], {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ffffff",
    }).setOrigin(0.5).setDepth(1201);
    box.on('pointerdown', () => onClick());
    box.on('pointerover', () => box.setFillStyle(0x4e4eb8));
    box.on('pointerout', () => box.setFillStyle(0x2e2e5a));
    // group them for visibility toggles
    const container = this.add.container(0,0,[box, txt]);
    // expose helper methods for compatibility
    container.setVisible = function(v){ box.setVisible(v); txt.setVisible(v); };
    container.setScrollFactor = function(){ box.setScrollFactor(0); txt.setScrollFactor(0); return container; };
    return container;
  }
})();
