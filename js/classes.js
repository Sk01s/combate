import { c, canvas } from "../main";
import { attackCollision } from "./util";

const gravity = 0.35;

export class Sprite {
  constructor({
    position,
    height,
    width,
    imageSrc,
    frameCount,
    frameDelay,
    frameWidth,
    offsite = {
      x: 0,
      y: 0,
    },
    scale = 1,
  }) {
    this.position = { ...position };
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.onload = () => {
      // Wait for the image to load
      this.frameWidth = frameWidth ? frameWidth : this.image.width / frameCount; // Calculate frame width after image load
    };
    this.image.src = imageSrc;
    this.frameCount = frameCount;
    this.scale = scale;
    this.frameDelay = frameDelay; // Delay between each frame
    this.offsite = offsite;
    this.currentFrame = 0;
    this.frameDelayCounter = 0; // Counter to track delay
    this.status = "idle";
  }

  draw() {
    const sourceX = this.currentFrame * this.frameWidth + this.offsite.x;
    c.drawImage(
      this.image,
      sourceX,
      this.offsite.y,
      this.frameWidth,
      this.image.height,
      this.position.x,
      this.position.y,
      this.width * this.scale,
      this.height * this.scale
    );
  }

  update() {
    this.animate();
    this.draw();
  }

  animate() {
    this.frameDelayCounter++;
    if (this.frameDelayCounter >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      this.frameDelayCounter = 0; // Reset delay counter
    }
  }
}

export class Fighter extends Sprite {
  constructor({
    position,
    height,
    width,
    attackBox = {
      position: {
        x: 0,
        y: 0,
      },
      offsite: {
        x: 0,
        y: 0,
      },
      width: 100,
      height: 20,
    },
    sprites,
    offsite,
    scale,
    left = false,
    hpId,
    frameWidth,
    timeEnd,
  }) {
    super({
      frameWidth,
      position,
      height,
      width,
      ...sprites.idle,
      frameDelay: 5,
      offsite,
      scale,
      imageSrc: sprites.idle.imageSrc, // Provide image source directly to the superclass constructor
    });
    this.attackBox = attackBox;
    this.sprites = sprites;
    this.velocity = 0;
    this.isOnGround = false;
    this.isAttacking = false;
    this.hpId = hpId;
    this.hp = 100;
    this.left = left;
    this.timeEnd = timeEnd;
    this.updateHp();
  }

  updateHp() {
    const hpBar = document.getElementById(this.hpId);
    hpBar.style.width = `${this.hp}%`;
  }

  attack(enemy) {
    this.isAttacking = true;
    const target = { ...enemy };
    target.position = { ...target.position };
    if (this.left) {
      target.position.x += target.width + 10;
    }

    if (attackCollision(this, target)) {
      this.switchSprite("idle");
      enemy.hp -= 10;
      if (enemy.hp === 0) {
        this.timeEnd();
      }
      enemy.updateHp();
      enemy.switchSprite("take");
    }
  }

  switchSprite(sprite) {
    if (this.status === "take" && this.currentFrame !== this.frameCount - 1)
      return;

    if (this.status === "attack" && this.isAttacking) return;
    if (this.status !== sprite) this.currentFrame = 0;
    switch (sprite) {
      case "idle":
        this.status = "idle";
        this.image.src = this.sprites.idle.imageSrc;
        this.frameCount = this.sprites.idle.frameCount;
        break;
      case "run":
        this.status = "run";
        this.image.src = this.sprites.run.imageSrc;
        this.frameCount = this.sprites.run.frameCount;
        break;
      case "jump":
        this.status = "jump";
        this.image.src = this.sprites.jump.imageSrc;
        this.frameCount = this.sprites.jump.frameCount;
        break;
      case "fall":
        this.status = "fall";
        this.image.src = this.sprites.fall.imageSrc;
        this.frameCount = this.sprites.fall.frameCount;
        break;
      case "attack":
        this.currentFrame = 0;
        this.status = "attack";
        this.image.src = this.sprites.attack.imageSrc;
        this.frameCount = this.sprites.attack.frameCount;
        break;
      case "take":
        this.status = "take";
        this.image.src = this.sprites.takeHit.imageSrc;
        this.frameCount = this.sprites.takeHit.frameCount;
        break;
    }
  }

  update() {
    this.draw();
    this.animate();
    this.currentFrame;
    this.attackBox.position.x = this.position.x + this.attackBox.offsite.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offsite.y;
    this.position.y += this.velocity;

    if (this.isAttacking && this.currentFrame === this.frameCount - 1) {
      this.isAttacking = false;
    }
    if (this.position.y + this.height >= canvas.height - 85) {
      this.isOnGround = true;
      this.velocity = 0;
    } else {
      this.velocity += gravity;
    }
  }
}
