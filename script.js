const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Ravana image
const ravanaImg = new Image();
ravanaImg.src = 'https://png.pngtree.com/png-clipart/20231016/ourmid/pngtree-dussehra-festival-ravana-png-image_10185779.png';
const ravanaX = 600;
const ravanaY = 150;
const ravanaWidth = 150;
const ravanaHeight = 200;

// Bow and arrow vars
let angle = 0;
let shooting = false;
let arrowX = 100;
let arrowY = 250;
let arrowSpeed = 10;
let arrowAngle = 0;

// Hit detection and message
let hit = false;
const message = "I'm so proud of u my little bandari";

// Fireworks setup
const max_fireworks = 5;
const max_sparks = 50;
let fireworks = [];
for (let i = 0; i < max_fireworks; i++) {
    let firework = { sparks: [] };
    for (let n = 0; n < max_sparks; n++) {
        let spark = {
            vx: Math.random() * 5 + 0.5,
            vy: Math.random() * 5 + 0.5,
            weight: Math.random() * 0.3 + 0.03,
            red: Math.floor(Math.random() * 255),
            green: Math.floor(Math.random() * 255),
            blue: Math.floor(Math.random() * 255)
        };
        if (Math.random() > 0.5) spark.vx = -spark.vx;
        if (Math.random() > 0.5) spark.vy = -spark.vy;
        firework.sparks.push(spark);
    }
    fireworks.push(firework);
    resetFirework(firework);
}

function resetFirework(firework) {
    firework.x = ravanaX + ravanaWidth / 2;
    firework.y = ravanaY + ravanaHeight / 2;
    firework.age = 0;
    firework.phase = 'done';
}

function drawFireworks() {
    fireworks.forEach((firework) => {
        if (firework.phase === 'explode') {
            firework.sparks.forEach((spark) => {
                for (let i = 0; i < 10; i++) {
                    let trailAge = firework.age + i;
                    let x = firework.x + spark.vx * trailAge;
                    let y = firework.y + spark.vy * trailAge + spark.weight * trailAge * spark.weight * trailAge;
                    let fade = i * 20 - firework.age * 2;
                    if (fade > 0) {
                        ctx.beginPath();
                        ctx.fillStyle = `rgba(${spark.red}, ${spark.green}, ${spark.blue}, ${fade / 255})`;
                        ctx.rect(x, y, 4, 4);
                        ctx.fill();
                    }
                }
            });
            firework.age++;
            if (firework.age > 100) {
                resetFirework(firework);
            }
        }
    });
}

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ravana
    if (ravanaImg.complete && !hit) {
        ctx.drawImage(ravanaImg, ravanaX, ravanaY, ravanaWidth, ravanaHeight);
    }

    // Draw bow
    ctx.beginPath();
    ctx.arc(100, 250, 50, Math.PI / 2 + angle, 3 * Math.PI / 2 + angle);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'brown';
    ctx.stroke();

    // Draw bow string
    ctx.beginPath();
    ctx.moveTo(50, 250 - 50 * Math.cos(angle));
    ctx.lineTo(150, 250 - 50 * Math.cos(angle));
    ctx.strokeStyle = 'gray';
    ctx.stroke();

    // Draw/shoot arrow
    if (!shooting) {
        // Arrow ready on bow
        ctx.beginPath();
        ctx.moveTo(100, 250);
        ctx.lineTo(120, 250 + 20 * angle);
        ctx.strokeStyle = 'silver';
        ctx.lineWidth = 3;
        ctx.stroke();
    } else {
        // Move arrow
        arrowX += arrowSpeed * Math.cos(arrowAngle);
        arrowY += arrowSpeed * Math.sin(arrowAngle);
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 20 * Math.cos(arrowAngle), arrowY - 20 * Math.sin(arrowAngle));
        ctx.stroke();

        // Check for hit
        if (arrowX > ravanaX && arrowX < ravanaX + ravanaWidth &&
            arrowY > ravanaY && arrowY < ravanaY + ravanaHeight && !hit) {
            hit = true;
            fireworks.forEach(fw => {
                fw.phase = 'explode';
                fw.age = 0;
            });
        }

        // Reset if off screen
        if (arrowX > canvas.width || arrowX < 0 || arrowY > canvas.height || arrowY < 0) {
            shooting = false;
            arrowX = 100;
            arrowY = 250;
        }
    }

    // Fireworks and message on hit
    if (hit) {
        drawFireworks();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Arial';
        ctx.fillText(message, 200, 250);
    }

    requestAnimationFrame(animate);
}

animate();

// Aim with mouse move
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    angle = (250 - mouseY) / 150;
    angle = Math.max(Math.min(angle, Math.PI / 4), -Math.PI / 4);
});

// Shoot on click
canvas.addEventListener('click', () => {
    if (!shooting && !hit) {
        shooting = true;
        arrowAngle = angle;
        arrowY = 250;
    }
});