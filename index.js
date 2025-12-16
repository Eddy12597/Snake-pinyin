// 游戏配置
const CONFIG = {
	GAME_TIME: 600,
	GRID_SIZE: 20,
	SNAKE_SPEED: 4,
	CORRECT_SCORE: 10,
	WRONG_PENALTY: 5,
};

// 游戏状态
let gameState = {
	playerName: "",
	score: 0,
	gameRunning: false,
	gamePaused: false,
	timeLeft: CONFIG.GAME_TIME,
	timerInterval: null,
	lastRenderTime: 0,
	snake: [],
	foods: [],
	currentQuestion: null,
	userSelection: null,
	direction: { x: 1, y: 0 }, // 改为对象形式
	isChoosing: true,
	snakeSpeedCounter: 0, // 速度控制计数器
	speedDivider: 10, // from 10 to 3, as time from 0 to 600
	lastSpeedUpdate: 0,
};

// let speedDivDecSlope = (1 - 10) / (10 * 60) / 1000;

let lastSpdDiv = 10;
let lastWord = "";
// 题目数据集 - 简化版，不显示正确错误
const questionSets = [
	{ word: "召开", correct: "zhào kāi", wrong: "zhāo kāi" },
	{ word: "勉强", correct: "miǎn qiǎng", wrong: "mián qiáng" },
	{ word: "妥协", correct: "tuǒ xié", wrong: "tuǒ xiě" },
	{ word: "复辟", correct: "fù bì", wrong: "fù pì" },
	{ word: "警惕", correct: "jǐng tì", wrong: "jǐng tí" },
	{ word: "侮辱", correct: "wǔ rǔ", wrong: "wū rǔ" },
	{ word: "寒噤", correct: "hán jìn", wrong: "hán jīn" },
	{ word: "寒暄", correct: "hán xuān", wrong: "hán xuàn" },
	{ word: "霎时", correct: "shà shí", wrong: "chà shí" },
	{ word: "熙熙攘攘", correct: "xī xī rǎng rǎng", wrong: "xī xī rāng rāng" },
	{ word: "运筹帷幄", correct: "yùn chóu wéi wò", wrong: "yùn chóu wéi wù" },
	{ word: "长途跋涉", correct: "cháng tú bá shè", wrong: "cháng tú pá shè" },
	{ word: "紫荆花", correct: "zǐ jīng huā", wrong: "zǐ jīn huā" },
	{ word: "掩映", correct: "yǎn yìng", wrong: "yǎn yìn" },
	{ word: "世人瞩目", correct: "shì rén zhǔ mù", wrong: "shì rén shǔ mù" },
	{ word: "咄咄", correct: "duō duō", wrong: "chū chū" },
	{ word: "污垢", correct: "wū gòu", wrong: "wū hòu" },
	{ word: "颤抖", correct: "chàn dǒu", wrong: "zhàn dǒu" },
	{ word: "佣金", correct: "yòng jīn", wrong: "yōng jīn" },
	{ word: "憔悴", correct: "qiáo cuì", wrong: "qiáo suì" },
	{ word: "诨名", correct: "hùn míng", wrong: "hūn míng" },
	{ word: "呜咽", correct: "wū yè", wrong: "wū yān" },
	{ word: "赚钱", correct: "zhuàn qián", wrong: "zuàn qián" },
	{ word: "放肆", correct: "fàng sì", wrong: "fàng cì" },
	{ word: "纠葛", correct: "jiū gé", wrong: "jiū gě" },
	{ word: "干酪", correct: "gān lào", wrong: "gān luò" },
	{ word: "诉讼", correct: "sù sòng", wrong: "shù sòng" },
	{ word: "琢磨", correct: "zuó mo", wrong: "zhuó mó" },
	{ word: "邋遢", correct: "lā ta", wrong: "là tā" },
	{ word: "慰藉", correct: "wèi jiè", wrong: "wèi jí" },
	{ word: "偏僻", correct: "piān pì", wrong: "piān pǐ" },
	{ word: "孤苦伶仃", correct: "gū kǔ líng dīng", wrong: "gū kǔ líng dìng" },
	{ word: "孑然一身", correct: "jié rán yì shēn", wrong: "zǐ rán yì shēn" },
	{ word: "嫣然", correct: "yān rán", wrong: "yán rán" },
	{ word: "斜睨", correct: "xié nì", wrong: "xié ní" },
	{ word: "褴褛", correct: "lán lǚ", wrong: "lán lǒu" },
	{ word: "哽住", correct: "gěng zhù", wrong: "gēng zhù" },
	{ word: "饶恕", correct: "ráo shù", wrong: "ráo xù" },
	{ word: "害臊", correct: "hài sào", wrong: "hài zào" },
	{ word: "擤鼻涕", correct: "xǐng bí tì", wrong: "xǐng bí tī" },
	{ word: "瞟一眼", correct: "piǎo yì yǎn", wrong: "piāo yì yǎn" },
	{ word: "瞅一眼", correct: "chǒu yì yǎn", wrong: "qiū yì yǎn" },
	{ word: "鬈发", correct: "quán fà", wrong: "juǎn fà" },
	{ word: "窘态", correct: "jiǒng tài", wrong: "jūn tài" },
	{ word: "踱步", correct: "duó bù", wrong: "dù bù" },
	{ word: "堕落", correct: "duò luò", wrong: "zhuì luò" },
	{ word: "妖媚", correct: "yāo mèi", wrong: "yāo méi" },
];
let canvas, ctx;
var correctAudio = new Audio("./assets/correct_effect.mp3");
var incorrectAudio = new Audio("./assets/wrong_effect.mp3");
var bgAudio = new Audio("./assets/gimkit_flisl.mp3");
// 初始化
function init() {
	var correctAudio = new Audio("./assets/correct_effect.mp3");
	var incorrectAudio = new Audio("./assets/wrong_effect.mp3");
	var bgAudio = new Audio("./assets/gimkit_flisl.mp3");
	canvas = document.getElementById("game-canvas");
	ctx = canvas.getContext("2d");
	setupEventListeners();

	console.log("游戏初始化完成！");
}

// 事件监听
function setupEventListeners() {
	document.getElementById("start-btn").addEventListener("click", startGame);
	document.getElementById("pause-btn").addEventListener("click", togglePause);
	document.getElementById("exit-btn").addEventListener("click", backToLogin);
	document.addEventListener("keydown", handleKeyPress);
}

// 游戏控制
function startGame() {
	const nameInput = document.getElementById("player-name");
	const playerName = nameInput.value.trim();

	if (!playerName) {
		alert("请输入你的姓名！");
		nameInput.focus();
		return;
	}

	gameState.playerName = playerName;
	document.getElementById("display-name").textContent = playerName;

	document.getElementById("login-page").style.display = "none";
	document.getElementById("game-page").style.display = "block";

	resetGame();
	startTimer();

	gameState.lastRenderTime = performance.now();
	requestAnimationFrame(gameLoop);
}

function resetGame() {
	gameState.score = 0;
	gameState.timeLeft = CONFIG.GAME_TIME;
	gameState.gameRunning = true;
	gameState.gamePaused = false;
	gameState.direction = { x: 1, y: 0 };
	gameState.foods = [];
	gameState.userSelection = null;
	gameState.isChoosing = false;
	gameState.snakeSpeedCounter = 0;

	gameState.snake = [
		{ x: 5, y: 10 },
		{ x: 4, y: 10 },
		{ x: 3, y: 10 },
	];

	document.getElementById("correct-count").textContent = "0";
	document.getElementById("wrong-count").textContent = "0";

	generateFoodPair();

	updateDisplay();
	updateTimerDisplay();
}

function generateFoodPair() {

	let question = questionSets[Math.floor(Math.random() * questionSets.length)];; // {word: string; correct: string; wrong: string;}
	do {
		question =
		questionSets[Math.floor(Math.random() * questionSets.length)];
	} while (question.word === lastWord);
	lastWord = question.word;
	gameState.foods = [];
	// gameState.userSelection = null;
	// gameState.isChoosing = true;

	document.getElementById("current-word").textContent = question.word;

	// 清空选项
	// const optionsContainer = document.getElementById("food-options");
	// optionsContainer.innerHTML = "";

	// 清空选择状态
	// const statusElement = document.getElementById("selection-status");
	// statusElement.style.display = "none";
	// statusElement.innerHTML = "";

	// 随机决定哪个是正确选项（0或1）
	const correctIsFirst = Math.random() > 0.5;

	// 生成两个选项
	const options = [
		{
			pinyin: correctIsFirst ? question.correct : question.wrong,
			isCorrect: correctIsFirst,
			index: 0,
		},
		{
			pinyin: correctIsFirst ? question.wrong : question.correct,
			isCorrect: !correctIsFirst,
			index: 1,
		},
	];

	// 生成选项按钮
	// options.forEach((option) => {
	// 	const optionDiv = document.createElement("div");
	// 	optionDiv.className = "food-option";
	// 	optionDiv.dataset.index = option.index;
	// 	optionDiv.dataset.isCorrect = option.isCorrect;

	// 	// 使用灰色背景，黑色文字
	// 	optionDiv.style.background = "#f5f5f5";
	// 	optionDiv.style.borderColor = "#ddd";

	// 	optionDiv.innerHTML = `
    //                 <div class="pinyin-display" style="color: #333; font-size: 1.2em;">${option.pinyin}</div>
    //             `;

	// 	optionDiv.addEventListener("click", () =>
	// 		handleOptionSelect(option.index, option.isCorrect)
	// 	);
	// 	// optionsContainer.appendChild(optionDiv);
	// });

	const gridWidth = canvas.width / CONFIG.GRID_SIZE;
	const gridHeight = canvas.height / CONFIG.GRID_SIZE;

	// 生成两个食物位置（上下分开）
	let food1, food2;
	do {
		food1 = {
			x: Math.floor(Math.min(Math.max(Math.random() * gridWidth * 0.7, 0), gridWidth) + 0.5),
			y: Math.floor(Math.min(Math.max(Math.random() * gridHeight * 0.7, 0), gridHeight) + 0.5),
			pinyin: options[0].pinyin,
			isCorrect: options[0].isCorrect,
			optionIndex: 0,
			word: question.word,
			correctPinyin: correctIsFirst ? options[0].pinyin : options[1].pinyin,
		};

		food2 = {
			x: Math.floor(Math.min(Math.max(Math.random() * gridWidth * 0.7, 0), gridWidth) + 0.5),
			y: Math.floor(Math.min(Math.max(Math.random() * gridHeight * 0.7, 0), gridHeight) + 0.5),
			pinyin: options[1].pinyin,
			isCorrect: options[1].isCorrect,
			optionIndex: 1,
			word: question.word,
			correctPinyin: correctIsFirst ? options[0].pinyin : options[1].pinyin,
		};
	} while (Math.abs(food1.x - food2.x) < 2 && Math.abs(food1.y - food2.y) < 2);

	// 调整位置避免重叠
	[food1, food2].forEach((food) => {
		let foodOnSnake, foodTooNear;
		let attempts = 0;
		const maxAttempts = 50;

		do {
			foodOnSnake = gameState.snake.some(
				(segment) => segment.x === food.x && segment.y === food.y
			);

			if (foodOnSnake) {
				// 重新生成位置
				food.x = Math.floor(Math.random() * (gridWidth - 4)) + 2;
				food.y = Math.floor(Math.random() * (gridHeight - 4)) + 2;
			}

			foodTooNear = Math.abs(food1.x - food2.x) <= 2 && Math.abs(food1.y - food2.y) <= 2;
			if (foodTooNear) {
				continue;
			} // Is this right??

			attempts++;
			if (attempts > maxAttempts) {
				// 放在安全区域
				food.x = Math.floor(gridWidth / 2);
				food.y =
					food.optionIndex === 0
						? Math.floor(gridHeight * 0.3)
						: Math.floor(gridHeight * 0.7);
				break;
			}
		} while (foodOnSnake);
	});

	gameState.foods.push(food1, food2);
	console.log("生成食物对：", question.word);
}

function handleOptionSelect(index, isCorrect) {
	if (!gameState.isChoosing) return;

	gameState.userSelection = index;
	gameState.isChoosing = false;

	const options = document.querySelectorAll(".food-option");
	options.forEach((opt) => {
		opt.classList.remove("selected");
	});
	options[index].classList.add("selected");

	const statusElement = document.getElementById("selection-status");
	statusElement.style.display = "block";
	statusElement.innerHTML = `
                <div style="font-weight: bold; color: #333;">
                    已选择：${gameState.foods[index].pinyin}
                </div>
                <div style="font-size: 0.9em; margin-top: 5px; color: #666;">
                    现在控制蛇去吃这个食物
                </div>
            `;

	document.getElementById("hint-text").textContent =
		"控制蛇去吃你选择的食物（方向键或WASD）";
}

// 游戏循环
function gameLoop(currentTimestamp) {
    if (!gameState.gameRunning || gameState.gamePaused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    // 每秒更新一次速度，逐渐加快
    if (currentTimestamp - gameState.lastSpeedUpdate > 1000) {
        gameState.lastSpeedUpdate = currentTimestamp;
        
        // 随着时间的推移，逐渐减少 speedDivider（加快速度）
        const timeElapsed = CONFIG.GAME_TIME - gameState.timeLeft;
        const progress = timeElapsed / CONFIG.GAME_TIME;
        
        // 从 10 逐渐减少到 1，随着游戏时间减少
        gameState.speedDivider = Math.max(1, 10 - (progress * 7));
        
        console.log(`速度更新: ${gameState.speedDivider} (时间: ${gameState.timeLeft}s)`);
    }

    const secondsSinceLastRender =
        (currentTimestamp - gameState.lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / 60) {
        requestAnimationFrame(gameLoop);
        return;
    }

    gameState.lastRenderTime = currentTimestamp;

    // 使用 speedDivider 控制移动频率
    gameState.snakeSpeedCounter++;
    if (gameState.snakeSpeedCounter >= gameState.speedDivider) {
        gameState.snakeSpeedCounter = 0;
        updateGame();
    }

    drawGame();
    requestAnimationFrame(gameLoop);
}

let wrongAnswers = new Set();
let wrongAnswersList = []

function showWrongAnswers() {
	if (!gameState.gamePaused) {
		togglePause();
	}
	wrongAnswersList = [ ...wrongAnswers ];
	
	console.log("showWrongAnswers()");
	for (let i = 0; i < wrongAnswersList.length; i++) {
		console.log(`${i + 1}: ${wrongAnswersList[i].word}: 正确：${wrongAnswersList[i].correct}, 错误：${wrongAnswersList[i].pinyin}`);
	}

	// add animation, pop-up, showing wrong and correct aswes
}

function updateGame() {
	const head = { ...gameState.snake[0] };

	// 移动头部
	head.x += gameState.direction.x;
	head.y += gameState.direction.y;

	gameState.snake.unshift(head);

	// 检查食物碰撞
	let foodEaten = false;

	for (let i = 0; i < gameState.foods.length; i++) {
		const food = gameState.foods[i];
		if (head.x === food.x && head.y === food.y) {
			console.log("吃到食物:", food.pinyin, "是否正确:", food.isCorrect);

			// 检查吃的是否是用户选择的食物
			// if (food.optionIndex === gameState.userSelection) {
				if (food.isCorrect) {
					correctAudio.play();
					// 选择正确且吃掉了
					gameState.score += CONFIG.CORRECT_SCORE;
					const correctCount =
						parseInt(document.getElementById("correct-count").textContent) + 1;
					document.getElementById("correct-count").textContent = correctCount;
					showFeedback(`✓ 正确！+${CONFIG.CORRECT_SCORE}分`, true);

					// 正确：长度不变，移除尾部一节（保持长度）
					gameState.snake.pop();
				} else {
					incorrectAudio.play();
					// 选择错误但吃掉了
					gameState.score = Math.max(0, gameState.score - CONFIG.WRONG_PENALTY);
					const wrongCount =
						parseInt(document.getElementById("wrong-count").textContent) + 1;
					document.getElementById("wrong-count").textContent = wrongCount;
					showFeedback(`✗ 错误！-${CONFIG.WRONG_PENALTY}分`, false);
					wrongAnswers.add({
						word: food.word,
						pinyin: food.pinyin,
						correct: food.correctPinyin,
					});
					// 错误：蛇变长（增加一节），不pop
					console.log("选择错误，蛇变长增加难度");
				}

				// 无论对错，都生成新题目
				setTimeout(() => {
					generateFoodPair();
				}, 600);
			// } else {
			// 	// 吃错了食物（不是用户选择的）
			// 	showFeedback("❌ 请吃你选择的食物！", false);
			// 	// 吃错食物：蛇退回原位
			// 	gameState.snake.shift();
			// }

			foodEaten = true;
			break;
		}
	}

	if (!foodEaten) {
		gameState.snake.pop();
	}

	checkCollisions();
	updateDisplay();
}

function showFeedback(message, isCorrect) {
	const feedback = document.createElement("div");
	feedback.style.position = "fixed";
	feedback.style.left = "50%";
	feedback.style.top = "50%";
	feedback.style.transform = "translate(-50%, -50%)";
	feedback.style.padding = "15px 25px";
	feedback.style.borderRadius = "10px";
	feedback.style.fontWeight = "bold";
	feedback.style.fontSize = "1.2em";
	feedback.style.zIndex = "1000";
	feedback.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
	feedback.style.animation = "fadeOut 1.5s forwards";

	if (isCorrect) {
		feedback.textContent = message;
		feedback.style.background = "#4CAF50";
		feedback.style.color = "white";
		feedback.style.border = "3px solid #2e7d32";
	} else {
		feedback.textContent = message;
		feedback.style.background = "#f44336";
		feedback.style.color = "white";
		feedback.style.border = "3px solid #c62828";
	}

	document.body.appendChild(feedback);
	setTimeout(() => feedback.remove(), 1500);
}

function checkCollisions() {
	const head = gameState.snake[0];
	const gridWidth = canvas.width / CONFIG.GRID_SIZE;
	const gridHeight = canvas.height / CONFIG.GRID_SIZE;

	if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
		gameOver("撞墙了！");
		return;
	}

	for (let i = 1; i < gameState.snake.length; i++) {
		if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
			gameOver("撞到自己了！");
			return;
		}
	}
}

// 绘制
function drawGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// 绘制网格背景
	drawGrid();

	// 绘制食物
	drawFoods();

	// 绘制蛇
	drawSnake();
}

function drawGrid() {
	ctx.strokeStyle = "#f0f0f0";
	ctx.lineWidth = 0.5;

	for (let x = 0; x <= canvas.width; x += CONFIG.GRID_SIZE) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
		ctx.stroke();
	}

	for (let y = 0; y <= canvas.height; y += CONFIG.GRID_SIZE) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.stroke();
	}
}

function drawSnake() {
	gameState.snake.forEach((segment, index) => {
		const isHead = index === 0;

		if (isHead) {
			ctx.fillStyle = "#2196F3"; // 蛇头蓝色
		} else {
			const alpha = 0.7 + (index / gameState.snake.length) * 0.3;
			ctx.fillStyle = `rgba(76, 175, 80, ${alpha})`; // 蛇身绿色渐变
		}

		ctx.fillRect(
			segment.x * CONFIG.GRID_SIZE,
			segment.y * CONFIG.GRID_SIZE,
			CONFIG.GRID_SIZE - 1,
			CONFIG.GRID_SIZE - 1
		);

		if (isHead) {
			drawSnakeEyes(segment);
		}
	});
}

function drawSnakeEyes(head) {
	const eyeSize = 3;
	const offset = 4;

	ctx.fillStyle = "white";

	// 根据方向绘制眼睛
	const dirX = gameState.direction.x;
	const dirY = gameState.direction.y;

	if (dirX > 0) {
		// 向右
		ctx.fillRect(
			head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE - offset,
			head.y * CONFIG.GRID_SIZE + offset,
			eyeSize,
			eyeSize
		);
		ctx.fillRect(
			head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE - offset,
			head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE - offset - eyeSize,
			eyeSize,
			eyeSize
		);
	} else if (dirX < 0) {
		// 向左
		ctx.fillRect(
			head.x * CONFIG.GRID_SIZE + offset - eyeSize,
			head.y * CONFIG.GRID_SIZE + offset,
			eyeSize,
			eyeSize
		);
		ctx.fillRect(
			head.x * CONFIG.GRID_SIZE + offset - eyeSize,
			head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE - offset - eyeSize,
			eyeSize,
			eyeSize
		);
	} else if (dirY < 0) {
		// 向上
		ctx.fillRect(
			head.x * CONFIG.GRID_SIZE + offset,
			head.y * CONFIG.GRID_SIZE + offset - eyeSize,
			eyeSize,
			eyeSize
		);
		ctx.fillRect(
			head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE - offset - eyeSize,
			head.y * CONFIG.GRID_SIZE + offset - eyeSize,
			eyeSize,
			eyeSize
		);
	} else if (dirY > 0) {
		// 向下
		ctx.fillRect(
			head.x * CONFIG.GRID_SIZE + offset,
			head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE - offset,
			eyeSize,
			eyeSize
		);
		ctx.fillRect(
			head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE - offset - eyeSize,
			head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE - offset,
			eyeSize,
			eyeSize
		);
	}
}

function drawFoods() {
	gameState.foods.forEach((food) => {
		// 所有食物使用橙色
		ctx.fillStyle = "#FF9800";

		ctx.beginPath();
		ctx.arc(
			food.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
			food.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
			CONFIG.GRID_SIZE / 2 - 1,
			0,
			Math.PI * 2
		);
		ctx.fill();

		// 添加发光效果
		ctx.shadowColor = "rgba(255, 152, 0, 0.8)";
		ctx.shadowBlur = 8;
		ctx.fill();
		ctx.shadowBlur = 0;

		// 绘制拼音文字（黑色，更清晰）
		ctx.fillStyle = "#000000"; // 黑色
		ctx.font = "bold 14px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		// 显示完整拼音
		ctx.fillText(
			food.pinyin,
			food.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
			food.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2
		);

		// 如果这是用户选择的食物，添加一个白色边框
		if (gameState.userSelection === food.optionIndex) {
			ctx.strokeStyle = "#FFFFFF"; // 白色边框
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(
				food.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
				food.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
				CONFIG.GRID_SIZE / 2 + 2,
				0,
				Math.PI * 2
			);
			ctx.stroke();
		}
	});
}

// 辅助函数
function updateDisplay() {
	document.getElementById("score").textContent = gameState.score;
	document.getElementById("snake-length").textContent = gameState.snake.length;
}

function updateTimerDisplay() {
	const minutes = Math.floor(gameState.timeLeft / 60);
	const seconds = gameState.timeLeft % 60;
	document.getElementById("timer").textContent = `${minutes
		.toString()
		.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// also plays bg audio
function startTimer() {
	setTimeout(() => {
		bgAudio.play();
	}, 300);
	bgAudio.loop = true;

	if (gameState.timerInterval) clearInterval(gameState.timerInterval);

	gameState.timerInterval = setInterval(() => {
		if (!gameState.gameRunning || gameState.gamePaused) return;

		gameState.timeLeft--;
		updateTimerDisplay();

		if (gameState.timeLeft <= 0) {
			gameOver("时间到！");
		}
	}, 1000);
}

function togglePause() {
	gameState.gamePaused = !gameState.gamePaused;
	if (!gameState.gamePaused) {
		bgAudio.play();
	} else {
		bgAudio.pause();
	}
	document.getElementById("pause-btn").innerHTML = gameState.gamePaused
		? '<i class="fas fa-play"></i> 继续'
		: '<i class="fas fa-pause"></i> 暂停';
}

function gameOver(reason) {
	gameState.gameRunning = false;
	clearInterval(gameState.timerInterval);

	setTimeout(() => {
		const finalScore = gameState.score;
		const correctCount = document.getElementById("correct-count").textContent;
		const wrongCount = document.getElementById("wrong-count").textContent;
		// TODO
		alert(
			`游戏结束！\n${reason}\n\n` +
			`最终得分: ${finalScore}\n` +
			`正确读音: ${correctCount}个\n` +
			`错误读音: ${wrongCount}个\n` +
			`正确率: ${Math.round(
				(correctCount / (parseInt(correctCount) + parseInt(wrongCount))) *
				100
			) || 0
			}%`
		);
		bgAudio.pause();
		showWrongAnswers();
		backToLogin();
	}, 500);
}

function backToLogin() {
	gameState.gameRunning = false;
	clearInterval(gameState.timerInterval);

	document.getElementById("game-page").style.display = "none";
	document.getElementById("login-page").style.display = "block";
}

/**
 * 
 * @param {KeyboardEvent} e 
 * @returns
 */
function handleKeyPress(e) {
	console.log(`Raw key pressed: ${e.key}`)
	if (!gameState.gameRunning || gameState.isChoosing) return;

	const key = e.key.toLowerCase();

	if (key === "p" || key === "space") {
		togglePause();
		return;
	}

	if (gameState.gamePaused) return;

	// 防止反向移动
	console.log(`Key pressed: ${key}\ngameState.direction.x: ${gameState.direction.x}\ngameState.direction.y: ${gameState.direction.y}`);
	if ((key === "arrowup" || key === "w") && gameState.direction.y !== 1) {
		gameState.direction = { x: 0, y: -1 };
	} else if (
		(key === "arrowdown" || key === "s") &&
		gameState.direction.y !== -1
	) {
		gameState.direction = { x: 0, y: 1 };
	} else if (
		(key === "arrowleft" || key === "a") &&
		gameState.direction.x !== 1
	) {
		gameState.direction = { x: -1, y: 0 };
	} else if (
		(key === "arrowright" || key === "d") &&
		gameState.direction.x !== -1
	) {
		gameState.direction = { x: 1, y: 0 };
	}

	e.preventDefault(); // 防止页面滚动
}

function handleClickReview() {
	showWrongAnswers();
}

// 添加CSS动画
const style = document.createElement("style");
style.textContent = `
            @keyframes fadeOut {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -100%) scale(0.5); }
            }
        `;
document.head.appendChild(style);

// 页面加载完成后初始化
window.addEventListener("DOMContentLoaded", init);
