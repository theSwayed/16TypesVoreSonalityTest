//=======================
//Variable Initialization
//Self explainatory...
//====================

// Keeps track of test progression
// 0 = menu, 1 = in test, 2 = end of test
var testState = 0

// UI Elements

var predTest = document.getElementById('pred-button'),
    wpreyTest = document.getElementById('wprey-button'),
    upreyTest = document.getElementById('uprey-button'),
    stragr = document.getElementById('stragr-button'),
    agr = document.getElementById('agr-button'),
    na = document.getElementById('na-button'),
    dis = document.getElementById('dis-button'),
    strdis = document.getElementById('strdis-button'),
    title = document.getElementById('title'),
    title2 = document.getElementById('results-desc-header-title'),
    textarea = document.getElementById('results-desc-header-type-desc'),
    textareaheader = document.getElementById('results-desc-header-quote'),
    textarea2 = document.getElementById('results-desc-text'),
    textarea3 = document.getElementById('results-desc-score-text'),
    textarea4 = document.getElementById('results-summarize-text'),
    backbtn = document.getElementById('back-button'),
    resetbtn = document.getElementById('reset-button'),
    body = document.body,
    progressbar = document.getElementById('progressbar'),
    progressbarfill = document.getElementById('progress-bar-full'),
    scorestable = document.getElementById('scores-table'),
    scoreI = document.getElementById('score-individual'),
    scoreS = document.getElementById('score-shared'),
    scoreV = document.getElementById('score-visceral'),
    scoreE = document.getElementById('score-emotional'),
    scoreA = document.getElementById('score-active'),
    scoreP = document.getElementById('score-passive'),
    scoreX = document.getElementById('score-sexual'),
    scoreN = document.getElementById('score-sensual'),
    resetbtn2 = document.getElementById('reset-button-2'),
    shareLink = document.getElementById('results-share');

// Scores
var I = 0,
    S = 0,
    V = 0,
    E = 0,
    A = 0,
    P = 0,
    X = 0,
    N = 0;

// upreyStatements = [
//     // Individual
//     {question: 'I roll my eyes at predators who tell me how hungry they are.', answers: [{type:'I', value: 3},{type:'I', value: 1},{type:null, value: null},{type:'S', value: 1},{type:'S', value: 3}]},

//Test Statements Small Note: If these are the same thing it causes problems when loading a results page (This does not happen after a test is takes as these ger replaced with the correct data from the json file)
var predStatements = "PRED",

    wpreyStatements = "WPREY",

    upreyStatements = "UPREY";

//TestLogic

var testType = '',
    type = '',
    FinalScore = '',
    questionNo = 0,
    questions,
    scoreHist = [];

var typeDesc = '';
var transTypeDesc = '';

//=====================
//Event Listener Adding
//Area for adding event listeners
//===============================

//Test Type Buttons
predTest.addEventListener('click', function () {
    changeTheme("var(--pred)")
    startTest("data/pred.json");
    testType = "PRED";
});
wpreyTest.addEventListener('click', function () {
    changeTheme("var(--wPrey)")
    startTest("data/wprey.json");
    testType = "WPREY";
});
upreyTest.addEventListener('click', function () {
    changeTheme("var(--uPrey)")
    startTest("data/uprey.json");
    testType = "UPREY";
});

//Test Answers
stragr.addEventListener('click', function () {
    onAnswer(4);
});
agr.addEventListener('click', function () {
    onAnswer(3);
});
na.addEventListener('click', function () {
    onAnswer(2);
});
dis.addEventListener('click', function () {
    onAnswer(1);
});
strdis.addEventListener('click', function () {
    onAnswer(0);
});

//Back Button
backbtn.addEventListener('click', function () {
    if (questionNo > 0) {
        prevQuestion();
    }
});

//Reset Buttons
resetbtn.addEventListener('click', function () {
    if (confirm("确定要离开此页面吗？将回到首页并重置已做的所有试题！")) {
        resetTest();
        resetScores();
        window.location.hash = '#';
    } else {
    }

});
resetbtn2.addEventListener('click', function () {
    if (confirm("确定要离开此页面吗？测试结果将会被重置！")) {
        resetTest();
        resetScores();
        window.location.hash = '#';
    } else {
    }

});

//Share Button
shareLink.addEventListener('click', function () {
    sentToClipboard()
});

//======================
//Data Loading Functions
//Functions that deal with external data
//======================================

//Used to load a JSON File
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//Desc: (Currently) copies page url to user's clipboard (with warning).
function sentToClipboard() {
    // Text to copy
    // var text = window.location.toString();
    // Sending it to the clipboard
    // navigator.clipboard.writeText(text);
    // alert("已复制")
    downloadAsPicture(type)
}

//===================
//Test Data Functions
//Functions that purely deal with test data
//=========================================

//Resets test data
function resetScores() {
    testState = 0;
    scoreHist = [];
    (I = 0), (S = 0), (V = 0), (E = 0), (A = 0), (P = 0), (X = 0), (N = 0);
    type = '';
    questionNo = 0;
}

//========================
//Auxillary Test Functions
//Functions that deal with other test features (mainly graphics, sometimes data)
//==============================================================================

//Desc: Begins the actual test
//Args: (str) questionData - relative location of the queestion data JSON to load
function startTest(questionData) {

    //Set vars
    resetScores();
    testState = 1;
    questionNo = 0;

    //Attempt to load questions
    try {
        readTextFile(questionData, (text) => {
            questions = JSON.parse(text);
            //console.log(questions); for debug
            nextQuestion();
            //title.innerText = title.innerText + ' - Predator';
            //testType = predStatements;
            //resetScores();
            //hideType();
            //showOptions();
            //document.body.className = 'predbody';
            //document.getElementById('progress-bar').className += 'progress-bar';
            //document.getElementById('progress-bar-full').className += 'progress-bar-full';

            //console.log(JSON.stringify(questions, null, 2));
        });
    } catch (err) {
        //Some sort of alert...
    }

    //UI update
    //console.log(questions); for debug
    document.getElementById('progress-bar-full').style.width = 0; //Set bar (back) to 0
    backbtn.setAttribute('disabled', ''); //Disable back button
    hideMenu('main-menu'); //Hide main menu
    showMenu('test-menu'); //Show test menu
}

//Checks which score to change
function typeCheck(type, value) {
    switch (type) {
        case 'I':
            I = I + value;
            break;
        case 'S':
            S = S + value;
            break;
        case 'V':
            V = V + value;
            break;
        case 'E':
            E = E + value;
            break;
        case 'A':
            A = A + value;
            break;
        case 'P':
            P = P + value;
            break;
        case 'X':
            X = X + value;
            break;
        case 'N':
            N = N + value;
            break;
    }
}

//Desc: When an answer is given...
//Args: (int) index - current question number
function onAnswer(index) {
    //Get current score to history
    scoreHist.push([I, S, V, E, A, P, X, N]);

    //Calc new score
    let answer = questions[questionNo].answers[index];
    if (answer.type != null && answer.value != null) {
        typeCheck(answer.type, answer.value);
    }
    questionNo++;
    if (checkFinal()) {
        return;
    }
    ;

    //load next question
    nextQuestion();
}

//Desc: Displays next question and sets it's type
function nextQuestion() {
    //console.log("I=" + I + ",S=" + S + "V=" + V + ",E=" + E + ",A=" + A + ",P=" + P + ",X=" + X + ",N=" + N)
    //console.log(scoreHist)
    if (questionNo >= 0 && questionNo <= 4) {
        questionType = 'I';
    } else if (questionNo >= 5 && questionNo <= 9) questionType = 'S';
    else if (questionNo >= 10 && questionNo <= 14) questionType = 'V';
    else if (questionNo >= 15 && questionNo <= 19) questionType = 'E';
    else if (questionNo == 20 && questionNo <= 24) questionType = 'A';
    else if (questionNo == 25 && questionNo <= 29) questionType = 'P';
    else if (questionNo == 30 && questionNo <= 34) questionType = 'X';
    else if (questionNo == 35 && questionNo <= 39) questionType = 'N';

    //Enable back button
    if (questionNo > 0) backbtn.removeAttribute('disabled');

    //Update progress bar
    progressbarfill.style.width = `${((questionNo + 1) / questions.length) * 100}%`;
    document.getElementById('question-header').innerText = '阐述 ' + (questionNo + 1) + '/' + +questions.length;
    document.getElementById('question-text').innerText = questions[questionNo].question;
}

//Desc: Displays previous question and sets it's type
function prevQuestion() {

    //console.log("I=" + I + ",S=" + S + "V=" + V + ",E=" + E + ",A=" + A + ",P=" + P + ",X=" + X + ",N=" + N)
    //Decrement question number
    questionNo--;
    //Sets last score
    lastScores = scoreHist.pop();
    I = lastScores[0]
    S = lastScores[1]
    V = lastScores[2]
    E = lastScores[3]
    A = lastScores[4]
    P = lastScores[5]
    X = lastScores[6]
    N = lastScores[7]
    //Sets question type
    if (questionNo >= 0 && questionNo <= 4) {
        questionType = 'I';
    } else if (questionNo >= 5 && questionNo <= 9) questionType = 'S';
    else if (questionNo >= 10 && questionNo <= 14) questionType = 'V';
    else if (questionNo >= 15 && questionNo <= 19) questionType = 'E';
    else if (questionNo == 20 && questionNo <= 24) questionType = 'A';
    else if (questionNo == 25 && questionNo <= 29) questionType = 'P';
    else if (questionNo == 30 && questionNo <= 34) questionType = 'X';
    else if (questionNo == 35 && questionNo <= 39) questionType = 'N';

    if (questionNo == 0) backbtn.setAttribute('disabled', '');

    //Update progress bar
    progressbarfill.style.width = `${((questionNo + 1) / questions.length) * 100}%`;
    document.getElementById('question-header').innerText = '阐述 ' + (questionNo + 1) + '/' + questions.length;
    document.getElementById('question-text').innerText = questions[questionNo].question;
}

//Desc: Checks if current question is final
function checkFinal() {
    if (questionNo >= questions.length) {
        finalResult();
        return true;
    }
    return false;
}

//Desc: Reset graphics to main menu
function resetTest() {
    changeTheme('var(--menu)');
    hideMenu('test-menu');
    hideMenu('results-menu')
    showMenu('main-menu');
}

//Desc: Displays a given menu
//Args: (str) menu - id of menu
function showMenu(menu) {

    switch (menu) {
        case "results-menu":
            document.getElementById(menu).style.display = "flex";
            break;
        default: //usual case
            document.getElementById(menu).style.display = "inline";
            break;
    }
}

//Desc: Hids a given menu
//Args: (str) menu - id of menu
function hideMenu(menu) {
    document.getElementById(menu).style.display = "none"
}

//Desc: Changes the theme color
//Args: (str) color - css value (inclueding 'var()')
function changeTheme(color) {
    document.querySelector(':root').style.setProperty('--currentTheme', color);
}

//=====================
//Functions To Sort Out
//=====================

function debugMode() {
    textarea2.innerText =
        I + ' ' + S + ' ' + V + ' ' + E + ' ' + A + ' ' + P + ' ' + X + ' ' + N;
    title.innerText = questionType;
}

function finalResult() {
    typeDesc = '';
    type = '';
    transTypeDesc = '';
    if (I >= S) {
        type = type + 'I';
        typeDesc = typeDesc + '[I]ndividual / ';
        transTypeDesc += '自我 / ';
    } else {
        type = type + 'S';
        typeDesc = typeDesc + '[S]hared / ';
        transTypeDesc += '共享 / ';
    }
    if (V >= E) {
        type = type + 'V';
        typeDesc = typeDesc + '[V]isceral / ';
        transTypeDesc += '本能 / ';
    } else {
        type = type + 'E';
        typeDesc = typeDesc + '[E]motional / ';
        transTypeDesc += '情感 / ';
    }
    if (A >= P) {
        type = type + 'A';
        typeDesc = typeDesc + '[A]ctive / ';
        transTypeDesc += '主动 / ';
    } else {
        type = type + 'P';
        typeDesc = typeDesc + '[P]assive / ';
        transTypeDesc += '被动 / ';
    }
    if (X >= N) {
        type = type + 'X';
        typeDesc = typeDesc + 'Se[X]ual';
        transTypeDesc += '欲望';
    } else {
        type = type + 'N';
        typeDesc = typeDesc + 'Se[N]sual';
        transTypeDesc += '感官';
    }
    if (testType == "WPREY") {
        type = type + '-W';
    }
    if (testType == "UPREY") {
        type = type + '-U';
    }
    document.getElementById('results-desc-header-type').innerText = type;
    // document.getElementById('results-desc-text').innerText = 'Your type is: ' + type; Could not find use
    // textarea.innerHTML = typeDesc;
    descriptions();
    window.location.hash = `#${type}/${I}-${S}-${V}-${E}-${A}-${P}-${X}-${N}`;
    //shareLink.setAttribute('href', window.location.toString());

    hideMenu('test-menu');
    showMenu('results-menu');

}

function descriptions() {
    typeDesc += "<br>" + transTypeDesc;
    switch (type) {
        /* 食者 DESCRIPTIONS */
        case 'IVAN':
            title2.innerText = '暴食 - The Apex';
            textarea.innerHTML = typeDesc;
            textareaheader.innerText = "”现在，你已经彻底成为我的所有物了，小点心~“";
            textarea2.innerText =
                '作为一名顶级食者，填饱肚子是你唯一关心的事情。\n' +
                '在你的眼里，没有什么亲人、朋友、爱人、陌生人的区别，这些个体于你而言都可以是食物。\n' +
                '你积极地狩猎他们，唯一的目的只是填满你那无底的饥饿感。\n' +
                '他们也许会挣扎、抵抗，但这不过是些辅助消化和提升食欲的有氧运动。\n' +
                '毕竟作为食物链顶端的存在，你总能成为最终赢家。\n';
            textarea4.innerText =
                'IVAN型食者从不关心猎物的感受，只要足够美味，任何人都可能被她们送入胃中并给她们带来极致的享受。\n';
            break;
        case 'IVAX':
            title2.innerText = '魅魔';
            textareaheader.innerText =
                "“嗯~~竭尽全力地挣扎吧~也许再努力点就可以逃出去了~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "于你而言，填饱肚子是一回事，但更能满足你的却是……肉欲。\n" +
                "当一些倒霉的猎物被你吞下喉咙，他们不仅会对你的身体做出贡献，还会为你带来一个极致享受的激情夜晚。\n" +
                "你擅于掌控他们的期待，拿捏他们的心态，让猎物不会轻易放弃抵抗，而猎物所做出的一切，都将化作刺激肉体的电流，给你带来极致的快感。\n" +
                "他们在你腹中的蠕动只会让房间的气味更加暧昧，他们的养分增加的不仅仅是你的曲线，还有床单上湿漉漉的汁水。\n" +
                "IVAX型的食者会沉浸在猎物的蠕动和反抗中，尤其是他们在正确方向上做出的恰到好处的挣扎和抵抗。\n";
            break;
        case 'IVPN':
            title2.innerText = '蜘蛛';
            textareaheader.innerText =
                "“真是可爱的家伙，这么努力地压抑内心真正的渴望，就是为了得到我更加激烈的攻势吗~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "比起主动去寻找猎物，你更倾向于等待他们落入你精心编织的圈套。" +
                "因为你知道只要有足够的耐心，高品质的食物会在合适的时间把自己送到你的面前。\n" +
                "这样的做法通常会令你饥饿难耐，所以猎物一旦出现，你就会毫不犹豫地吃掉他们，并理所应当地享受这份美味。\n" +
                "正如俗语所言，成功最终属于耐心等待的人。\n" +
                "IVPN型的食者擅于玩弄自己的猎物，引诱他们逐渐沦陷，最终将身心全部奉献出去。";
            break;
        case 'IVPX':
            title2.innerText = '海妖';
            textareaheader.innerText =
                "'来吧……难道你不想丰满我的曲线，成为这具妙曼身体的一部分吗？'";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "区别于IVPN型食者的饥不择食，你会在吃掉猎物前认真考虑他们的长相。" +
                "你更喜欢可爱或者更具魅力的猎物，或者说，你的猎物在某些方面一定存在着一些令你难以抗拒的特性。" +
                "这能让你在品尝他们的味道时获得一些微妙的加成，在某些难以言喻的领域上给你带来更多的享受。" +
                "从另一方面来说，你也许只是在确保拥有最高质量的猎物进入你的身体，因为他们最终都会使你的身体曲线变得更加诱人。" +
                "IVPX型食者一直清楚一件事情，那就是猎物被彻底消化之后，他们的某些特质将会成为自己美妙躯体的一部分。";
            break;
        case 'IEAN':
            title2.innerText = '索取者';
            textareaheader.innerText =
                "“随你怎么挣扎吧，这毕竟是你最后能做的事了。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你的狩猎必定拥有目的，你的进食必然存在理由。" +
                "无论是为了惩罚那些令你厌恶的欺骗者，还是为了满足凌驾于他人之上的优越感，你的猎物一定能给你带来一些其他层面的满足。" +
                "与其将你形容成一名优秀的食者，不如说猎食的行为只是你为了达成目的的一种手段。" +
                "你不仅通过消化他们的身体来满足你的饥饿感，还能通过欣赏他们绝望的抵抗也能令你获得在情感和精神上的额外满足。" +
                "IEAN型食者从不认为吃掉猎物这件事是理所应当的，但她们会为了达到某种目的而选择将对方当做食物吃掉。\n";
            break;
        case 'IEAX':
            title2.innerText = '玩弄者';
            textareaheader.innerText =
                "原来只需要这样你就会继续挣扎呀……既然如此，那你就……一直挣扎下去吧~";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你总是知道该说些什么来让自己的猎物蠕动。' +
                '你喜欢嘲弄和挑逗猎物，让他们在自己的腹中持续不断地挣扎蠕动，没有别的原因，只是为了一些或许在其他人看来有些难以理解的……乐趣。' +
                '与其说你喜欢玩弄肚子里的食物，不如说你吞下他们的根本目的就是为了玩乐消遣，特别是对于让猎物在自己的胃里耗尽精力这件事，你沉浸其中，乐此不疲。' +
                '你有时会厌倦那些被动的、或者自愿成为食物的个体，但不可否认，支配这些不太愿意闹出动静的食物，弄清楚怎样才能让他们努力挣扎也称得上是不错的挑战。' +
                'IEAX型食者并非总是恶意的，也许她们只是单纯的喜欢和猎物调情，或者在吃掉猎物的时候玩弄他们。 \n';
            break;
        case 'IEPN':
            title2.innerText = '暗示者';
            textareaheader.innerText =
                "“你知道如何让我们的关系更加紧密，问题在于……你什么时候愿意主动踏入？”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你喜欢诱骗自己的猎物产生一种安全感，哪怕你们双方都知道这份安全感是如此的虚假。" +
                "你会主动了解自己的猎物，你会用各种方式暗示他们的命运，但却从不露骨地将其表达出来。" +
                "某种程度上，你的猎物很清楚自己早晚会成为你的一顿晚餐，然而你与生俱来的魅力却鼓励他们保持着微妙的关系。" +
                "你不会主动要求你的食物奉献自己，而是让他们在你营造出的微妙氛围中难以抗拒成为你的猎物的渴望，主动挑破这层关系，进而渴求着你吃掉他们。" +
                "IEPN型食者吃掉猎物的动机是复杂且被动的，但有一点毋庸置疑，她们享受与猎物之间的保持微妙关系的状态，同时享受猎物主动投喂自己带来的精神与食欲的双重满足。 \n";
            break;
        case 'IEPX':
            title2.innerText = '引诱者';
            textareaheader.innerText =
                "“我会给你人生中最美妙的经历，而这份经历终将以你滑入我的胃中而结束。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你经常出现在公共场合，利用自己精心设计的外表和内在吸引猎物将目光投向自己。' +
                '一旦猎物上钩，你便会向他们抛出一个媚眼，暗示并引导他们陷入你编织好的更深的陷阱。' +
                '你们会去到一个适合交谈的地方，以便彼此能够更好的了解对方，无论是情感上还是身体上。' +
                '当一切都准备就绪，你将会引诱他们陷入一场激情之夜（至少于你而言），随后在猎物最意想不到的瞬间吃掉他们。' +
                'IEPX型食者喜欢与自己的猎物玩一场精心策划的情感游戏，她们诱人的本性使得大部分人难以抗拒，即使她们趋于被动地等待猎物找上自己。';
            break;
        case 'SVAN':
            title2.innerText = '友善者';
            textareaheader.innerText = "”很高兴你能奉献自己，让我们一起体验这美妙的旅途吧~“";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '也许你自己都没有意识到，你与暴食者的差距仅仅只是一个友善的态度。' +
                '在你的眼里，世界上绝大部分个体都有了一个清晰的划分：愿意奉献自己的美味食物和不愿意奉献自己的食物。' +
                '你不会完全忽略猎物的态度和想法，而是主动寻找那些愿意成为食物的个体来满足自己的胃口，并下意识地让这场经历成为能双方都感到愉快的体验。' +
                '尽管你对待食物的态度仍然和阿尔法类似，以满足自己的口腹之欲和填饱饥饿感为主，但你友善的本质确保了你的暴食不会凌驾于猎物的体验之上。' +
                'SVAN型食者相比起自己的体验和欲望，往往会优先考虑猎物的体验和欲望，而这也就意味着任何成为她们食物的个体都能得到她们最友善的照顾，并在愉快中溶解在她们的肚子里。';
            break;
        case 'SVAX':
            title2.innerText = '说服者';
            textareaheader.innerText = "“希望你能对这样的结局感到满意。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你喜欢在正式开始吃掉你的猎物前让他们尽可能地接受最终的结果。' +
                '你会尽可能地让他们不会感到难受，并清楚地阐述即将发生的一切，你会解释自己的饥饿和欲望需要被他们填满，你会告诉他们这一切对于你们双方而言将是多么的美好。' +
                '你的口才加上你天生的气场具备强大的感染力，即使是最不情愿的猎物，通常都能被你成功说服，并让他们对被你吃掉的前景感到兴奋与期待。' +
                'SVAX型食者中，有些会为了达成目的而使用一些欺骗手段，但她们中的大多数还是希望猎物的经历和她们描述的内容一致，以此让猎物对最终的结果感到满意。';
            break;
        case 'SVPN':
            title2.innerText = '压抑者';
            textareaheader.innerText =
                "“我真的对此感到抱歉！但我实在控制不住自己……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '一直以来你都有一个最大的敌人，那就是你的饥饿欲望。' +
                '一方面，你不愿意伤害自己的朋友；另一方面，当你的饥饿欲望爆发时，你又难以遏制地渴望将他们全部吃掉。' +
                '屈服于自己的本性，将自己的朋友们视作食物，将他们全部吞下去是一件多么美妙的事情？你一直试图忽略这种想法和感觉。' +
                '因此，有一个自愿成为食物的伙伴对你而言是一个很好的解脱方式……如果你能说服自己在欲望爆发时保证只吃下一个猎物的话。' +
                'SVPN型食者难以在自己的欲望和照顾周围人感受的纠结中做出选择，通常她们都会屈服于自己的欲望，但也保不准在极个别时候友谊的力量真的能更胜一筹？';
            break;
        case 'SVPX':
            title2.innerText = '食欲者';
            textareaheader.innerText =
                "“涩涩是很棒啦……但是被吞噬的感觉会更棒哦~啊呜~！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '一个激情四射的美妙夜晚通常以你的饱腹而告终。' +
                '也许你容易在某个美妙透顶的瞬间迷失自我，拥抱饥饿本质；也许你只是通过吞食来帮助自己或者伴侣达到高潮；也许你喜欢在亲密过后用吞咽与包裹的方式取代相拥而眠。' +
                '无论如何，作为一名恋人，你的胃口无疑是巨大的。' +
                '并且你很擅长让吞食这个行为在你们的爱情动作中占据重要的席位并加以运用，吞食成为了你性欲的一部分。' +
                'SVPX型食者往往能够很自然地用吞食行为取代性行为，并让自己的伴侣很好地融入其中，至于接下来他到底以什么样的形态从哪里出来，这就不得而知了……';
            break;
        case 'SEAN':
            title2.innerText = '约束者';
            textareaheader.innerText = "“想要获得我的欢心？那就请先到我的胃里来吧~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你热衷于与你的朋友们保持足够亲密的关系，但于你而言，没有什么比将他们关在你的肚子里更好的方式了。' +
                '你喜欢与胃中的猎物度过美好时光，即使是在你日常生活的过程中你也会长时间地将他们留在体内。' +
                '吞食这件事于你而言只是一种表达情感的方式，而非某种满足欲望的行为，因此你的猎物通常都会比较安全。' +
                '当然，这样的关系自然是双向的，和大多数分享型角色一样，在满足自己情感需求的同时，你也会关注猎物的体验。' +
                'SEAN型食者更关心与猎物的互动和情感联系，而不仅仅是食物摄取，猎物的概念也不仅仅只是食物，而是情感关系的另一半。';
            break;
        case 'SEAX':
            title2.innerText = '收藏者';
            textareaheader.innerText =
                "“我希望我们永远在一起，即使这意味着你将会成为我的一部分……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你对猎物的审查要求相当严格，并非所有个体都有资格成为你的猎物。" +
                "你的社交属性决定你会主动去接触并了解那些吸引着你的个体，并且由于你偏向分享型和情感型的特质，你在狩猎的过程中也会更偏向于愿意主动奉献自己的猎物。" +
                "你会鼓励猎物探索你的身体，并询问他们想要成为你身体的哪个部分，即使最终他们都没有成为想要加入的那一部分。" +
                "而当你的猎物彻底融入你的身体后，在某些特定的场景下，你会不时地想起这些奉献者，并用他们的名字为他们加入的那部分身体命名。" +
                "SEAX型食者会注重猎物的态度和感受，注重分享情感和体验欲望，她们的猎物通常都是在兴奋中融入她们的身体，并以此来满足她们支配猎物的欲望。";
            break;
        case 'SEPN':
            title2.innerText = '友好者';
            textareaheader.innerText =
                "“怎么样，舒服吗？想出去的话就告诉我。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你喜欢让你的猎物感到温暖和舒适，通常在吃掉他们之前和之后用安慰的话语鼓励他们。" +
                "你倾向于让猎物处于安全的环境，受到你的保护，而不是对他们造成任何形式的伤害。" +
                "当你不得不对猎物造成伤害，比如不得不消化掉他们时，你会显得十分纠结与犹豫。" +
                "当然，你也不会主动去狩猎你的猎物，而是当他们在向你寻求吞食的体验时，你才会将他们吞下去。" +
                "SEPN型食者几乎不存在关于饥饿感的欲望诉求、不会为了满足口腹之欲而去进食，她们中的一些个体甚至不认为自己是所谓的食者。";
            break;
        case 'SEPX':
            title2.innerText = 'The Romantic ';
            textareaheader.innerText =
                "如果你也愿意的话，我希望在我的体内感受你的存在。";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "浪漫主义者、期望的恋人、追求刺激的人，人们常常用这些称号来形容你。" +
                "你比任何人都要了解吞食这件事在亲密关系中的本质：这是在两个有着同样诉求的人之间最为激情的表露，是一种超越一切，独一无二的关系。" +
                "你不会主动寻找猎物，而是为他们提供自由探索你的身体的机会，一旦他们进入你的体内，你就会在他们表露出的兴奋情绪、感受着体内微妙存在的双重刺激下获得巨大的性快感。" +
                "你通常会选择在一切结束之后把猎物吐出来，或者至少能保证有办法让他们重新站在你的面前，因为吞食这件事在你的认知当中是一种建立紧密联系的方式，你不会伤害你最重要的另一半。" +
                "SEPX型食者会与她们的猎物建立起牢固的情感连接，不希望他们受到任何伤害，当然，她们也不太愿意接受自己的猎物要求她们伤害他们本身。";
            break;

        /* 自愿猎物 DESCRIPTIONS */

        case 'IVAN-W':
            title2.innerText = '小点心';
            textareaheader.innerText =
                "“不要犹豫，直接张嘴，我能自己进去！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你不确定这种欲望是从什么时候开始的，但你确实拥有着一种奇怪的愿望，你希望被吃掉。" +
                "你渴望被某人的喉咙紧紧束缚，你幻想被胃中消化的低吟缠绕，你期待某位食者将自己放入她的餐盘。" +
                "但是你知道，无论过程如何，你注定会成为某位女孩的食物。" +
                "你到处寻找食者，并试图主动被她们吃掉，以至于大部分人都知道你的存在，一个随时可以用于满足自己的小点心。" +
                "IVAN自愿型猎物更注重于被吃掉的过程体验，只要能被吃掉，食者的身份和类型并不是什么重要的事情。";
            break;
        case 'IVAX-W':
            title2.innerText = '体验者';
            textareaheader.innerText =
                "“你的舌头看起来很粘滑，我已经等不及被它包裹住了~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你积极追求你的吞食梦想，试图在每次遇到的食者身上把你的幻想变成现实。" +
                "有些食者或许会对你的主动感到质疑和警惕，但当你在她们的胃里晃动时，所有的疑虑都会消失。" +
                "于你而言，吞食更像是一种性癖好，你会不惜一切代价去体验它。" +
                "IVAX-自愿型猎物是一个彻头彻尾的行动派，并且更加注重于吞食过程带给自己的性体验。";
            break;
        case 'IVPN-W':
            title2.innerText = '等待者';
            textareaheader.innerText =
                "为什么她们还不来吃掉我？难道是我还不够美味吗？";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "关于等待这件事，你比大多数人都要熟练。" +
                "你经常听到其他人谈论关于他们遇到的各种食者的经历，但是你仍然无法鼓起勇气主动寻找。" +
                "因为你被动的本质阻止了你进一步接近食者，即使你十分渴望被她们的胃壁包裹。" +
                "因此你会一直等待下去，因为你相信迟早有一天会有一名食者悄悄盯上你，然后在她饥渴的欲望中将你吞食。" +
                "IVPN-自愿型猎物渴望体验被吞食的感觉，吞食这件事于他们而言更像是一种精神上的诉求，然而被动的本质注定了他们将会不停地等待，直到那个注定的时刻到来。";
            break;
        case 'IVPX-W':
            title2.innerText = '幻想者';
            textareaheader.innerText = "什…什么？抱歉，我走神了…";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你几乎时刻都深陷在成为猎物的幻想中。" +
                "掠食者向着你的面部喷吐而出的热气，夹在你腿间的温暖柔舌，口中那带着振奋气息的味道，滑入喉咙时紧致的触感……" +
                "这些幻想令你无法自拔，乐在其中，但你却始终无法踏出最为关键的一步。" +
                "不过，如果有一个食者将你逼入绝境，或者她提出了令你无法拒绝的酬劳的话……" +
                "IVPX-自愿型猎物绝不会真的将自己的想法付之于行动，即使真的被逼入绝境，也只会在口嫌体正直中滑入食者的肚子，但不可否认，这确实是他想要的东西……";
            break;
        case 'IEAN-W':
            title2.innerText = '倾慕者';
            textareaheader.innerText =
                "“这里真的太舒服了，请永远不要放我离开~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你天生对胃这一器官抱有好感。或许是它的某些特质吸引着你，它能使你的内心宁静。 " +
                "你从未体验过如同被肚子里的肉壁拥抱着一般的舒适。" +
                "如果一定要选择一个地方让你度过余生，那一定是某个食者的肚子里，只要能够待在里面，光是想想都难以掩盖那份期待与冲动。" +
                "因此你会主动去寻找食者，在她们的体内找到那一份属于自己的安宁。" +
                "IEAN自愿型猎物清楚自己需要的并不是肉欲方面的诉求，而是情感上的慰藉；同时他们也清楚自己作为猎物的目标是什么并愿意主动实现自身的价值。 \n";
            break;
        case 'IEAX-W':
            title2.innerText = '探险者';
            textareaheader.innerText = "“谁的肚子又在召唤我了~？”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你的兴趣与爱好繁多且杂乱，而你显然不打算浅尝辄止。' +
                '因此，你享受被吞食所带来的情感要素，在肠胃的刺激中寻求性快感。' +
                '然而，你的自我特质倾向于满足自己的感受，因此你对于猎食者的选择就像是你的兴趣与爱好一般多且杂乱……这种现象通常还有另一个不太好听的名字，叫做滥交。' +
                '所以，你会四处探险，会寻找新的喉咙与肚子进行探索，而不是被束缚在某一个食者的体内。至少，你主观上是这样期待的。' +
                'IEAX自愿型猎物过于主动，但也过于自我，他们不太会关注某些食者是否希望他们留下，就如同清纯的少女想要挽留住她花心的男友。这样的猎物，还是交给暴食们进行无害化处理吧。 \n';
            break;
        case 'IEPN-W':
            title2.innerText = '内向者';
            textareaheader.innerText =
                "一个把我当成食物并像对待食物一样对待我的食者！嗯……我想我需要先冷静一下……";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "尽管你明确的表示，你的欲望不仅仅只是“被吃掉”，但仍然有许多人经常将你与幻想者搞混淆。" +
                "虽然你也幻想着被胃部包裹的那种感觉，但有一个很明显的区别在于，当吃掉你的她在外面嘲弄你时，你会显著地感觉到愉悦的情绪。" +
                "你清楚的知道对于外面那个已经将你吞掉了的强大生物而言，你不过是她的食物而已。" +
                "你通常并不关心食者的身份，但和幻想者类似的，你幻想者总有一天，会有某个食者以某种方式接近你，而你恰好在某些方面的特质让她产生了食欲，随后她一口吞掉了你。" +
                "IEPN自愿型猎物追求的不仅仅是被吃掉这一单纯的结果，被吃掉这件事对他们而言同样有着来源于情感方面别样诱惑力。";
            break;
        case 'IEPX-W':
            title2.innerText = '害羞者';
            textareaheader.innerText = "“张、张开了！她已经张开嘴了！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你很容易慌乱，哪怕仅仅只是看了一眼食者都可能导致你面红耳赤，心跳不已。' +
                '你的被动特性通常让你在食者面前显得无比乖巧与顺从，那些善于戏弄自己猎物或者善于调情的食者能够更好地激发你的性欲，而你将任凭她们摆布。' +
                '在对食者的挑选方面你有着特殊的见解，你更喜欢那些你认为性感和迷人的食者，尤其是那些能够挑动你的内心，抓住你的爽点的食者。' +
                'IEPX自愿型猎物更容易受到食者的影响，或者说，食者的存在本身就会不断刺激他们的情绪感官，哪怕只是想想都觉得兴奋不已。';
            break;
        case 'SVAN-W':
            title2.innerText = '忠诚者';
            textareaheader.innerText =
                "“如果我命中注定会成为某个女孩的食物，我想那个人一定是你。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你也许会将自己的定位视作食物，但你并不会像IVAN型猎物那样去寻找任意食者来满足自己作为食物的欲望。" +
                "比起成为随机陌生的食者的食物，你更倾向于为自己的朋友或者真正需要自己的食者保留自己的价值，虽然你们之间的关系仍然是一种交易。" +
                "即：你为了满足被吃掉的体验而奉献自己，她为了满足吃掉你的快乐而向你索取。" +
                "SVAN自愿型猎物能够很快结交到食者朋友，当他们产生了任何关于想要被吃掉的欲望时，他们可以拜托这些食者朋友。";
            break;
        case 'SVAX-W':
            title2.innerText = '诱惑者';
            textareaheader.innerText =
                "震惊！究竟是什么食物，竟有如此可口的气味！哦，原来是我自己！";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你是一个标准的愿意成为食物的猎物，但在作为食物的基础上，你还拥有着另一种微妙的特质。' +
                '你会难以遏制地主动吸引那些潜在的食者，比如穿着耀眼的服饰、打扮得秀色可餐、让自己闻起来令人食欲大动，或者采取一些别的方式。' +
                '当你深刻地了解到了某位潜在食者的捕食规律时，你也不会介意去主动触发这些东西，而你的目的只有一个，那就是激起她的食欲，让她难以遏制将你吃掉的欲望。' +
                '同时你也会积极地追求与食者进行难以启齿的涩涩运动，体验被她们吃掉的刺激，以及享受到那些吃掉你的食者的赞美。' +
                'SVAX自愿性猎物喜欢寻求性刺激，并且同时与食者维系着吃与被吃的紧密关系，这两件事对他们而言并非是某种选择题，而是相辅相成的极致体验。';
            break;
        case 'SVPN-W':
            title2.innerText = '朋友-The Friend';
            textareaheader.innerText =
                "“如果实在忍不住的话就吃了我吧，我不会介意的。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "虽然你并不积极寻求成为食物的机会，但你仍然可能会结识多位食者。" +
                "你的目的很明确，那就是期望着她们中的某一个最终会做出吃掉你的决定并赴之于行动，比起这个，你并不愿意冒险跟陌生的食者做出尝试。" +
                "如果你最终成为了朋友的食物，你会得到额外的满足，但你通常很难鼓起勇气表明你对被吃掉这件事的真实感受。" +
                "以至于你的食者朋友们通常都会对你做出错误的评估，认为你对被她们吃掉这件事压根就不感兴趣。" +
                "SVPN自愿型猎物是一种情感特质明显的猎物类型，比起被吃掉这件事本身，他们更加注重与食者之间的朋友关系和情感连接。";
            break;
        case 'SVPX-W':
            title2.innerText = '取悦者-The Pleaser';
            textareaheader.innerText =
                "哈……吃了我吧……求你了，我现在真的好兴奋！";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '于你而言，被吞食意味着极致的性体验与高潮。' +
                '你会努力与你认为有吸引力的食者建立联系，希望能够被她们吞下并一段时间里成为她们性感的胃里的一个鼓包，甚至是融入她们的身体中。' +
                '与SVAX型猎物的主动奉献不同，你更愿意被食者主导并吞下，而你则完全顺从并享受这一过程；' +
                '同时，与SEPX自愿型猎物通过被支配制造亲密连接不同，你更专注于与食者最为激情的瞬间，并从中获得愉悦。' +
                '如果你找到了与你相互匹配的食者类型，这可能会形成一种潜在的不稳定的反馈循环……你们相互取悦，相互满足，迟早有一天你会彻底陷入其中，无法脱身。' +
                'SVPX自愿型猎物善于在被吃掉的过程中取悦食者，并且他们自己也能在这个过程中获得满足，他们可能会倾向于和那些寻找愉悦体验的食者建立联系。';
            break;
        case 'SEAN-W':
            title2.innerText = '热切者-The Eager';
            textareaheader.innerText =
                "“我们是如此亲密的朋友，而且我有一个方法能让我们的关系更加亲密。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你在获得快乐的方式上通常会和你的食者有着相似的观点，即你们都期望食物能在食者的体内度过更多的时间。' +
                '你会积极促进双方更快地进入到吞食的阶段，在她们的肚子里给她们做一些腹内按摩，以此来保证自己能有更长的时间待在她们的体内。' +
                '你可能还会希望与食者融为一体，因为你认为你们双方都将从“猎物成为更强大个体的一部分”中受益。' +
                '无论如何，你具备着较强的适应性，能够与几乎类型的食者形成更深层次的联系，但你可能会觉得拥有自我特质和本能特质的食者有些过于偏激。' +
                'SEAN自愿型猎物渴望与食者拥有更加亲密的关系，享受被吞食带来的感觉，在食者的体内度过时间能给他们带来快感和满足。';
            break;
        case 'SEAX-W':
            title2.innerText = '调情者-The Flirtatious';
            textareaheader.innerText =
                "“我真的很享受此刻和你的闲聊，但如果我们之间只隔着一层肉壁，这场聊天会变得更加诱人~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你非常了解自己的兴趣与欲望，喜欢寻找与你的特质相匹配的食者。" +
                "你擅长勾引，或利用性挑逗和嘲弄刺激食者，使她们充分陷入兴奋的状态，并在充满欲望的状态下吞食你。" +
                "如果食者不喜欢或者不回应你的刺激和怂恿，那么你则不会希望被她们吃掉，因为于你而言，只有双方都处于开心和期待的情况下，吞食的行为才会是有意义的。" +
                "你还可能寻求成为一个吸引人的食者的一部分，或者加入食者的身体曲线以帮助她们变得更具吸引力。因为你觉得成为食者的一部分或者以其他方式使她们变得更迷人会让你得到满足。" +
                "SEAX自愿型猎物寻求与食者进行情欲上的互动，但他们更注重感官上的体验，他们或许愿意被食者消化，但那绝不是为了满足她们的口腹之欲，而是以这种方式成为她们迷人身体的一部分。";
            break;
        case 'SEPN-W':
            title2.innerText = '服从者-The Servant';
            textareaheader.innerText =
                "“我已经等不及要被你的胃壁束缚，或者成为你的一部分了……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你是一个专注于满足食者的角色，你乐于在成为她们的食物这方面无私奉献并享受这个过程给你带来的快乐。" +
                "你通常会选择将控制权彻底交给你的食者，不管你需要在她们的体内待上多久，你都会满足地彻底在她们的体内彻底放松下来，不会做任何多余的事情。" +
                "如同其他拥有情感特质的猎物，你同样渴望与食者建立更加亲密的联系，因此你认可的食者多是你的朋友，而不是陌生人。" +
                "你偶尔会将自己视作朋友的私人小零食或者吮吸小玩具，每当她们有这样的需求时你都会顺从地被她们拿走和使用。" +
                "SEPN自愿型猎物的兴趣更多地来自于他们的情感特质，于他们而言，被吃掉的感觉要高于性兴奋。他们就像一个绝对服从的仆人，不会反抗，不会挣扎，他们将自己的一切都奉献给被他们认可的食者朋友。";
            break;
        case 'SEPX-W':
            title2.innerText = '祭品-The Devotee';
            textareaheader.innerText = "“请肆意地使用我吧~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你是一个专注于满足食者的角色，你将自己的身份看作是“可食用的性玩具”，在需要的时候取悦你的爱人、主人或者朋友。' +
                '你愿意将自己彻底交给你的食者以此来满足自己的性欲，甚至包括在各种程度上被她们消化。' +
                '如同其他拥有情感特质的猎物，你同样渴望与食者建立更加亲密的联系，因此你认可的食者多是你的朋友，爱人或者主人，而不是陌生人。' +
                '同时，你的情感特质也令你渴望被食者调情和赞美，并与她们建立更加长久的联系。' +
                'SEPX自愿型猎物会在被控制和使用时感到性愉悦，他们渴望情感上的互动，他们的情感特质导致他们能够选择的食者数量较少，但关系却更为亲密。';
            break;

        /* 被迫猎物 DESCRIPTIONS */

        case 'IVAN-U':
            title2.innerText = '挑战者-The Challenger';
            textareaheader.innerText = "“我可不会在力竭之前轻易放弃！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你有着丰富的从食者嘴里逃离的经验，因为你从不屈服于成为食物的命运。" +
                "尽管许多食者们知道你不是那么容易被吃下的猎物，但她们仍然不打算就此放弃吞下你的想法。" +
                "也许，她们中的一部分个体认为能够消化如此强大的猎物是一种值得争取的挑战和成就？" +
                "无论如何，那些想要成为某人食物的想法令你十分困惑，你永远不会允许自己成为猎物，你会千方百计地从任何想要吃掉你的人的身体里逃离。" +
                "IVAN被迫型猎物的本质大概就是不喜欢吞食爱好的普通人吧？如果当他们被卷入某位食者的嘴里，他们的唯一想法就是逃离这里并活下去，哪怕这会对食者造成相当严重的伤害。";
            break;
        case 'IVAX-U':
            title2.innerText = '回避者-The Evasive';
            textareaheader.innerText =
                "“该死，我怎么可能会爱上这个？！快放我出去！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "或许曾经你经历了顽强的抵抗，但现在你的身心都已经深陷她的胃里，因为你发现你的心脏开始以一种奇怪的方式跳动……\n" +
                "被她吞下引起了你的性欲？为什么你会在被她消化时感到兴奋？你难道打算就此放弃然后接受自己的命运了吗？\n" +
                "当然不是！虽然你确实感到兴奋，但你绝不会承认这样的事情会引起你的快感。\n" +
                "不愧是你！你的身体仍然保持着挣扎和抵抗！对！没错！继续保持！无论她的体内给你带来了怎样的刺激，都不如活着重要啊！\n" +
                "IVAX被迫型猎物潜在地将吞食与性欲联系在一起，但这还不足以打败他们对活着的渴望。因此，他们虽然在被吞下之后感到兴奋，但又试图否认这种感觉，认为继续挣扎比因性欲而停下来更为重要。\n";
            break;
        case 'IVPN-U':
            title2.innerText = '认命者-The Fatalist';
            textareaheader.innerText = "“唉……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '刚才她的肚子上还不断撑起着一个个鼓包，但现在她的肚子归于平静了。' +
                '正被困在里面的你或许是打算放弃了，或许只是在养精蓄锐，保存体力。' +
                '你知道作为猎物，大概率是要被食者吃掉的，因此在这样的命运真的降临之时，你只会做出最基本的抵抗。' +
                '你的被动特质注定了你难以在胃壁中坚持太久，尽管也许这种表现会使某些期待食物挣扎的食者感到无聊，进而考虑放你一马……？那么,你认为活下来的结局确实是你真正期待的吗？' +
                'IVPN被迫型猎物很容易放弃他们的抵抗，并在食者的腹中轻易接受他们的命运。但并不否认，这样的表现有时确实能造成一些意料之外的结局。';
            break;
        case 'IVPX-U':
            title2.innerText = '动摇者-The Swayed';
            textareaheader.innerText =
                "“适应了以后，感觉好像还行……？”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "被吞之前的你：“我就算是被捏死，死外边，从这跳下去，也绝不会屈服于你的肚子！”，被吞下去之后的你：“斯哈斯哈！姐姐的体内好棒！”" +
                "你绝对是一个复杂的猎物，因为你知道被吞食这件事到底有多么的危险，食者的体内到底有多么恶心，但如果你真的深陷其中，你就会很快屈服。" +
                "一旦食者开始吞食你，你就会感到兴奋，明白被她们细长滑腻的舌头品尝你的身体是一种令你难以抗拒的奇妙刺激。" +
                "大抵上你还是愿意接受被吃掉的命运的，因为真实的体验确实和你想的差距很大，但总的来说并不亏，美妙的体验大抵胜过最初的不情愿。" +
                "IVPX被迫型猎物是复杂且矛盾的，他们在真的被吞下之前是发自真心的抵触，但在那之后也是发自真心的渴望，并且这种渴望更多地来自性与本能的欲望。";
            break;
        case 'IEAN-U':
            title2.innerText = '后悔者-The Remorseful';
            textareaheader.innerText = "“你不能这样对我！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "有时候你真的应该好好反思一下自己的行为，而不是真的等到来不及的时候才开始后悔。" +
                "IEAN食者和IEAN-W都能在吞与被吞的过程中找到各自的目标和意义并实现自身价值，而你只会因为忧郁的情节开始后悔原来自己还有很多理想可以实现。" +
                "所以，你开始挣扎，开始反抗自己的命运，开始向往自由，幻想自己能够逃脱，并告诉自己世界那么大不该止步于此……所以你早干嘛去了？" +
                "不可否认，你的情感特质确实能成为你优秀的武器，许多含有情感特质，特别是分享型情感特质的食者确实会被你强烈的表达所打动，进而真的考虑放过你……但，这样的食者又有多少呢？" +
                "IEAN被迫型猎物在被吞食的时候会如同许多身陷囹吾的漫画角色一样通过回忆杀、未完成之事获得力量，摆脱困境。但总的来说，除了SE型食者，这样的力量往往都起不到多大的决定性作用。";
            break;
        case 'IEAX-U':
            title2.innerText = '挣扎者-The Squirmer';
            textareaheader.innerText = "“快、快放我出去！我不是食物！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你是一个容易慌乱、摇摆不定的猎物。虽然你的自我特质让你尽量避免被吃掉的处境，但当食者在你的面前张开她们的嘴时，你还是会忍不住多看一眼……也许这一眼，就是永恒。" +
                "你会在食者的面前以及里面坚决地挣扎，声称自己不是食物，你从不轻易放弃抵抗，而这所有的一切不过是为了掩盖你内心深处的兴奋和激动。" +
                "因为你知道这样通常都能勾起食者玩弄自己猎物的兴趣，进而将这种兴趣在你的身上付之行动……是的，你的抵抗，你的挣扎，你的反对，其实本质上就是在说，“快，快欺负我！我真的很享受！”" +
                "呵，真是个傲娇的小可爱，只要她开始嘲笑你的命运，告诉你你的味道有多棒，嘲笑你的反抗是多么无力，你的挣扎令她感觉愉悦，帮你描述接下来你会经历的场景，会加入的部位，你就会在她的肚子里蠕动一整个夜晚。" +
                "IEAX被迫型猎物通关坚决的挣扎和抗议来掩盖自己的兴奋，食者只需要不停地嘲笑、挑逗、露出享受的样子，就可以激发起他们的欲望，引发他们的反应。";
            break;
        case 'IEPN-U':
            title2.innerText = '绝望者-The Tragic';
            textareaheader.innerText = "“逃不掉了……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "当你回过神来的时候，你已经在她的喉咙里了。为什么你无法做出反抗？为什么她如此轻易就能将你吃下？" +
                "随着她强有力的最后一次吞咽，随着她抚摸着肚子打出一个不雅的饱嗝，现在的你仅仅只是她的食物罢了。" +
                "一旦食者发现了你的存在，你就会立刻放弃抵抗，彻底交出控制权，屈服于自己成为食物的命运，哪怕其实那个时候食者根本就还没来得及做什么。" +
                "你是被动的猎物，通常只会做出最为简单的逃跑尝试，并且，食者只需要对着她的肚子稍微一拍，就能让你立刻安静下来。" +
                "另外……如果当她将肚子里的你介绍给了你的朋友，当你的朋友得知了你现在只不过是她肚子里的食物……这样的结果大概会让你觉得尴尬又兴奋。" +
                "IEPN被迫型猎物与IVPN被迫型猎物不同，IVPN-U主要担心自己是否会被消化这个问题，而IEPN-U只在乎当别人发现自己成为了食者的食物以后会有什么反应。";
            break;
        case 'IEPX-U':
            title2.innerText = '犹豫者-The Indecisive';
            textareaheader.innerText =
                "“嗯…这里其实还挺性感的……只要别让我呆上太久……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "许多食者将你误以为是IEPX-W猎物，即使你掩盖了自己内心最深处的欲望，否认自己渴望被吃掉的事实。" +
                "所以，哪怕即使你嘴上真的在否认，然而一旦你真的进入了食者的肚子里，被她们软滑的肉壁所束缚而产生的性刺激仍然会压过你最初的不满与抵触情绪。" +
                "因此，当这一切真实发生的最初的那段时间，你会像是IEPX-W猎物那样感觉舒适，感到兴奋，感受性刺激，并接受自己作为食物的这一身份。" +
                "然而一旦食者的身体开始消化你，或者被她们无限期地困在肚子里，你还是会后悔自己最初的想法和决定。毕竟你接受的只是肉壁和体内环境带给你的性刺激，而不是接受了成为食物的命运。" +
                "IEPX被迫型猎物中的相当一部分个体可能真的对吞食并没有太多的渴望，但被肉壁包裹带来的性刺激会让他们暂时忽略自己的抗议和反对，在真的被食者消化之前享受这一切带来的快乐。";
            break;
        case 'SVAN-U':
            title2.innerText = '喂养者-The Feeder';
            textareaheader.innerText =
                "“我带来了今天的猎物…你会继续和我交易的，对吧？哈哈……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "其他的猎物偶尔能看到你和一位食者同时出现，但你从未消失在他们活动的区域。要问为什么的话，或许曾经被你投喂给她的张三李四王五可以回答这个问题……" +
                "你通过和食者社交甚至是交易，说服她们，让她们承认这样一件事：比起将你作为一顿饭消耗掉，把你当做长期合作的伙伴得到的价值要高得多。" +
                "与其说你是某种猎物，不如说你更像是食者的饲养员，因为你总是为她们提供新的猎物，以保证你所饲养的食者不会将你当做她们的下一顿。" +
                "但你应该随时警惕她们肚子里的咕噜声，因为许多处于饥饿当中的食者不太愿意进行过长时间的等待，也许下一个滑进她们肚子里的食物就是你自己。" +
                "SVAN被迫型猎物会试图和食者建立交易与合作，用牺牲其他猎物同类的方式来换取自己的生存，如果某天他们和食者建立交易的意愿失败，或者被合作的食者吞下，他们通常会极力挣扎。";
            break;
        case 'SVAX-U':
            title2.innerText = '窥探者-The Voyeur';
            textareaheader.innerText = "“很高兴里面的人是他而不是我……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你通常是一个旁观者，当你看到其他人被食者当做食物吞进的肚子里时会感受到奇怪的兴奋，但你又害怕成为她们的食物，这也是你作为被迫型猎物最重要的一个特征。' +
                '你可能拥有一个食者伙伴，并偶尔或者经常性地将其他猎物同类投喂进她的肚子里，会关注食者吞食猎物的社交媒体信息，会在别人被吞下时驻足观看并获得快感。' +
                '你的主动特质会潜移默化地影响你，让你与食者的距离越来越近，让你越来越渴望主动经历被吞食的感受，直到最后，你会越过一条曾经由你自己树立起来的警戒线。' +
                '直到这时，你的性欲望会反过来影响你，让你放下对成为食物这件事的恐惧，让你不禁思考自己距离最终无路可退的处境到底还有多少距离。' +
                'SVAX被迫型猎物拥有一个潜移默化转换的过程，他们会从最初的害怕成为食物转化为最终的渴望经历被吞食的体验，最终将自己送入食者的嘴中。从这方面来看，他们更像是潜在的自愿型猎物的替补。';
            break;
        case 'SVPN-U':
            title2.innerText = '奉献者-The Gourmet';
            textareaheader.innerText =
                "“希望你至少会喜欢我的味道，即使这里的环境对我来说有些恶心。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你是真的不想被吃掉的，但如果真的被食者接近，你也会很快屈服并被她们肆意掌控，为所欲为。" +
                "然而，与IVPN那种认命的心态不同，你至少会确保让吃掉你的食者尽可能的获得享受。" +
                "如果你必须要成为一顿食物，那也必至少应该是一顿难以忘怀的大餐，能够带给食者极致的体验，而不是当个普通的食物，被食者普通的果腹然后很快遗忘。" +
                "尽管你大概不会承认，但你确实很期待在食者的肚子里收到她们对你味道的赞美，夸奖你为她们所做出的贡献有多么的杰出，期待你加入她们身体后她们能获得怎样的提升。" +
                "SVPN被迫型猎物不太愿意被吃掉，但是会很快屈服并希望成为一顿让食者难忘的美味大餐，他们的感官特质注定了他们会对食者挑逗的言语产生反应。";
            break;
        case 'SVPX-U':
            title2.innerText = 'The Offering';
            textareaheader.innerText =
                "“嗯…既然事已至此，那就试着享受吧……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你有着与SVPN-U几乎在所有方面都相似的特征，只有对被吞食的反应方面有所不同。" +
                "SVPN-U希望自己成为一顿令食者难以忘怀的美味大餐，而你更专注于在束缚着自己的胃内获得快感。" +
                "你抵触成为食物，但最终在食者面前放弃，让自己完全处于食者的支配之中。" +
                "当你彻底被食者控制并支配时，你能获得奇怪的兴奋感，因此当你已经深陷于她们的体内，那种被彻底支配的感觉也会令你沦陷在性与欲望的沼泽中难以自拔。" +
                "SVPX被迫型猎物不太愿意被吃掉，但是会很快屈服于被食者支配所带来的强烈兴奋与快感中。他们不会承认自己真实的内心情感，因此只会在被食者吞下去之后才开始放飞自我。";
            break;
        case 'SEAN-U':
            title2.innerText = '受辱者-The Humiliated';
            textareaheader.innerText = "“快、快放开我！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "当你被食者吞食的时候你会发现，她们给你带来的最大的情感反馈是羞耻和屈辱。" +
                "至于胃壁给你带来的感受和体验，于你而言并不如食者的言语和感情上的体验重要。" +
                "你的分享特质让你更加注重对方的感受，而你的情感特质则更容易让你在乎对方的表达，两相结合之下产生了微妙的反应，这使得你极其容易被食者挑逗和嘲弄，从而生出屈辱情绪。" +
                "食者的嘲笑只会让你更加坚定地想要脱离这尴尬的局面，更加卖力的逃跑和脱困，从而维护你那脆弱的自尊心，使其不会遭受到来自吃掉你的家伙言语上的伤害。" +
                "SEAN非主动型猎物很容易遭受捉弄和羞辱，对于食者的言辞更加敏感，嘲笑不会让他们兴奋或者放弃，只会令他们的自尊心受到伤害，而为了避免这种心灵层面的伤害，他们会选择更加卖力的脱困。";
            break;
        case 'SEAX-U':
            title2.innerText = '嘴硬者-The Closeted';
            textareaheader.innerText =
                "“我才没有脸红，只是太热了而已！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "有个词语用来形容你是再合适不过了：“嘴硬”！" +
                "你的分享特质让你更加注重对方的感受，而你的情感特质则更容易让你在乎对方的表达，两相结合之下产生了微妙的反应，这使得你极其容易被食者挑逗和嘲弄，从而生出羞耻情绪。" +
                "因此你很容易受到来自食者的嘲弄和挑逗，尤其是那些跟你关系亲密的食者。" +
                "你会在食者对你的戏弄中找到一些性刺激，但嘴硬的你打死也不会承认你从被她们吃掉这件事上面获得了快感。所以，你的挣扎和扭动不是因为你感受到了羞耻，而是你用来掩盖自己被食者支配时产生的快感。" +
                "SEAX被迫型猎物被食者支配时的反应很容易诱惑和刺激到食者，进而给他们带来更多的戏弄和挑逗，而他们也同样能在这些挑逗中获得快感。只不过，死鸭子嘴硬的他们通常试图通过否认和挣扎来掩盖自己内心真实的欲望。";
            break;
        case 'SEPN-U':
            title2.innerText = '单纯者-The Trusting';
            textareaheader.innerText =
                "“呃…好吧，但是我想出去的时候你得立刻放了我，行吗？”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "总的来说，你是极不情愿成为某位食者的食物的。但如果是被你信任的食者的软磨硬泡、威逼利诱下，你还是会愿意短暂性地扮演她们的食物。" +
                "她们总能很轻松地将你诱骗进她们的体内，因为当她们真的有这样的愿望或者欲望时，你的分享特质会令你更加优先地考虑她们的感受。" +
                "不过在大多数情况下，你还是希望能够在她们用餐之前从她们那里得到关于你的安全性的保证，以确保你真的只是在短暂地扮演她们的食物，而不是莫名其妙的真的成为了她们的食物。" +
                "然而，尽管你渴望掌控局面，约束食者的意图，但如果吃下你的食者开始表现得更加强势，你往往会迅速陷入被动，进而在合适的时间和食者的主导下变成自愿型的，她们真正的食物。" +
                "SEPN被迫型猎物在主观层面是不情愿的，但很容易被他们的伴侣或者受信任的朋友食者诱拐进肚子里。只要食者足够强势，足够善于操纵情绪，他们就会很容易沦陷，从扮演食物转变为真正的食物。";
            break;
        case 'SEPX-U':
            title2.innerText = '玩具-The Toy';
            textareaheader.innerText =
                "“你尽情地享受就好，不用在意我。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "如果要用一组词语来对你进行总结的话，最合适的摸过于“不太情愿的性玩具”。" +
                "你并不像你的食者那样享受吞食带来的快感，但你和你的食者亲密的关系使你通常可以克服这一点，以满足她们吃掉你的愿望。" +
                "但你也不是彻底服务于她们的工具，你本身也能从这个过程中获得快感。那么，你能获得的快感究竟是什么呢？答案或许就在你的特质里。" +
                "来自于分享和情感的特质让你更注重情感和表达带来的快感，加上被动特质，使你能够在被吃掉的支配方面找到性方面的刺激，虽然你并不会承认被支配是你喜欢的事情。" +
                "SEPX被迫型猎物并不特别享受被吃掉的感觉，也不太愿意成为伴侣的“玩物”，但他们仍然会为了实现伴侣的愿望和考虑到和伴侣紧密的关系，以被动的态度同意被她们吃掉。";
            break;
    }

    // Build the Traits Description

    let isDesc = '';
    let veDesc = '';
    let apDesc = '';
    let xsDesc = '';

    if (I >= S) {
        isDesc = "<b>自我 - Individual (I)</b><br>" +
            "自我特质影响着个体趋于自私自利，自我中心，这使得他们通常只考虑自己，而不会在意对方的感受。<br><br>";
        switch (testType) {
            case "PRED":
                isDesc +=
                    "拥有自我特质的食者的行为主要以满足自身的欲望和需求为目的，不会耗费精力去刻意地满足猎物的期望。<br>" +
                    "她们中的某些个体会放慢进食的节奏或者添加一些娱乐项目，但这一切的最终目的都是为了取悦她们自己。<br>";
                break;
            case "WPREY":
                isDesc +=
                    "拥有自我特质的自愿型猎物在被捕食的过程中，只关注于满足自己的欲望和需求，不太会考虑食者的欲望和感受。<br>" +
                    "他们的行为主要以满足自己的需求和欲望为目标，而不会过多在意食者是否愿意接受他们这样的食物。<br>";
                break;
            case "UPREY":
                isDesc +=
                    "拥有自我特质的被迫型猎物在被捕食的过程中，只关注于满足自己的欲望和需求，不太会考虑食者的欲望和感受。<br>" +
                    "他们不太关心食者的体验和需求，只会自顾自地逃跑，毕竟被迫型猎物主观上并不愿意被吞掉。<br>";
                break;
        }
    } else {
        isDesc = "<b>共享 - Shared (S)</b><br>" +
            "共享特质令拥有它的个体懂得忧他人之忧，乐他人之乐，而不是一味地满足自己。<br><br>";
        switch (testType) {
            case "PRED":
                isDesc +=
                    "拥有共享特质的食者会在吞食的过程中主动取悦自己的猎物。<br>" +
                    "她们仍然会想办法让自己得到满足，但她们会首先尊重猎物的愿望。<br>" +
                    "只有自己的猎物伴侣在自己这里获得了快乐，她们才会真正得到满足。<br>" +
                    "并且，她们通常只会吃掉那些自愿成为食物的人。<br>" +
                    "因为她们从不强硬地忽略食物的感受，只会请（you）求（huo）他们主动奉献自己。<br>" +
                    "如果她们在迫不得已的情况下吃掉了强烈反抗的被迫猎物，那么她们多少都会难过一段时间。<br>";
                break;
            case "WPREY":
                isDesc +=
                    "拥有共享特质的自愿型猎物会在被吞食的过程中主取悦自己的食者。<br>" +
                    "他们仍然会想办法让自己得到满足，但他们会首先尊重食者的愿望。<br>" +
                    "只有自己的食者伴侣在自己这里获得了快乐，他们才会真正得到满足。<br>" +
                    "因此，他们在许多时候都扮演着牺牲者、奉献者一类的角色，将自己的身心都献给吞下他们的人。<br>";
                break;
            case "UPREY":
                isDesc +=
                    "拥有共享特质的被迫型猎物通常会以一种相对不情愿的态度来应对他们的食者。<br>" +
                    "这通常表现为一种迟疑：他们不太愿意，但也不太反对。<br>" +
                    "他们可能会不太愿意给食者造成伤害，进而将对死亡的恐惧转化为对奉献的认可。<br>" +
                    "因此他们可能并不希望成为食物，但当他们真的被吃下去之后，他们也会很快选择顺从。<br>" +
                    "";
                break;
        }
    }
    if (V >= E) {
        veDesc = '<b>本能 - Visceral (V)</b><br>' +
            '本能特质影响个体的行为趋于本能与合理性，这种影响往往表现在生理的层面上。<br><br>';
        switch (testType) {
            case "PRED":
                veDesc +=
                    "拥有本能特质的食者的捕食行为受到原始的饥饿感或者来自身体本能的欲望驱使。<br>" +
                    "她们吞食的动力源自于生理的需要，或者对吞食行为本身的渴望。<br>" +
                    "至于那些所谓的和猎物的关系，吞食的意义，于她们而言根本无关紧要。<br>";
                break;
            case "WPREY":
                veDesc +=
                    "拥有本能特质的自愿型猎物渴望被吞食的理由通常是因为他们能在这个过程中感到愉悦，他们在生理上享受这一经历。<br>";
                break;
            case "UPREY":
                veDesc +=
                    "拥有本能特质的被迫型猎物通常是出于活下去的本能而趋于逃避，或者是因为被困在食者体内所造成的不适和痛苦驱使他们奋力反抗。<br>";
                break;
        }
    } else {
        veDesc = '<b>情感 - Emotional (E)</b><br>' +
            '情感特质带来的影响趋于表现在心理的层面，这使得拥有它的个体更多地关注整个吞食过程背后的深层含义。<br><br>';
        switch (testType) {
            case "PRED":
                veDesc +=
                    "拥有情感特质的食者享受与猎物之间的关系，可能是一种情感的表达，也可能是一种支配的表现；<br>" +
                    "或者是因为她们享受把另一个生物保留在自己的体内甚至将他们转化为身体的一部分所带来的心态上的变化。她们同时也享受食物在体内祈求或挣扎所带来的情感上的冲击。<br>";
                break;
            case "WPREY":
                veDesc +=
                    "拥有情感特质的自愿型猎物享受着与食者之间的关系，可能是一种情感的表达，也可能是一种被支配的表现；<br>" +
                    "或者是因为他们享受被另一个生物吞下后从个体到食物的身份上的变化，甚至是期待着被食者消化后成为她们身体的一部分所带来的心态上的变化。<br>" +
                    "他们同时也享受被食者挑逗、玩弄时带来的情感上的冲击。<br>";
                break;
            case "UPREY":
                veDesc +=
                    "拥有情感特质的被迫型猎物更希望自己能够顺利逃脱，因为他们对被食者以这种方式征服所带来的影响尤为看重。<br>" +
                    "不是因为他们生理上对被吞食这件事感到恐惧，而是因为被吞食后，他们再也无法继续自己的生活，甚至会因此失去生命。<br>";
                break;
        }
    }
    if (A >= P) {
        apDesc = "<b>主动 - Active (A)</b><br>" +
            "主动特质驱使着个体下意识地推动诉求的发生，通过付出看得见的努力去达成自己的目的。<br><br>";
        switch (testType) {
            case "PRED":
                apDesc +=
                    "拥有主动特质的食者的行动机制很简单，她们通常主动狩猎自己的猎物，主动创造能够吞下猎物的机会。<br>" +
                    "被她们抓住的猎物可能会被她们毫不犹豫地物吞下，直奔主题向来是主动特质的一大表现。<br>" +
                    "如果遭受到猎物的反抗也无所谓，她们不会介意使用一些强制的手段让这些反抗无效化。<br>";
                break;
            case "WPREY":
                apDesc +=
                    "拥有主动特质的自愿型猎物的行动机制很简单，他们通常主动靠近食者，将自己暴露在危险中，或者以摆烂的姿态面对成为食物的命运。<br>" +
                    "他们会主动渴求成为食者的食物，甚至主动钻进她们的肚子里，这样的主动性有时甚至会让一些资深食者感到迷茫……到底谁才是猎物？<br>";
                break;
            case "UPREY":
                apDesc +=
                    "拥有主动特质的被迫型猎物的行动机制很简短，他们通常主动远离危险，想方设法使自己安全，即使被食者盯上，他们也会奋力反抗。<br>" +
                    "他们绝不妥协自己的命运，在食者的股掌之间拉扯，不放过任何逃跑的机会，即使最终被吞入腹中，他们也会竭尽全力地抵抗胃壁的挤压。<br>";
                break;
        }
    } else {
        apDesc = "<b>被动 - Passive (P)</b><br>" +
            "被动特质影响个体的行为趋于消极，他们从不主动去创造和推动对自己有利的处境。<br><br>";
        switch (testType) {
            case "PRED":
                apDesc +=
                    "拥有被动特质的食者倾向于等待猎物主动请求成为她们的食物，而不是主动出击，狩猎自己的目标。<br>" +
                    "如果出现了令她们食欲大动的猎物，她们大概率仍然保持被动等待。<br>" +
                    "她们也会通过观察、了解自己的猎物，制定一个完美的计划令自己的猎物主动奉献自己，比如用她们妙曼的身体引诱他们。<br>" +
                    "拥有被动特质的食者通常不会承认自己是个食者，即使猎物出现在周围也会按捺住自己的欲望……<br>" +
                    "当然，这种状态通常都持续不了太久，诱惑过大她们就会很快屈服。<br>";
                break;
            case "WPREY":
                apDesc +=
                    "拥有被动特质的自愿型猎物不会刻意去寻找食者，也不会刻意躲着她们。<br>" +
                    "但是，一旦他们被抓住，通常就会因为各种心理因素而快速屈服自己的命运。<br>" +
                    "比如服从的性格、绝望无助的心理状态或者被吞食带给他们的性刺激。<br>" +
                    "一旦他们接受了自己的处境，就会更积极地服从吞下他们的人，迅速成为被她们支配的对象。<br>" +
                    "他们甚至会在一定程度上改变对自己的认知，接受自己作为食物的命运，甚至承认是“玩具“的身份。<br>";
                break;
            case "UPREY":
                apDesc +=
                    "拥有被动特质的被迫型猎物通常会是一个失败主义者。<br>" +
                    "虽然他们抗拒成为食物，但却不会积极争取自己的命运，而是随遇而安，躺平摆烂。<br>" +
                    "并且，一旦被抓住，他们通常都会由于绝望的情绪而迅速放弃抵抗。<br>" +
                    "对于他们来说，在绝对的力量面前，抵抗和挣扎是没有意义的。<br>";
                break;
        }
    }
    if (X >= N) {
        xsDesc = "<b>性欲 - SeXual (X)</b><br>" +
            "性欲特质将吞食与性欲绑定到了一起，吞食的行为会为他们带来相对的性刺激。<br><br>";
        switch (testType) {
            case "PRED":
                xsDesc +=
                    "拥有性欲特质的食者认为吞食猎物是一种诱惑，充满了情欲。<br>" +
                    "她们通常难以抗拒吞下猎物的行为带来的身体上的冲击和兴奋。<br>" +
                    "与其说吞食猎物是某种爱好或者娱乐，她们更倾向于将吞食猎物理解为性欲的延伸，并加以享受。<br>";
                break;
            case "WPREY":
                xsDesc +=
                    "拥有性欲特质的自愿型猎物认为被吞食是一种诱惑，充满了情欲。<br>" +
                    "他们通常难以抗拒被食者吞下时带来的身体上的冲击和兴奋。<br>" +
                    "与其说被她们吞食是某种爱好或者娱乐，他们更倾向于将被吞食理解为性欲的延伸，并加以享受。<br>";
                break;
            case "UPREY":
                xsDesc +=
                    "拥有性欲特质的被迫型猎物认为被吞食是一种诱惑，带着情欲的成份。<br>" +
                    "他们通常难以抗拒被食者吞下时附带的身体上的冲击和兴奋，哪怕他们抗拒被吞掉这件事本身。<br>" +
                    "即便如此，一旦他们被纳入某位食者的体内，他们仍然可以很快感觉到这份欲望并加以享受。<br>";
                break;
        }
    } else {
        xsDesc = "<b>感官 - SeNsual (N)</b><br>" +
            "感官特质能够摒弃身体欲望的影响，给个体带来纯粹的精神上的快乐和想法上的满足。<br><br>";
        switch (testType) {
            case "PRED":
                xsDesc +=
                    "拥有感官特质的食者吞食猎物的行为可以具有各种各样的动机，这取决于她们的其他特质带来的影响。<br>" +
                    "一般来说，她们吞食是为了果腹、获得满足感、和食物增进关系或单纯的娱乐行为，而不是出于性体验。<br>" +
                    "不过这并不意味着感官特质的食者不能偶尔体验一下吞食给她们的身体带来的性冲击和兴奋。<br>";
                break;
            case "WPREY":
                xsDesc +=
                    "拥有感官特质的自愿型猎物更注重于被吞食这件事带给自己的精神方面的体验而不是肉体的欲望。<br>" +
                    "他们并不在乎甚至感受不到被吞食带来的身体方面的欲望，而是专注于感受自己心中的渴望被实现所带来的满足感。<br>";
                break;
            case "UPREY":
                xsDesc +=
                    "拥有感官特质的被迫型猎物，或许应该称你为局外人？没事儿瞎做什么题，幻想一下自己哪天遇到根本不存在的食者时的反应吗？<br>" +
                    "感官特质的被迫型猎物难以从被吞食这件事里感受到到来自身体的欲望，他们更在乎被吞下这件事会给自己带来怎样的精神和心理方面的影响。<br>" +
                    "由于他们的被迫特质，他们自始至终都是一个无辜的受害者，无法从被吞食这件事里获得任何有价值的体验，无论是精神上的还是身体上的。<br>";
                break;
        }
    }

    textarea3.innerHTML =
        isDesc +
        '<br /> <br />' +
        veDesc +
        '<br /> <br />' +
        apDesc +
        '<br /> <br />' +
        xsDesc;

    // PERCENTAGE CALCULATOR

    // Hard code max values for all (30) strdis+stragr

    let isTotal = 30;
    let veTotal = 30;
    let apTotal = 30;
    let xnTotal = 30;

    let iPerc = (I / isTotal) * 100;
    let sPerc = (S / isTotal) * 100;
    let vPerc = (V / veTotal) * 100;
    let ePerc = (E / veTotal) * 100;
    let aPerc = (A / apTotal) * 100;
    let pPerc = (P / apTotal) * 100;
    let xPerc = (X / xnTotal) * 100;
    let nPerc = (N / xnTotal) * 100;

    // STRDIS=3 to Opposite, DIS=1 to Opposite, NEU=0,  AGR=2, STRAGR=3

    scoreI.innerText = Math.round(iPerc) + '%';
    scoreS.innerText = Math.round(sPerc) + '%';
    scoreV.innerText = Math.round(vPerc) + '%';
    scoreE.innerText = Math.round(ePerc) + '%';
    scoreA.innerText = Math.round(aPerc) + '%';
    scoreP.innerText = Math.round(pPerc) + '%';
    scoreX.innerText = Math.round(xPerc) + '%';
    scoreN.innerText = Math.round(nPerc) + '%';
}

// Initialisation
const hashRegex = /^#([IS][VE][AP][XN])(?:-([WU]))?\/?(?:\/(\d{1,3}(?:-(\d{1,3})){7}))?$/i;

function processHash() {
    if (window.location.hash == '' || window.location.hash == '#') {
        resetTest();
        resetScores();
        hideMenu('results-menu');
    } else {
        const m = hashRegex.exec(window.location.hash);
        if (m !== null) {
            switch ((m[2] ?? '').toUpperCase()) {
                case 'W':
                    //title.innerText = title.innerText + ' - Willing Prey';
                    testType = wpreyStatements;
                    document.body.className = 'wpreybody';
                    changeTheme("var(--wPrey)");
                    break;
                case 'U':
                    //title.innerText = title.innerText + ' - Unwilling Prey';
                    testType = upreyStatements;
                    document.body.className = 'upreybody';
                    changeTheme("var(--uPrey)");
                    break;
                default:
                    //title.innerText = title.innerText + ' - Predator';
                    testType = predStatements;
                    document.body.className = 'predbody';
                    changeTheme("var(--pred)");
                    break;
            }
            if (m[3]) {
                const tokens = m[3].split('-');
                I = parseInt(tokens[0]);
                S = parseInt(tokens[1]);
                V = parseInt(tokens[2]);
                E = parseInt(tokens[3]);
                A = parseInt(tokens[4]);
                P = parseInt(tokens[5]);
                X = parseInt(tokens[6]);
                N = parseInt(tokens[7]);
            } else {
                const type = m[1].toUpperCase();
                if (type[0] == 'I') I = 30; else S = 30;
                if (type[1] == 'V') V = 30; else E = 30;
                if (type[2] == 'A') A = 30; else P = 30;
                if (type[3] == 'X') X = 30; else N = 30;
            }
            hideMenu('main-menu');
            finalResult();
        }
    }
}

window.addEventListener('hashchange', processHash);
processHash();
