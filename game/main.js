// Web Pokémon-style overworld built from Pokémon Essentials art assets.
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
  }

  function create() {
    this.worldBounds = { width: WORLD_W, height: WORLD_H };
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    drawBackground.call(this);
    createMapObjects.call(this);
    createCharacters.call(this);
    createUI.call(this);
    createAnimations.call(this);

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

    this.currentZone = "Home Town";
    this.currentMessage = "Walk to the lab, talk to the guide, and explore the portfolio town.";
    this.lastFacing = "down";
    this.isTalking = false;
    this.cameraText.setText(zoneText(this.currentZone, this.currentMessage));
  }

  function drawBackground() {
    this.add.tileSprite(0, 0, WORLD_W, WORLD_H, "grass").setOrigin(0);

    const pathSegments = [
      { x: 0, y: 9, w: 15, h: 2 },
      { x: 14, y: 6, w: 2, h: 7 },
      { x: 15, y: 11, w: 10, h: 2 },
      { x: 23, y: 2, w: 2, h: 10 },
    ];

    pathSegments.forEach((segment) => {
      this.add.tileSprite(segment.x * TILE, segment.y * TILE, segment.w * TILE, segment.h * TILE, "path").setOrigin(0);
    });
  }

  function createMapObjects() {
    this.obstacles = this.physics.add.staticGroup();

    const trees = [
      { x: 4, y: 4, key: "tree1", scale: 1 },
      { x: 6, y: 4, key: "tree2", scale: 1 },
      { x: 8, y: 4, key: "tree1", scale: 1 },
      { x: 10, y: 4, key: "tree2", scale: 1 },
      { x: 4, y: 13, key: "tree2", scale: 1 },
      { x: 6, y: 13, key: "tree1", scale: 1 },
      { x: 8, y: 13, key: "tree2", scale: 1 },
      { x: 10, y: 13, key: "tree1", scale: 1 },
      { x: 20, y: 5, key: "tree1", scale: 1 },
      { x: 22, y: 5, key: "tree2", scale: 1 },
      { x: 25, y: 14, key: "sign", scale: 1 },
    ];

    trees.forEach((tree) => {
      const sprite = this.obstacles.create(tree.x * TILE + TILE / 2, tree.y * TILE + TILE, tree.key);
      sprite.setScale(tree.scale);
      sprite.refreshBody();
    });

    this.npc = this.add.sprite(17 * TILE + TILE / 2, 9 * TILE + TILE / 2, "npc", 0).setOrigin(0.5, 0.8);
    this.npcBlock = this.physics.add.staticImage(17 * TILE + TILE / 2, 9 * TILE + TILE / 2, "sign").setAlpha(0);
    this.npcBlock.refreshBody();
    this.obstacles.add(this.npcBlock);
  }

  function createCharacters() {
    this.player = this.physics.add.sprite(2 * TILE + TILE / 2, 10 * TILE + TILE / 2, "player", 0);
    this.player.setSize(20, 24).setOffset(6, 20);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.obstacles);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(140, 80);
  }

  function createUI() {
    const overlay = this.add.rectangle(480, 600, 960, 80, 0x0d1b2a, 0.9).setScrollFactor(0);
    overlay.setStrokeStyle(2, 0xffffff, 0.15);

    this.cameraText = this.add.text(24, 564, "", {
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

    this.dialog = this.add.text(24, 24, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "rgba(13, 27, 42, 0.88)",
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
      wordWrap: { width: 320 },
    }).setScrollFactor(0).setVisible(false);
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

  function update() {
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

  function updateZone() {
    const x = this.player.x;
    const y = this.player.y;
    let zone = "Home Town";
    let message = "Your portfolio quest begins here.";

    if (x > 14 * TILE && x < 22 * TILE && y > 4 * TILE && y < 12 * TILE) {
      zone = "University City";
      message = "A place for learning, systems work, and shipping polished UIs.";
    } else if (x > 22 * TILE) {
      zone = "Research Lab";
      message = "Experiments, demos, and deeper technical work happen here.";
    }

    if (zone !== this.currentZone) {
      this.currentZone = zone;
      this.currentMessage = message;
      this.cameraText.setText(zoneText(zone, message));
    }
  }

  function tryTalk() {
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
    if (distance > 56) {
      this.dialog.setVisible(true).setText("No one is nearby.");
      this.time.delayedCall(900, () => this.dialog.setVisible(false));
      return;
    }

    this.isTalking = true;
    this.player.setVelocity(0, 0);
    this.dialog.setVisible(true).setText(
      "Professor Oak: \"The web route is ready. Explore the town, read the badges, and view Fernando's projects.\""
    );

    this.time.delayedCall(2600, () => {
      this.dialog.setVisible(false);
      this.isTalking = false;
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

  function zoneText(zone, message) {
    return `${zone}  |  ${message}`;
  }
})();
