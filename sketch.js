let images = {};
let cursorImage;

let droplets = []; // Array to store water droplets
let flowers = []; // Array to store flowers with their positions
let bubbles = []; // Array to store bubbles with their positions
let raining = false; // Flag to track if it's raining
let spinning = false; // Flag to track if flowers should spin

// List of image paths and keys
const imagePaths = [
  { key: 'logo', path: 'images/fijiLogo.png' },
  { key: 'people', path: 'images/peopleIcon.png' },
  { key: 'money', path: 'images/moneyIcon.png' },
  { key: 'bottle', path: 'images/fijiBottle.png' },
  { key: 'bottle2', path: 'images/fijiBlackBottle.png' },
  { key: 'arsenic', path: 'images/arsenicIcon.png' },
  { key: 'check', path: 'images/checkIcon.png' },
  { key: 'flower1', path: 'images/flower1.png' },
  { key: 'flower2', path: 'images/flower2.png' },
  { key: 'cursor', path: 'images/cloud.png' }
];

function preload() {
  imagePaths.forEach(img => {
    images[img.key] = loadImage(img.path);
  });
  cursorImage = images.cursor;
}

function setup() {
  createCanvas(800, 1200);
  flowers.push({ img: images.flower1, x: 50, y: 11, angle: 0 });
  flowers.push({ img: images.flower2, x: 580, y: 5, angle: 0 });

  initializeBubbles();
  noCursor(); // Hide the default cursor
}

function draw() {
  background('#4FB1FE');

  noStroke(); // Disable the border for shapes
  fill('#85C8FD'); // Set the fill color for the rectangle
  rect(267, 0, 267, 1200); // Draw the rectangle

  drawIcons();
  drawFlowers();
  drawBubbles(); 
  drawText(); 

  if (raining) {
    generateRaindrops(mouseX + cursorImage.width / 2, mouseY + cursorImage.height / 2, 10);
  }

  updateAndDisplayDroplets();

  image(cursorImage, mouseX, mouseY);
}

function drawIcons() {
  const icons = [
    { img: 'logo', x: 400 - images.logo.width / 2, y: 105 },
    { img: 'people', x: 220, y: 340 },
    { img: 'bottle', x: 220, y: 570 },
    { img: 'arsenic', x: 220, y: 850 },
    { img: 'money', x: 480, y: 340 },
    { img: 'bottle2', x: 470, y: 565 },
    { img: 'check', x: 480, y: 850 }
  ];

  icons.forEach(icon => {
    image(images[icon.img], icon.x, icon.y);
  });
}

function drawText() {
  textSize(16);
  textAlign(CENTER);

  fill('#1E1E1E'); // Set the fill color for the text
  stroke('#1E1E1E'); // Set the stroke color for the text
  strokeWeight(1); // Set the stroke weight for the text

  const texts = [
    { text: '12% of Fijians do NOT have access to clean drinking water', x: 100, y: 340 },
    { text: 'It takes 1.75 gallons of water to export and produce one liter of FIJI water', x: 100, y: 580 },
    { text: 'FIJI Water contains 6.3 micrograms of arsenic per liter', x: 100, y: 850 },
    { text: 'FIJI Water extracts 43 million in annual water sales from the country', x: 600, y: 334 },
    { text: 'That is 2000x more when compared to one liter of tap water', x: 600, y: 580 },
    { text: 'The legal safe limit for arsenic in drinking water is 10 micrograms per liter', x: 600, y: 840 },
    { text: 'Nguyen, R. M. (2021, March11). The Dark Secret of Fiji Water. New University | UC Irvine. https://newuniversity.org/2021/03/10/the-dark-secret-of-fiji-water/', x: 19, y: 1101, w: 500, h: 120 }
  ];

  texts.forEach((t, index) => {
    if (index === texts.length - 1) {
      textAlign(LEFT);  // Align the last text to the left
    } else {
      textAlign(CENTER);  // Align all other texts to the center
    }
    text(t.text, t.x, t.y, t.w || 100, t.h || 120);
  });

  textAlign(CENTER, TOP);
  textSize(40);
  text('HARD facts about', 400, 37);
}

function initializeBubbles() {
  const positions = [
    { x: 150, y: 390 }, { x: 150, y: 640 }, { x: 150, y: 890 },
    { x: 650, y: 390 }, { x: 650, y: 640 }, { x: 650, y: 890 }
  ];

  positions.forEach(pos => {
    bubbles.push({ x: pos.x, y: pos.y, diameter: 160 });
  });
}

function drawBubble(bubble) {
  const { x, y, diameter } = bubble;
  for (let i = 0; i < 10; i++) {
    let transparency = 150 - i * 15; // Adjust transparency gradually
    fill(255, 255, 255, transparency);
    let bubbleDiameter = diameter - i * 10; // Gradually decrease bubble size
    ellipse(x, y, bubbleDiameter, bubbleDiameter);
  }

  fill(255, 255, 255, 200);
  ellipse(x - diameter / 4, y - diameter / 4, diameter / 10, diameter / 10);

  let refractedColor = color(200, 220, 255, 50); // Light blue with transparency
  for (let i = 0; i < 5; i++) { // Draw multiple ellipses for refraction effect
    refractedColor.setAlpha(50 - i * 10); // Adjust transparency gradually
    fill(refractedColor);
    let refractedDiameter = diameter + i * 5; // Gradually increase diameter
    ellipse(x, y, refractedDiameter, refractedDiameter);
  }
}

function drawBubbles() {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    if (bubbles[i].diameter <= 0) {
      bubbles.splice(i, 1);
    } else {
      drawBubble(bubbles[i]);
    }
  }
}

function keyPressed() {
  if (keyCode === 32) { // 32 is the keycode for space bar
    // Reset bubble diameters
    bubbles.forEach(bubble => {
      bubble.diameter = 160;
    });
  }
}

function drawFlowers() {
  flowers.forEach(flower => {
    push();
    translate(flower.x + images.flower1.width / 2, flower.y + images.flower1.height / 2); // Translate to the center of the flower
    if (spinning) {
      flower.angle += 0.05; // Adjust the speed of spinning
    }
    rotate(flower.angle);
    imageMode(CENTER);
    image(flower.img, 0, 0);
    pop();
  });
}

function updateAndDisplayDroplets() {
  for (let i = droplets.length - 1; i >= 0; i--) {
    let droplet = droplets[i];
    droplet.y += droplet.speed; // Update y position
    droplet.x += droplet.drift; // Update x position (for slight horizontal movement)

    if (droplet.y > height) {
      droplets.splice(i, 1); // Remove the droplet from the array if it goes below the canvas
    } else {
      let transparency = map(droplet.y, 0, height, 255, 0); // Gradually fade out droplets
      fill(200, 220, 255, transparency); // Fill color for water droplets
      ellipse(droplet.x, droplet.y, droplet.size, droplet.size * 2); // Draw elongated water droplet

      // Check for collision with bubbles
      for (let j = 0; j < bubbles.length; j++) {
        let bubble = bubbles[j];
        let distance = dist(droplet.x, droplet.y, bubble.x, bubble.y);
        if (distance < bubble.diameter / 2) {
          bubble.diameter -= 1; // Reduce the bubble's diameter
          droplets.splice(i, 1); // Remove the droplet on collision
          break;
        }
      }
    }
  }
}

function generateRaindrops(x, y, count) {
  for (let i = 0; i < count; i++) {
    droplets.push({
      x: x + random(-5, 5),
      y: y + random(-5, 5),
      speed: random(3, 9),
      drift: random(-1, 1),
      size: random(2, 3)
    });
  }
}

function mousePressed() {
  let cloudCenterX = mouseX + cursorImage.width / 2;
  let cloudCenterY = mouseY + cursorImage.height / 2;

  raining = true;
  generateRaindrops(cloudCenterX, cloudCenterY, 10);
  spinning = true; // Start spinning flowers
}

function mouseReleased() {
  raining = false;
  spinning = false; // Stop spinning flowers
}
