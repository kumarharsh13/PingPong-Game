// Canvas
const { body } = document;
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const width = 500;
const height = 700;
const screenWidth = window.screen.width;
const canvasPosition = screenWidth / 2 - width / 2;
const isMobile = window.matchMedia('(max-width: 600px)');
const gameOverEl = document.createElement('div');

// Paddle
const paddleHeight = 10;
const paddleWidth = 65;
const paddleDiff = 25;
let paddleBottomX = 225;
let paddleTopX = 225;
let playerMoved = false;
let paddleContact = false;

// Ball
let ballX = 250;
let ballY = 350;
const ballRadius = 8;

// Speed
let speedY;
let speedX;
let trajectoryX;
let computerSpeed;

// Change Mobile Settings
if (isMobile.matches) {
    speedY = -2;
    speedX =speedY;
    computerSpeed = 4;
}
else {
    speedY = -1;
    speedX = speedY;
    computerSpeed = 3;
}

// Score
let playerScore = 0;
let computerScore = 0;
const winningScore = 10;
let isGameOver = true;
let isNewGame =true;

// Rendering Everything on Canvas
function renderCanvas() {
    // Canvas Background
    context.fillStyle = 'black';
    context.fillRect(0,0,width,height);

    // Paddle Color
    context.fillStyle = 'white';
    
    // Player Paddle (Bottom)
    context.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight);

    // Computer Paddle (Top)
    context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);

    // Dashed Center Line
    context.beginPath();
    context.setLineDash([4]);
    context.moveTo(0,350);
    context.lineTo(580, 350);
    context.strokeStyle = 'grey';
    context.stroke();

    // Ball
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 2*Math.PI, false);
    context.fillStyle = 'white';
    context.fill();

    context.font = '32px Courier New';
    context.fillText(playerScore, 20, canvas.height / 2 + 50);
    context.fillText(computerScore, 20, canvas.height / 2 - 30);
}

// Reset Ball to Center
function ballReset() {
    ballX = width / 2;
    ballY = height /2;
    speedY = -3;
    paddleContact = false;
}

// Adjust Ball Movement
function ballMove() {
    // Vertical Speed
    ballY += -speedY;
    
    // Horizontal Speed
    if (playerMoved && paddleContact) {
        ballX += speedX;
    }
}

// Create Canvas
function createCanvas() {
    canvas.width = width;
    canvas.height = height;
    body.appendChild(canvas);
    renderCanvas();
}

// Determining that Ball Bounces back, Score Point, Reset Ball
function ballBoundaries() {

    // Bounces off Left Wall
    if(ballX<0 && speedX<0) speedX = -speedX;

    // Bounces off Right Wall
    if(ballX > width && speedX > 0) speedX = -speedX;

    // Bounces off player paddle (bottom)
    if (ballY > height - paddleDiff) {
        if(ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
            paddleContact = true;
            // Add speed on Hit
            if(playerMoved) {
                speedY -= 1;

                // MaX Speed
                if(speedY < -10) {
                    speedY = -10;
                    computerSpeed = 11;
                }
            }
            speedY = -speedY;
            trajectoryX = ballX - ( paddleBottomX + paddleDiff );
            speedX = trajectoryX * 0.3;
        }
        else if(ballY > height) {
            // Reset Ball, add to Computer Score
            ballReset();
            computerScore++;
        }
    }

    // Bounces off computer paddle (top)
    if(ballY < paddleDiff) {
        if(ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
            if(playerMoved)
            {
                speedY += 1;
                // MaX Speed
                if(speedY > 10) {
                    speedY = 10;
                }
            }
            speedY = -speedY;
        }
        else if(ballY < 0) {
            ballReset();
            playerScore++;
        }
    }
}

// Computer Movement 
function computerAI() {
    if(playerMoved) {
        if(paddleTopX + paddleDiff < ballX) {
            paddleTopX += computerSpeed;
        } 
        else {
            paddleTopX -= computerSpeed;
        }
    }    
}

function showGameOverEl(winner) {
    // Hide Canvas
    canvas.hidden = true;

    // Container
    gameOverEl.textContent = '';
    gameOverEl.classList.add('game-over-container');

    // Title
    const title = document.createElement('h1');
    title.textContent = `${winner} Wins....!!!!`;

    // Button
    const playAgainBtn = document.createElement('button');
    playAgainBtn.setAttribute('onclick', 'startGame()');
    playAgainBtn.textContent = 'Play Again';
    
    // Append
    gameOverEl.append(title, playAgainBtn);
    body.appendChild(gameOverEl);
}

// Check If One Player Has Winning Score, If They Do, End Game
function gameOver() {
    if (playerScore === winningScore || computerScore === winningScore) {
      isGameOver = true;
      // Set Winner
      const winner = playerScore === winningScore ? 'Player 1' : 'Computer';
      showGameOverEl(winner);
    }
}

// Called Every Frame
function animate() {
    renderCanvas();
    ballMove();
    ballBoundaries();
    computerAI();
    gameOver();
    if (!isGameOver) {
      window.requestAnimationFrame(animate);
    }
}

// Start Game, Reset Everthing
function startGame() {
    if (isGameOver && !isNewGame) {
        body.removeChild(gameOverEl);
        canvas.hidden = false;
    }
    isGameOver = false;
    isNewGame = false;
    playerScore = 0;
    computerScore = 0;
    ballReset();
    createCanvas();
    animate();
    canvas.addEventListener('mousemove', (e) => {
        playerMoved = true;
        paddleBottomX = e.clientX - canvasPosition - paddleDiff;
        if (paddleBottomX < paddleDiff) {
            paddleBottomX = 0;
        }
        if (paddleBottomX > width - paddleWidth) {
            paddleBottomX = width - paddleWidth;
        }
        // Hide Cursor
        canvas.style.cursor = 'none';
    });
}


// On Load
startGame();