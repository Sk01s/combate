import "./style.css";
import { Sprite, Fighter } from "./js/classes";
export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");

// aspect radio of 16 / 9
canvas.width = 1000;
canvas.height = 504;
function showLoadingScreen() {
  const loadingScreenCanvas = document.createElement("canvas");
  loadingScreenCanvas.id = "loading-screen-canvas";
  loadingScreenCanvas.width = 300; // Set the width of the loading animation canvas
  loadingScreenCanvas.height = 300; // Set the height of the loading animation canvas
  document.body.appendChild(loadingScreenCanvas);

  // Animation logic for the loading screen canvas
  const ctx = loadingScreenCanvas.getContext("2d");
  const width = loadingScreenCanvas.width;
  const height = loadingScreenCanvas.height;
  let degrees = 300;
  let new_degrees = 0;
  let difference = 0;
  let color = "turquoise";
  let bgcolor = "#222";
  let text;
  let animation_loop;

  function init() {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = bgcolor;
    ctx.lineWidth = 30;
    ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2, false);
    ctx.stroke();
    let radians = (degrees * Math.PI) / 180;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 30;
    ctx.arc(
      width / 2,
      height / 2,
      100,
      0 - (90 * Math.PI) / 180,
      radians - (90 * Math.PI) / 180,
      false
    );
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "50px Arial";
    text = Math.floor((degrees / 360) * 100) + "%";
    let text_width = ctx.measureText(text).width;
    ctx.fillText(text, width / 2 - text_width / 2, height / 2 + 15);
  }

  function draw() {
    if (typeof animation_loop != undefined) clearInterval(animation_loop);
    new_degrees = 360;
    difference = new_degrees - degrees;
    animation_loop = setInterval(animate_to, 1000 / difference);
  }

  function animate_to() {
    if (degrees == new_degrees) clearInterval(animation_loop);
    else if (degrees < new_degrees) degrees++;
    else degrees--;
    init();
  }

  draw();
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen-canvas");
  document.body.removeChild(loadingScreen);
  document.querySelector(".status").classList.add("show");
}
export function start(playerHp, enemyHp) {
  let time = 90;

  const keys = {
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    w: {
      pressed: false,
    },
    space: {
      pressed: false,
    },
    ArrowRight: {
      pressed: false,
    },
    ArrowLeft: {
      pressed: false,
    },
    ArrowUp: {
      pressed: false,
    },
    ArrowDown: {
      pressed: false,
    },
  };
  // show result of the last game
  if (playerHp || enemyHp) {
    const status = document.getElementById("status");
    status.style.opacity = 1;
    if (playerHp > enemyHp) {
      status.innerText = "Player 1 Won";
    } else if (playerHp < enemyHp) {
      status.innerText = "Player 2 Won";
    } else if (playerHp === enemyHp) {
      status.innerText = "It's a Draw !";
    }
    setTimeout(() => {
      status.style.opacity = 0;
    }, 2000);
  }

  function timeEnd() {
    time = 0;
  }
  const player = new Fighter({
    timeEnd,
    position: { x: 0, y: 0 },
    height: 200,
    width: 130,
    offsite: {
      x: 70,
      y: 62,
    },
    left: true,
    frameWidth: 200,
    sprites: {
      idle: {
        frameCount: 8,
        imageSrc: "/images/samuraiMack/Idle.png",
      },
      run: {
        frameCount: 8,
        imageSrc: "/images/samuraiMack/Run.png",
      },
      jump: {
        frameCount: 2,
        imageSrc: "/images/samuraiMack/Jump.png",
      },
      fall: {
        frameCount: 2,
        imageSrc: "/images/samuraiMack/Fall.png",
      },
      attack: {
        frameCount: 6,
        imageSrc: "/images/samuraiMack/Attack1.png",
      },
      takeHit: {
        frameCount: 4,
        imageSrc: "/images/samuraiMack/Take Hit - white silhouette.png",
      },
    },
    attackBox: {
      position: { x: 0, y: 0 },
      height: 60,
      width: 165,
      offsite: {
        x: 50,
        y: 70,
      },
    },
    scale: 3.3,
    hpId: "player-hp",
  });
  const enemy = new Fighter({
    timeEnd,
    position: { x: 700, y: 0 },
    height: 200,
    width: 130,
    offsite: {
      x: 0,
      y: 68,
    },
    scale: 3.3,
    frameWidth: 200,
    sprites: {
      idle: {
        frameCount: 4,
        imageSrc: "/images/kenji/Idle.png",
      },
      run: {
        frameCount: 8,
        imageSrc: "/images/kenji/Run.png",
      },
      jump: {
        frameCount: 2,
        imageSrc: "/images/kenji/Jump.png",
      },
      fall: {
        frameCount: 2,
        imageSrc: "/images/kenji/Fall.png",
      },
      attack: {
        frameCount: 4,
        imageSrc: "/images/kenji/Attack1.png",
      },
      takeHit: {
        frameCount: 4,
        imageSrc: "/images/kenji/Take hit.png",
      },
    },
    attackBox: {
      position: { x: 0, y: 0 },
      height: 60,
      width: 165,
      offsite: {
        x: 50,
        y: 70,
      },
    },
    hpId: "enemy-hp",
  });
  const background = new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    height: canvas.height,
    width: canvas.width,
    imageSrc: "/images/background.png",
    frameCount: 1,
  });
  const shop = new Sprite({
    position: {
      x: 620,
      y: 120,
    },
    height: 300,
    width: 300,
    imageSrc: "/images/shop.png",
    frameCount: 6,
    frameDelay: 5,
  });

  function animate() {
    c.reset();

    // control of player
    if (keys.a.pressed && player.position.x > 0) {
      player.switchSprite("run");
      player.position.x -= 5;
    }
    if (keys.d.pressed && player.position.x + player.width < canvas.width) {
      player.switchSprite("run");
      player.position.x += 5;
    }
    if (keys.w.pressed && player.isOnGround) {
      player.switchSprite("jump");
      player.velocity = -10;
      player.isOnGround = false;
    }
    if (keys.space.pressed && !player.isAttacking) {
      player.switchSprite("attack");
      player.attack(enemy);
    }
    if (player.velocity > 0) {
      player.switchSprite("fall");
    }

    if (
      !keys.a.pressed &&
      !keys.d.pressed &&
      !keys.w.pressed &&
      !keys.space.pressed &&
      !player.isAttacking &&
      player.isOnGround
    ) {
      player.switchSprite("idle");
    }

    // control of enemy

    if (keys.ArrowLeft.pressed && enemy.position.x > 0) {
      enemy.switchSprite("run");
      enemy.position.x -= 5;
    }
    if (
      keys.ArrowRight.pressed &&
      enemy.position.x + enemy.width < canvas.width
    ) {
      enemy.switchSprite("run");
      enemy.position.x += 5;
    }
    if (keys.ArrowUp.pressed && enemy.isOnGround) {
      enemy.switchSprite("jump");

      enemy.velocity = -10;
      enemy.isOnGround = false;
    }
    if (enemy.velocity > 0) {
      enemy.switchSprite("fall");
    }
    if (keys.ArrowDown.pressed && !enemy.isAttacking) {
      enemy.switchSprite("attack");
      enemy.attack(player);
    }
    if (
      !keys.ArrowLeft.pressed &&
      !keys.ArrowRight.pressed &&
      !keys.ArrowUp.pressed &&
      !keys.ArrowDown.pressed &&
      !enemy.isAttacking &&
      enemy.isOnGround
    ) {
      enemy.switchSprite("idle");
    }

    background.update();
    shop.update();
    player.update();
    enemy.update();
    window.requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "d":
        keys.d.pressed = true;
        break;
      case "a":
        keys.a.pressed = true;
        break;
      case "w":
        keys.w.pressed = true;
        break;
      case " ":
        keys.space.pressed = true;
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        break;
      case "ArrowUp":
        keys.ArrowUp.pressed = true;
        break;
      case "ArrowDown":
        keys.ArrowDown.pressed = true;
        break;
    }
  });
  window.addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "d":
        keys.d.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      case "w":
        keys.w.pressed = false;
        break;
      case " ":
        keys.space.pressed = false;
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = false;
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = false;
        break;
      case "ArrowUp":
        keys.ArrowUp.pressed = false;
        break;
      case "ArrowDown":
        keys.ArrowDown.pressed = false;
        break;
    }
  });
  const timeInt = setInterval(timer, 1000);
  function timer() {
    if (time <= 0) {
      clearInterval(timeInt);
      start(player.hp, enemy.hp);
      console.log("start");
    } else {
      time--;
    }
    const counter = document.getElementById("counter");
    counter.innerText = time;
  }
}
// List of image URLs to preload
const imageUrls = [
  "/images/samuraiMack/Idle.png",
  "/images/samuraiMack/Run.png",
  "/images/samuraiMack/Jump.png",
  "/images/samuraiMack/Fall.png",
  "/images/samuraiMack/Attack1.png",
  "/images/samuraiMack/Take Hit - white silhouette.png",
  "/images/kenji/Idle.png",
  "/images/kenji/Run.png",
  "/images/kenji/Jump.png",
  "/images/kenji/Fall.png",
  "/images/kenji/Attack1.png",
  "/images/kenji/Take hit.png",
  "/images/background.png",
  "/images/shop.png",
];

// Function to preload images
function preloadImages(urls, callback) {
  let loadedCount = 0;

  // Function to load individual images
  function loadImage(url) {
    const img = new Image();
    img.onload = () => {
      loadedCount++;
      // Update loading progress (optional)
      const progress = Math.round((loadedCount / urls.length) * 100);
      console.log(`Loading progress: ${progress}%`);

      // Check if all images are loaded
      if (loadedCount === urls.length) {
        // All images are loaded, invoke the callback

        callback();
      }
    };
    img.src = url;
  }

  // Preload each image
  urls.forEach((url) => {
    loadImage(url);
  });
}
showLoadingScreen();
// Preload images
preloadImages(imageUrls, () => {
  // All images are loaded, hide the loading screen and start the game
  hideLoadingScreen();
  start();
});
