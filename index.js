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
	hearts: 3,
};

// let speedDivDecSlope = (1 - 10) / (10 * 60) / 1000;

let lastSpdDiv = 10;
let lastWord = "";
// 题目数据集 - 简化版，不显示正确错误
const questionSets = [

	// 字音
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

	// 字形

	{ word: "zhào kāi", correct: "召开", wrong: "召号" },
	{ word: "miǎn qiǎng", correct: "勉强", wrong: "免强" },
	{ word: "tuǒ xié", correct: "妥协", wrong: "妥胁" },
	{ word: "fù bì", correct: "复辟", wrong: "复僻" },
	{ word: "jǐng tì", correct: "警惕", wrong: "警剔" },
	{ word: "wǔ rǔ", correct: "侮辱", wrong: "污辱" },
	{ word: "bù qū bù náo", correct: "不屈不挠", wrong: "不屈不饶" },
	{ word: "yǒng chuí bù xiǔ", correct: "永垂不朽", wrong: "永垂不巧" },
	{ word: "hán jìn", correct: "寒噤", wrong: "寒禁" },
	{ word: "hán xuān", correct: "寒暄", wrong: "寒喧" },
	{ word: "shà shí", correct: "霎时", wrong: "刹时" },
	{ word: "xī xī rǎng rǎng", correct: "熙熙攘攘", wrong: "熙熙嚷嚷" },
	{ word: "yùn chóu wéi wò", correct: "运筹帷幄", wrong: "运筹帷握" },
	{ word: "cháng tú bá shè", correct: "长途跋涉", wrong: "长途拔涉" },
	{ word: "hù sù zhōng cháng", correct: "互诉衷肠", wrong: "互诉忠肠" },
	{ word: "pāi shǒu chēng kuài", correct: "拍手称快", wrong: "拍手成快" },
	{ word: "zǐ jīng huā", correct: "紫荆花", wrong: "紫金花" },
	{ word: "yǎn yìng", correct: "掩映", wrong: "眼映" },
	{ word: "shì rén zhǔ mù", correct: "世人瞩目", wrong: "世人嘱目" },
	{ word: "duō duō", correct: "咄咄", wrong: "拙拙" },
	{ word: "wū gòu", correct: "污垢", wrong: "污够" },
	{ word: "chàn dǒu", correct: "颤抖", wrong: "擅抖" },
	{ word: "yòng jīn", correct: "佣金", wrong: "拥金" },
	{ word: "qiáo cuì", correct: "憔悴", wrong: "憔瘁" },
	{ word: "hùn míng", correct: "诨名", wrong: "浑名" },
	{ word: "wū yè", correct: "呜咽", wrong: "呜烟" },
	{ word: "zhuàn qián", correct: "赚钱", wrong: "嫌钱" },
	{ word: "fàng sì", correct: "放肆", wrong: "放事" },
	{ word: "jiū gé", correct: "纠葛", wrong: "纠隔" },
	{ word: "gān lào", correct: "干酪", wrong: "干络" },
	{ word: "sù sòng", correct: "诉讼", wrong: "诉松" },
	{ word: "zuó mo", correct: "琢磨", wrong: "啄磨" },
	{ word: "lā ta", correct: "邋遢", wrong: "拉塌" },
	{ word: "wèi jiè", correct: "慰藉", wrong: "慰籍" },
	{ word: "piān pì", correct: "偏僻", wrong: "偏辟" },
	{ word: "gū kǔ líng dīng", correct: "孤苦伶仃", wrong: "孤苦零丁" },
	{ word: "duō duō guài shì", correct: "咄咄怪事", wrong: "拙拙怪事" },
	{ word: "qū zūn fǔ jiù", correct: "屈尊俯就", wrong: "屈尊伏就" },
	{ word: "shí lái yùn zhuǎn", correct: "时来运转", wrong: "时来运传" },
	{ word: "jú cù bù ān", correct: "局促不安", wrong: "局触不安" },
	{ word: "jié rán yī shēn", correct: "孑然一身", wrong: "孑孓一身" },
	{ word: "yān rán", correct: "嫣然", wrong: "焉然" },
	{ word: "xié nì", correct: "斜睨", wrong: "斜倪" },
	{ word: "lán lǚ", correct: "褴褛", wrong: "篮缕" },
	{ word: "gěng zhù", correct: "哽住", wrong: "埂住" },
	{ word: "ráo shù", correct: "饶恕", wrong: "绕恕" },
	{ word: "hài sào", correct: "害臊", wrong: "害躁" },
	{ word: "xǐng bí tì", correct: "擤鼻涕", wrong: "醒鼻涕" },
	{ word: "piǎo yī yǎn", correct: "瞟一眼", wrong: "票一眼" },
	{ word: "chǒu yī yǎn", correct: "瞅一眼", wrong: "秋一眼" },
	{ word: "quán fà", correct: "鬈发", wrong: "卷发" },
	{ word: "jiǒng tài", correct: "窘态", wrong: "炯态" },
	{ word: "duó bù", correct: "踱步", wrong: "渡步" },
	{ word: "duò luò", correct: "堕落", wrong: "坠落" },
	{ word: "yāo mèi", correct: "妖媚", wrong: "妖魅" },
	{ word: "yān rán yī xiào", correct: "嫣然一笑", wrong: "焉然一笑" },
	{ word: "duó kuàng ér chū", correct: "夺眶而出", wrong: "夺框而出" },
	{ word: "yī guān chǔ chǔ", correct: "衣冠楚楚", wrong: "衣冠处处" },
	{ word: "jié rán bù tóng", correct: "截然不同", wrong: "绝然不同" },
	{ word: "bǐ yí bù xiè", correct: "鄙夷不屑", wrong: "鄙疑不屑" },
	{ word: "duò xìng", correct: "惰性", wrong: "堕性" },
	{ word: "qián chéng", correct: "虔诚", wrong: "虔成" },
	{ word: "biān zuǎn", correct: "编纂", wrong: "编篡" },
	{ word: "kāi pì", correct: "开辟", wrong: "开僻" },
	{ word: "zhóu xiàn", correct: "轴线", wrong: "轴钱" },
	{ word: "yā zhòu", correct: "压轴", wrong: "压宙" },
	{ word: "guī gēn dào dǐ", correct: "归根到底", wrong: "归根到低" },
	{ word: "nú yán bì xī", correct: "奴颜婢膝", wrong: "奴颜卑膝" },
	{ word: "jīng pí lì jié", correct: "精疲力竭", wrong: "精疲力解" },
	{ word: "zì zhēn jù zhuó", correct: "字斟句酌", wrong: "字斟句灼" },
	{ word: "luó ji", correct: "逻辑", wrong: "逻缉" },
	{ word: "zhú sǔn", correct: "竹笋", wrong: "竹筍" },
	{ word: "zhūn zhūn", correct: "谆谆", wrong: "淳淳" },
	{ word: "zhěn zhì", correct: "诊治", wrong: "珍治" },
	{ word: "làn diào", correct: "滥调", wrong: "烂调" },
	{ word: "yì zào", correct: "臆造", wrong: "意造" },
	{ word: "bì sè", correct: "闭塞", wrong: "闭涩" },
	{ word: "píng sāi", correct: "瓶塞", wrong: "瓶赛" },
	{ word: "biān sài", correct: "边塞", wrong: "边赛" },
	{ word: "qīn chāi", correct: "钦差", wrong: "亲差" },
	{ word: "chā cuò", correct: "差错", wrong: "差措" },
	{ word: "cēn cī", correct: "参差", wrong: "参插" },
	{ word: "shēng tūn huó bō", correct: "生吞活剥", wrong: "生吞活拨" },
	{ word: "bāo huā shēng", correct: "剥花生", wrong: "拨花生" },
	{ word: "qián pū hòu jì", correct: "前仆后继", wrong: "前扑后继" },
	{ word: "yǒu dì fàng shǐ", correct: "有的放矢", wrong: "有的放失" },
	{ word: "huá zhòng qǔ chǒng", correct: "哗众取宠", wrong: "华众取宠" },
	{ word: "tú yǒu xū míng", correct: "徒有虚名", wrong: "徒有虚明" },
	{ word: "ruò míng ruò àn", correct: "若明若暗", wrong: "若名若暗" },
	{ word: "kuā kuā qí tán", correct: "夸夸其谈", wrong: "夸夸奇谈" },
	{ word: "miù zhǒng liú chuán", correct: "谬种流传", wrong: "缪种流传" },
	{ word: "huá ér bù shí", correct: "华而不实", wrong: "花而不实" },
	{ word: "yú lùn", correct: "舆论", wrong: "与论" },
	{ word: "miù wù", correct: "谬误", wrong: "缪误" },
	{ word: "hàn wèi", correct: "捍卫", wrong: "悍卫" },
	{ word: "hú zhōu", correct: "胡诌", wrong: "胡邹" },
	{ word: "zǎi gē", correct: "宰割", wrong: "载割" },
	{ word: "jiā suǒ", correct: "枷锁", wrong: "驾锁" },
	{ word: "jìn gù", correct: "禁锢", wrong: "禁固" },
	{ word: "xuē ruò", correct: "削弱", wrong: "消弱" },
	{ word: "xiāo guǒ pí", correct: "削果皮", wrong: "消果皮" },
	{ word: "dǎ lèi", correct: "打擂", wrong: "打雷" },
	{ word: "zì chuī zì léi", correct: "自吹自擂", wrong: "自吹自雷" },
	{ word: "wú jī zhī tán", correct: "无稽之谈", wrong: "无嵇之谈" },
	{ word: "wǔ huā bā mén", correct: "五花八门", wrong: "五化八门" },
	{ word: "liáo luò", correct: "寥落", wrong: "了落" },
	{ word: "xǐ dí", correct: "洗涤", wrong: "洗条" },
	{ word: "chóu chú", correct: "踌躇", wrong: "踌蹰" },
	{ word: "jié ào", correct: "桀骜", wrong: "桀傲" },
	{ word: "lìn wū", correct: "赁屋", wrong: "任屋" },
	{ word: "è hào", correct: "噩耗", wrong: "恶耗" },
	{ word: "shī hái", correct: "尸骸", wrong: "尸亥" },
	{ word: "tú lù", correct: "屠戮", wrong: "屠戳" },
	{ word: "jìn zì", correct: "浸渍", wrong: "浸责" },
	{ word: "fēi hóng", correct: "绯红", wrong: "非红" },
	{ word: "cuán shè", correct: "攒射", wrong: "赞射" },
	{ word: "jī zǎn", correct: "积攒", wrong: "积赞" },
	{ word: "mǒ shā", correct: "抹杀", wrong: "抹煞" },
	{ word: "mā bù", correct: "抹布", wrong: "麻布" },
	{ word: "fěi bó", correct: "菲薄", wrong: "非薄" },
	{ word: "fāng fēi", correct: "芳菲", wrong: "芳非" },
	{ word: "chuāng shāng", correct: "创伤", wrong: "创仿" },
	{ word: "chuàng shè", correct: "创设", wrong: "创色" },
	{ word: "chéng chuāng", correct: "惩创", wrong: "惩疮" },
	{ word: "yǔn shēn bù xù", correct: "殒身不恤", wrong: "陨身不恤" },
	{ word: "cháng gē dàng kū", correct: "长歌当哭", wrong: "长歌挡哭" },
	{ word: "jié ào bù xùn", correct: "桀骜不驯", wrong: "桀傲不驯" },
	{ word: "guǎng yǒu yǔ yì", correct: "广有羽翼", wrong: "广有羽冀" },
	{ word: "chǎn mèi", correct: "谄媚", wrong: "陷媚" },
	{ word: "xiān mǐ", correct: "籼米", wrong: "仙米" },
	{ word: "zhàng bù", correct: "账簿", wrong: "账薄" },
	{ word: "pán shān", correct: "蹒跚", wrong: "盘跚" },
	{ word: "kū lóu", correct: "骷髅", wrong: "骷楼" },
	{ word: "cáo zá", correct: "嘈杂", wrong: "嘈咂" },
	{ word: "lì shǔ", correct: "隶属", wrong: "力属" },
	{ word: "lòng táng", correct: "弄堂", wrong: "隆堂" },
	{ word: "dǎn qiè", correct: "胆怯", wrong: "胆却" },
	{ word: "wō jù", correct: "莴苣", wrong: "窝苣" },
	{ word: "nüè dài", correct: "虐待", wrong: "虚待" },
	{ word: "gá piào", correct: "轧票", wrong: "扎票" },
	{ word: "zhá gāng", correct: "轧钢", wrong: "扎钢" },
	{ word: "qīng yà", correct: "倾轧", wrong: "倾扎" },
	{ word: "hōng xiào", correct: "哄笑", wrong: "轰笑" },
	{ word: "hǒng piàn", correct: "哄骗", wrong: "轰骗" },
	{ word: "yī hòng ér sàn", correct: "一哄而散", wrong: "一轰而散" },
	{ word: "káng yuán mián", correct: "扛原棉", wrong: "杠原棉" },
	{ word: "lì néng gāng dǐng", correct: "力能扛鼎", wrong: "力能杠鼎" },
	{ word: "héng qī shù bā", correct: "横七竖八", wrong: "横七树八" },
	{ word: "bù jiǎ sī suǒ", correct: "不假思索", wrong: "不加思索" },
	{ word: "shǔn xī", correct: "吮吸", wrong: "允吸" },
	{ word: "chán jiǎo", correct: "缠绞", wrong: "缠搅" },
	{ word: "xī gài", correct: "膝盖", wrong: "漆盖" },
	{ word: "qiú shuǐ", correct: "泅水", wrong: "囚水" },
	{ word: "fú shuǐ", correct: "凫水", wrong: "浮水" },
	{ word: "yāo he", correct: "吆喝", wrong: "么喝" },
	{ word: "hé huā diàn", correct: "荷花淀", wrong: "荷花靛" },
	{ word: "mán hèng", correct: "蛮横", wrong: "蛮亨" },
	{ word: "héng guàn", correct: "横贯", wrong: "衡贯" },
	{ word: "jù diǎn", correct: "据点", wrong: "居点" },
	{ word: "jié jū", correct: "拮据", wrong: "节据" },
	{ word: "pū leng", correct: "扑棱", wrong: "扑愣" },
	{ word: "léng jiǎo", correct: "棱角", wrong: "愣角" },
	{ word: "zhǎng luò", correct: "涨落", wrong: "长落" },
	{ word: "hóng zhàng", correct: "红涨", wrong: "红胀" },
	{ word: "tóng qiáng tiě bì", correct: "铜墙铁壁", wrong: "铜墙铁璧" },
	{ word: "ǒu duàn sī lián", correct: "藕断丝连", wrong: "藕断丝联" },
	{ word: "mào mao shī shī", correct: "冒冒失失", wrong: "冒冒矢矢" }
];

let canvas, ctx;
var correctAudio = new Audio("./assets/correct_effect.mp3");
var incorrectAudio = new Audio("./assets/wrong_effect.mp3");
var bgAudio = new Audio("./assets/gimkit_flisl.mp3");

function init() {
	correctAudio = new Audio("./assets/correct_effect.mp3");
	incorrectAudio = new Audio("./assets/wrong_effect.mp3");
	bgAudio = new Audio(["./assets/gimkit_blstb.mp3", "./assets/gimkit_classic.mp3", "./assets/gimkit_flisl.mp3"][parseInt(Math.random() * 3)]);

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
	gameState.hearts = 3;

	gameState.snake = [
		{ x: 5, y: 10 },
		{ x: 4, y: 10 },
		{ x: 3, y: 10 },
	];

	bgAudio = new Audio(["./assets/gimkit_blstb.mp3", "./assets/gimkit_classic.mp3", "./assets/gimkit_flisl.mp3"][parseInt(Math.random() * 3)]);

	document.getElementById("correct-count").textContent = "0";
	document.getElementById("wrong-count").textContent = "0";

	generateFoodPair();

	updateDisplay();
	updateTimerDisplay();
	updateHeartsDisplay();
}

function updateHeartsDisplay() {
    const heartsContainer = document.getElementById("hearts-display");
    if (!heartsContainer) return;
    
    heartsContainer.innerHTML = '';
    
    for (let i = 0; i < gameState.hearts; i++) {
        const heart = document.createElement("span");
        heart.innerHTML = '<i class="fas fa-heart" style="color: #e74c3c; margin: 0 2px;"></i>';
        heartsContainer.appendChild(heart);
    }
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
	} while (Math.abs(food1.x - food2.x) < 3 && Math.abs(food1.y - food2.y) < 3);

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
		} while (foodOnSnake && Math.abs(food1.x - food2.x) < 3 && Math.abs(food1.y - food2.y) < 3);
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

    // Check wall collision
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        loseHeart("撞墙了！");
        return;
    }

    // Check self collision
    for (let i = 1; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            loseHeart("撞到自己了！");
            return;
        }
    }
}	
function loseHeart(reason) {
    gameState.hearts--;
    updateHeartsDisplay();
    
    // Show feedback
	showFeedback(`❌ ${reason} 失去一颗心！`, false);
    
    // Check if game over
    if (gameState.hearts <= 0) {
        setTimeout(() => {
            gameOver("所有生命值已用尽！");
        }, 500);
    }

	setTimeout(() => { resetSnakePosition(); }, 50);
}

function resetSnakePosition() {
    // Reset snake to initial position
	let originalLen = gameState.snake.length;

	gameState.snake = [];
	for (let i = 0; i < originalLen; i++) {
		gameState.snake.push({ x: 6 - i, y: 10 });
	}

    
    // Reset direction to right
    gameState.direction = { x: 1, y: 0 };
    
    // Clear user selection
    gameState.userSelection = null;
    gameState.isChoosing = false;
    
    // Reset speed counter
    gameState.snakeSpeedCounter = 0;
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
