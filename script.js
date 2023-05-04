// let audioCtx;

function startAudio() {
  // create new AudioContext
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  // play a sound
  const oscillator = audioCtx.createOscillator();
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(Date.now() + 0.5);
}
// document.getElementById("pause-btn").addEventListener("click", startAudio);


class Score {
    constructor(ctx, x, y, color) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.color = color;
      this.score = 0;
      this.animationFrames = 50;
      this.animationCount = 0;
      this.startTime = null;
      this.duration = 2000; // in milliseconds
    }
  
    setScore(score) {
      this.score = score;
      this.startTime = Date.now();
    }
  
    draw() {
      if (this.startTime !== null) {
        const elapsedTime = Date.now() - this.startTime;
        if (elapsedTime < this.duration) {
          const progress = elapsedTime / this.duration;
          const yOffset = this.animationFrames * (1 - progress);
         // Define an array of colors to use in the gradient
         const colors = ['#FF0000', '#FF1A00', '#FF3300', '#FF4D00', '#FF6600', '#FF8000', '#FF9900', '#FFB300', '#FFCC00', '#FFE500', '#FFFF00', '#E5FF00', '#CCFF00', '#B3FF00', '#99FF00', '#80FF00', '#66FF00', '#4DFF00', '#33FF00', '#1AFF00', '#00FF00', '#00E5FF', '#00CCFF', '#00B3FF', '#0099FF', '#0080FF', '#0066FF', '#004DFF', '#0033FF', '#001AFF', '#0000FF', '#1A00FF', '#3300FF', '#4D00FF', '#6600FF', '#8000FF', '#9900FF', '#B300FF', '#CC00FF', '#E500FF', '#FF00FF'];


        // Calculate the current color based on the animation frame count
        const colorIndex = Math.round(progress * colors.length);
        const color = colors[colorIndex];

        // Create the gradient with the current color
        const gradient = this.ctx.createLinearGradient(this.x, this.y, this.x, this.y - yOffset);
        // gradient.addColorStop(0, color);
        // gradient.addColorStop(1, "white");
        // this.ctx.fillStyle = gradient;
          this.ctx.fillStyle = color;
          this.ctx.font = "bold 24px sans-serif";
          this.ctx.fillText(`+${this.score}`, this.x, this.y - yOffset);
          requestAnimationFrame(() => this.draw());
        } else {
          this.startTime = null;
        }
      }
    }
  }
  

const Pieces = {
    "I": [
      [1, 1, 1, 1]
    ],
    "J": [
      [1, 0, 0],
      [1, 1, 1]
    ],
    "L": [
      [0, 0, 1],
      [1, 1, 1]
    ],
    "O": [
      [1, 1],
      [1, 1]
    ],
    "S": [
      [0, 1, 1],
      [1, 1, 0]
    ],
    "T": [
      [0, 1, 0],
      [1, 1, 1]
    ],
    "Z": [
      [1, 1, 0],
      [0, 1, 1]
    ]
  };

  const COLORS = {
    "cyan": "#00FFFF",
    "blue": "#0000FF",
    "orange": "#FFA500",
    "yellow": "#FFFF00",
    "green": "#00FF00",
    "purple": "#800080",
    "red": "#FF0000"
  };

  // Get a reference to the pause button
const pauseButton = document.getElementById('pause-btn');


  
  
  

  class Piece {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.row = 0;
        this.col = 4;
        this.collided = false;
      }
      reset() {
        this.row = 0;
        this.col = 3;
      }

      getBlocks() {
        const blocks = [];
        this.shape.forEach((rowOffset, y) => {
          rowOffset.forEach((value, x) => {
            if (value > 0) {
              const row = this.row + y;
              const col = this.col + x;
              blocks.push({ row, col });
            }
          });
        });
        return blocks;
      }
   
 
      
         lock(board) {
        if (this.collides(board)) {
          this.collided = true;
          return;
        }
      
        this.shape.forEach((rowOffset, y) => {
          rowOffset.forEach((value, x) => {
            if (value > 0) {
              board[this.row + y][this.col + x] = this.color;
            }
          });
        });
      
        this.locked = true;
      }
      
    
        
      
        drawNextPiece(canvas) {
          const context = canvas.getContext('2d');
          const blockSize = Math.round(canvas.width / 4);
          const x = canvas.width / 2 - blockSize * 2;
          const y = canvas.height / 2 - blockSize * 2;
          const gapWidth = Math.round(blockSize*0.04)
          for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
              if (this.shape[row][col]) {
                const blockX = x + col * blockSize;
                const blockY = y + row * blockSize;
                context.fillStyle = this.color;
                context.fillRect(blockX+gapWidth, blockY+gapWidth, blockSize - gapWidth, blockSize - gapWidth);
                // context.strokeStyle = 'black';
                // context.strokeRect((col + x) * blockSize,(row + y)*blockSize, blockSize - 1, blockSize - 1);
              }
            }
          }
        }

        
      
      
    
      canMove(dx, dy, board) {
        const shape = this.shape;
        const row = this.row + dy;
        const col = this.col + dx;

        // console.log("Checking move:", dx, dy, "on piece", this.shape);
// console.log("New position:", row, col);
// console.log("Board state:", board);

      
        for (let y = 0; y < shape.length; ++y) {
          for (let x = 0; x < shape[y].length; ++x) {
            if (shape[y][x] !== 0) {
              const r = row + y;
              const c = col + x;
      
              if (r >= 0 && (r >= ROWS || c < 0 || c >= COLS || board[r][c] !== 0)) {
                return false;
              }
            }
          }
        }
      
        return true;
      }
      
      
      
      
      moveLeft(board) {
        if (this.canMove(-1, 0, board)) {
          this.col--;
        }
      }
      
      moveRight(board) {
        if (this.canMove(1, 0, board)) {
          this.col++;
        }
      }
      
      moveDown(board) {
        if (this.canMove(0, 1, board)) {
            this.row++;
            }
        }
    //  moveDown(board) {
    //     this.row += 1;
    //   }
      
    rotate(board) {
        const newShape = [];
        const oldWidth = this.width;
      
        for (let i = 0; i < this.shape[0].length; i++) {
          newShape[i] = new Array(this.shape.length).fill(0);
        }
      
        for (let y = 0; y < this.shape.length; ++y) {
          for (let x = 0; x < this.shape[y].length; ++x) {
            newShape[x][y] = this.shape[y][this.shape[y].length - 1 - x];
          }
        }
      
        const oldRow = this.row;
        const oldCol = this.col;
        const oldShape = this.shape;
      
        this.shape = newShape;
        this.width = newShape[0].length;
        this.height = newShape.length;
      
        if (this.shape === [[1, 1, 1, 1]]) { // 4x1 piece
            this.col -= 4;
        //     this.row = oldRow + Math.floor((oldShape.length - this.height) / 2);
        //     this.col = oldCol + Math.floor((oldShape[0].length - this.width) / 2);
        //   } else {
        //     this.row = oldRow + Math.floor((oldShape.length - this.height + 1) / 2);
        //     this.col = oldCol + Math.floor((oldShape[0].length - this.width) / 2);
          }

        if (this.shape === [[1], [1], [1], [1]]) {
            this.col += 4;
        }
        
          // Check if piece is going out of the sides of the board
          if (!this.canMove(0, 0, board)) {
            if (this.col < 0) {
              this.col = 0;
            } else if (this.col + this.width > COLS) {
              this.col = COLS - this.width;
            }
          }
        }
      
      
     
      
    

    // rotate() {
    //     const newShape = [];
    //     for (let row = 0; row < this.shape[0].length; row++) {
    //       const newRow = [];
    //       for (let col = 0; col < this.shape.length; col++) {
    //         newRow.push(this.shape[this.shape.length - 1 - col][row]);
    //       }
    //       newShape.push(newRow);
    //     }
    //     this.shape = newShape;
    //   }
    }

  
    class Tetris {

        playPointSound() {
 // Create an AudioContext
const context = new AudioContext();

// Define the coin sound
const coinSound = () => {
  const osc1 = context.createOscillator();
  osc1.type = "triangle";
  osc1.frequency.value = 1000;
  
  const osc2 = context.createOscillator();
  osc2.type = "triangle";
  osc2.frequency.value = 2000;

  const noise = context.createBufferSource();
  const bufferSize = context.sampleRate * 0.1;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  noise.buffer = buffer;

  const gain1 = context.createGain();
  gain1.gain.setValueAtTime(1, context.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.05);

  const gain2 = context.createGain();
  gain2.gain.setValueAtTime(1, context.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.05);

  const gain3 = context.createGain();
  gain3.gain.setValueAtTime(0.5, context.currentTime);
  gain3.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

  const pan1 = context.createStereoPanner();
  pan1.pan.setValueAtTime(-0.5, context.currentTime);
  pan1.pan.linearRampToValueAtTime(0.5, context.currentTime + 0.1);

  const pan2 = context.createStereoPanner();
  pan2.pan.setValueAtTime(0.5, context.currentTime);
  pan2.pan.linearRampToValueAtTime(-0.5, context.currentTime + 0.1);

  const pan3 = context.createStereoPanner();
  pan3.pan.setValueAtTime(0, context.currentTime);

  osc1.connect(gain1).connect(pan1).connect(context.destination);
  osc2.connect(gain2).connect(pan2).connect(context.destination);
  noise.connect(gain3).connect(pan3).connect(context.destination);

  osc1.start();
  osc1.stop(context.currentTime + 0.05);
  osc2.start(context.currentTime + 0.02);
  osc2.stop(context.currentTime + 0.07);
  noise.start(context.currentTime + 0.03);
  noise.stop(context.currentTime + 0.1);
};

// Trigger the coin sound
coinSound();


        }

        async playClearSound() {
            const audioCtx = new AudioContext();
            const gainNode = audioCtx.createGain();
            const dur = 0.4
            gainNode.connect(audioCtx.destination);
          
            const oscillator1 = audioCtx.createOscillator();
            const oscillator2 = audioCtx.createOscillator();
            oscillator1.type = "square";
            oscillator2.type = "sine";
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            
          
            oscillator1.frequency.setValueAtTime(2000, audioCtx.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + dur);
            gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
            oscillator2.frequency.setValueAtTime(1800, audioCtx.currentTime);
            oscillator2.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + dur);
          
            oscillator1.start();
            oscillator2.start();
            oscillator1.stop(audioCtx.currentTime + dur);
            oscillator2.stop(audioCtx.currentTime + dur);
            
          }
          
          

    playGameOverSound() {
 // Create audio context and oscillator
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
oscillator.type = "sine";
oscillator.connect(audioContext.destination);

// Start the oscillator
oscillator.start();

// Define initial frequency, rate of change, and duration
let frequency = 200;
const frequencyChange = 1;
const duration = 1000;

// Gradually lower frequency over time
const interval = setInterval(() => {
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  frequency -= frequencyChange;
  if (frequency <= 0) {
    clearInterval(interval);
    oscillator.stop();
  }
}, duration / (frequency / frequencyChange));

    }

        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            const ROWS = 20;
            const COLS = 10;
            this.board = new Array(ROWS).fill().map(() => new Array(COLS).fill(0));
            for (let row = 0; row < ROWS; row++) {
              this.board[row] = [];
              for (let col = 0; col < COLS; col++) {
                this.board[row][col] = 0;
              }
            }
            this.piece = this.createPiece();
            this.nextpiece = this.createPiece();
            this.score = 0;
            this.draw();
            this.canvas.addEventListener("keydown", this.handleInput.bind(this));
            this.canvas.setAttribute("tabindex", "0");
            this.canvas.focus();

             // set initial dropCounter and dropInterval values
            this.dropInterval = 1000; // 1 second
            this.dropCounter = 0;
            this.lastTime = Date.now();
            this.deltaTime = 0;
            this.timerId = null;
            this.isRunning = false;
            this.isPaused = false;
            this.level = 1;
            this.threshold = 500;
          }

          dropPieceToBottom() {
            while (this.piece.canMove(0, 1, this.board)) {
            this.piece.moveDown(this.board);
            }

            this.lockPiece();
        }

        // Add this method to the Tetris class
        addEventListeners() {
            // Add an event listener to the window object
            window.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && !this.isPaused && !this.isGameOver()) {
                this.dropPieceToBottom();
            }
            if (event.code === 'KeyP') {
                this.togglePause();
            }
            });
            restartButton.addEventListener('click', () => {
                game.reset();
                restartButton.style.display = 'none';
                gameOverDiv.style.display = 'none';
                pauseButton.style.display = '';
                this.piece.reset();
                this.draw();
                this.isRunning = true;
                this.canvas.focus();
                this.level = 1;
                this.threshold = 100;
                this.dropInterval = 1000;
                this.score = 0;
                this.piece = this.createPiece();
                this.nextpiece = this.createPiece();
                this.run();
              });

            // Add an event listener to the pause button
            pauseButton.addEventListener('click', () => {
            this.togglePause();
            this.canvas.focus();
                });
         
        }
        

            reset() {
                for (let row = 0; row < this.board.length; row++) {
                    for (let col = 0; col < this.board[row].length; col++) {
                        this.board[row][col] = 0;
                    }
                }
            }

              togglePause() { // add a method to handle the pause logic
                if (!this.isPaused) {
                this.isPaused = true;
                console.log('Game paused');
                pauseButton.textContent = 'Resume';
                } else {
                this.isPaused = false;
                console.log('Game resumed');
                pauseButton.textContent = 'Pause';
                }
            }

          

          start() {
            if (!this.isRunning) {
              this.isRunning = true;
              this.board = this.createBoard()
              this.piece.reset();
              this.reset();
              this.run();
            }
        }

            stop() {
                this.isRunning = false;
              }
      
        createBoard() {
          return Array.from({ length: 20 }, () => Array(10).fill(0));
        }
      
        randomPiece() {
          const pieces = "ILJOTSZ";
          const shape = Piece.SHAPES[pieces[pieces.length * Math.random() | 0]];
          return shape;
        }
      
        draw() {
          this.ctx.fillStyle = "#000";
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
          this.drawBoard();
          this.drawPiece();
          this.drawScore();
          this.drawNextPiece();
        }
      
        drawBoard() {
            // Clear the canvas with a background color
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const blockSize = Math.round(this.canvas.width/10);
          
            // Draw the board
            this.board.forEach((row, y) => {
              row.forEach((value, x) => {
                if (value != 0) {
                    // console.log('Filling in value for locked piece')
                  this.ctx.fillStyle = value;
                  this.ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
                }
              });
            });
          }
          
      
        drawPiece() {
            if (!this.isGameOver()) {
            const blockSize = Math.round(this.canvas.width/10);
            const gapWidth = Math.round(blockSize*0.04)
          this.piece.shape.forEach((rowOffset, y) => {
            rowOffset.forEach((value, x) => {
              if (value != 0) {
                this.ctx.fillStyle = this.piece.color;
                this.ctx.fillRect(
                    (this.piece.col + x) * blockSize + gapWidth,
                    (this.piece.row + y) * blockSize + gapWidth,
                    Math.round(blockSize) - gapWidth,
                    Math.round(blockSize) - gapWidth
                );
                // this.ctx.strokeStyle = 'black';
                // this.ctx.strokeRect((this.piece.col + x) * blockSize,(this.piece.row + y)*blockSize, Math.round(blockSize - 0.01*blockSize), Math.round(blockSize - 0.01*blockSize));
              }
            });
          });
        }
        }

        drawNextPiece() {
            const canvas = document.getElementById('next-piece');
            const ctx = canvas.getContext('2d');
          
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          
            // Draw the piece in the center of the canvas
            const blockSize = canvas.width / 4;
            const x = canvas.width / 2 - blockSize / 2;
            const y = canvas.height / 2 - blockSize / 2;
            this.nextpiece.drawNextPiece(canvas, canvas.width / 2, canvas.height / 2);

          }
          

        drawScore() {
            const scoreElement = document.querySelector('#score');
            if (scoreElement){
            scoreElement.textContent = `Score: ${this.score}`;
            }
            levelDiv.textContent = `Level: ${this.level}`;
          }
          
          
      
//   lockPiece() {
//     console.log("Piece locked at:", this.piece.row, this.piece.col);
//     console.log("Board after piece lock:", this.board);

//     const ROWS = 20;
//     const COLS = 10;
//     this.piece.shape.forEach((rowOffset, y) => {
//       rowOffset.forEach((value, x) => {
//         if (value > 0) {
//           const boardY = this.piece.row + y;
//           const boardX = this.piece.col + x;
//           if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
//             this.board[boardY][boardX] = this.piece.color;
//           }
//         }
//       });
//     });
//   }
  lockPiece() {
      
    // Add the piece's blocks to the board array
    const blocks = this.piece.getBlocks();
    for (let block of blocks) {
        const { row: y, col: x } = block;

        this.board[y][x] = COLORS[this.piece.color];

    }
  
    // Check for complete rows and clear them if found
    this.clearRows();

    console.log("Piece locked at:", this.piece.row, this.piece.col);
    console.log("Board after piece lock:", this.board);
  
    // Create a new piece
    this.piece = this.nextpiece;
    this.nextpiece = this.createPiece();
  }
  
      
        checkRows() {
          let rowsCleared = 0;
      
          for (let row = 0; row < this.board.length; row++) {
            if (this.board[row].every((value) => value !== 0)) {
              this.board.splice(row, 1);
              this.board.unshift(Array(10).fill(0));
              rowsCleared++;
            }
          }
      
          this.score += this.calculateScore(rowsCleared);
        }
      
        calculateScore(rowsCleared) {
          const points = [0, 40, 100, 300, 1200];
          return points[rowsCleared];
        }

        isGameOver() {
            const topRow = this.board[0];
            if (topRow.some(value => value != 0)) {
                console.log("Game Over")
                return true;
            }
            else {
                return false;
            }
            };
      
        update() {
            // console.log("Drop counter:", this.dropCounter, "Drop interval:", this.dropInterval);
            if (this.isGameOver() || this.isPaused) {
                this.isRunning = false;
            }
            else {

            const now = Date.now();
            this.deltaTime = now - this.lastTime;
            this.dropCounter += this.deltaTime;
            
            if (this.dropCounter >= this.dropInterval) {
                this.dropCounter = 0;
              if (this.piece.canMove(0, 1, this.board)) {
                // console.log("can move down")
                this.piece.moveDown(this.board);
              } else {
                // console.log("can't move down")
                this.lockPiece();
              }
            }
          
            this.draw();

            if (this.score >= this.threshold) {
                this.level += 1;
                this.threshold *= 2;
                this.dropInterval *= 0.5;
            }
          
            this.lastTime = now;
        }
        if (this.isGameOver()) {
            this.stop();
             // Show the game over message
             document.getElementById("game-over").style.display = "block";
             restartButton.style.display = "inline-block";
             document.getElementById("pause-btn").style.display = "none";
             // Play the game over sound
             this.playGameOverSound()
            return;
        }
        else {
            requestAnimationFrame(() => this.update());
        }  
        }
          
        
        run() {
          

            let requestId;

            const loop = () => {
              if (this.isRunning) {
                // console.log('loop running')
                this.update();
                // requestId = requestAnimationFrame(loop);
              }
        };
          
            loop();
          }
          
          
          createPiece() {
            const pieces = [
                [Pieces.I, "cyan"],
                [Pieces.J, "blue"],
                [Pieces.L, "orange"],
                [Pieces.O, "yellow"],
                [Pieces.S, "green"],
                [Pieces.T, "purple"],
                [Pieces.Z, "red"],
              ];
            const [shape, color] = pieces[Math.floor(Math.random() * pieces.length)];
            return new Piece(shape, color);
          }

          async clearRows() {
            const ROWS = 20;
            const COLS = 10;
            let rowsCleared = 0;
            for (let y = ROWS - 1; y >= 0; y--) {
              let rowFilled = true;
              for (let x = 0; x < COLS; x++) {
                if (this.board[y][x] === 0) {
                  rowFilled = false;
                  break;
                }
              }
              if (rowFilled) {
                // Add a delay before removing the row
                await new Promise(resolve => setTimeout(resolve, 50));
                // Remove the row from the board
                this.board.splice(y, 1);
                // Add a new empty row at the top
                this.board.unshift(Array(COLS).fill(0));
                // Increment the cleared rows count
                this.playClearSound()
                rowsCleared++;
                y++;
              }
            }
            if (rowsCleared > 0) {
              // Add score for cleared rows
              const clearedScore = this.calculateScore(rowsCleared);
              this.score += clearedScore;
              score.setScore(clearedScore);
              score.draw();
            }
          }
          
      
          handleInput(event) {
            console.log("input received");
            switch (event.keyCode) {
              case 37: // left arrow
                if (this.piece.canMove(-1, 0, this.board)) {
                  this.piece.moveLeft(this.board);
                  this.draw();
                }
                break;
              case 39: // right arrow
                if (this.piece.canMove(1, 0, this.board)) {
                  this.piece.moveRight(this.board);
                  this.draw();
                }
                break;
              case 40: // down arrow
                if (this.piece.canMove(0, 1, this.board)) {
                  this.piece.moveDown(this.board);
                  this.draw();
                }
                break;
              case 38: // up arrow
                this.piece.rotate(this.board);
                break;
            }
          }
        }
  // // Get a reference to the nextPiece canvas element
  const nextPieceCanvas = document.getElementById('next-piece');
  const gameOverDiv =  document.getElementById("game-over");
  const levelDiv = document.getElementById("level");  
   const restartButton = document.getElementById("restart-btn");
   const ROWS = 20;
    const COLS = 10;
// document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("tetris");
    const context = canvas.getContext("2d");
   

    
    // // Get the next piece
    // // const nextPiece = this.getNextPiece();
 

    const game = new Tetris(canvas);
    window.addEventListener('keydown', function(e) {
    // Prevent the default browser behavior for arrow keys
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
        e.preventDefault();
    }
    }, false);
    const score = new Score(context, 10, 100, "yellow");

    game.addEventListeners()
    game.start()


    
// });   

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff < 0 ) {
                if (game.piece.canMove(1, 0, game.board)) {
                  game.piece.moveRight(game.board);
                  game.draw();
                }
            /* right swipe */ 
        } else {
            if (game.piece.canMove(-1, 0, game.board)) {
              game.piece.moveLeft(game.board);
              game.draw();
            }
        }                       
    } else {
        if ( yDiff < 0 ) {
          if (game.piece.canMove(0, 1, game.board)) {
            if (!game.isPaused && ! game.isGameOver()) {
                game.dropPieceToBottom();
                game.draw();
            }
            // game.piece.moveDown(game.board);
          }
            /* down swipe */ 
        } else { 
          game.piece.rotate(game.board)
            /* up swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};
          // handleInput(event) {
          //   console.log("input received");
          //   switch (event.keyCode) {
          //     case 37: // left arrow
          //       if (this.piece.canMove(-1, 0, this.board)) {
          //         this.piece.moveLeft(this.board);
          //         this.draw();
          //       }
          //       break;
          //     case 39: // right arrow
          //       if (this.piece.canMove(1, 0, this.board)) {
          //         this.piece.moveRight(this.board);
          //         this.draw();
          //       }
          //       break;
          //     case 40: // down arrow
          //       if (this.piece.canMove(0, 1, this.board)) {
          //         this.piece.moveDown(this.board);
          //         this.draw();
          //       }
          //       break;
          //     case 38: // up arrow
          //       this.piece.rotate(this.board);
          //       break;
          //   }
          // }