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
    progressbarfill = document.getElementById('progress-bar-full'),
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
//     {question: 'I roll my eyes at predators who tell me how hungry they are.',
//     answers: [{type:'I', value: 3},{type:'I', value: 1},{type:null, value: null},{type:'S', value: 1},{type:'S', value: 3}]},

//Test Statements Small Note: If these are the same thing it causes problems when loading a results page
// (This does not happen after a test is takes as these ger replaced with the correct data from the json file)
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
            title2.innerText = '魅魔 - The Ravenous';
            textareaheader.innerText =
                "“嗯~~竭尽全力地挣扎吧~也许再努力点就可以逃出去了~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "于你而言，填饱肚子是一回事，但吞下猎物的行为给你带来的更多是……性欲。\n" +
                "当一些倒霉的猎物被你吞下喉咙，他们不仅会为你的身体做出贡献，还会为你带来一个极致享受的激情夜晚。\n" +
                "你擅于掌控他们的心态，拿捏他们的期待，让猎物不会轻易放弃抵抗。\n" +
                "而猎物在你腹中的一切挣扎和蠕动，都将化作刺激肉体的电流，给你带来极致的快感。\n" +
                "而他们的养分增加的也不仅仅是你妙曼的曲线，还有床单上湿漉漉的汁水。\n";
            textarea4.innerText =
                "IVAX型的食者会沉浸在猎物的蠕动和反抗中，尤其是他们在正确方向上做出的恰到好处的蠕动和刺激。\n";
            break;
        case 'IVPN':
            title2.innerText = '蜘蛛 - The Spider';
            textareaheader.innerText =
                "“这么努力地压抑对我的渴望，就是为了得到我更加激烈的攻势吗~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "比起主动去寻找猎物，你更倾向于等待他们落入你精心编织的圈套。\n" +
                "因为你知道只要有足够的耐心，高品质的食物会在合适的时间把自己送到你的面前。\n" +
                "即使这样的做法通常会令你饥饿难耐。\n" +
                "所以猎物一旦出现，你就会理所应当地享受这份通过压抑和等待换来的美味。\n" +
                "正如俗语所言，成功最终属于耐心等待的人。\n";
            textarea4.innerText =
                "IVPN型的食者擅于玩弄自己的猎物，引诱他们逐渐沦陷，最终将身心全部奉献出去。\n";
            break;
        case 'IVPX':
            title2.innerText = '海妖 - The Siren';
            textareaheader.innerText =
                "“难道你不想丰满我的曲线，成为这具妙曼身体的一部分吗？来吧……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你会在吃掉猎物前认真考虑他们的颜值，因为你更喜欢可爱或者更具魅力的猎物；\n" +
                "或者说，你的猎物一定在某些方面存在着一些令你难以抗拒的特性。\n" +
                "这能让你在品尝他们的味道时，给你带来更多的精神层面的享受。\n" +
                "或者，你也许只是在确保拥有最高质量的猎物进入你的身体；\n" +
                "因为你期待他们的加入能使你的身体曲线变得更加诱人。\n";
            textarea4.innerText =
                "IVPX型捕食知道，猎物的某些特性会在被她们吸收的过程中成为她们美妙躯体的一部分。\n";
            break;
        case 'IEAN':
            title2.innerText = '私欲 - The Seeker';
            textareaheader.innerText =
                "“随你怎么挣扎吧，这是我的身体赐予你最后的仁慈。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你的狩猎必定拥有目的，你的进食必然存在理由。\n" +
                "也许是惩罚那些令你不爽的个体，亦或者满足支配他人的快感；\n" +
                "总之，你的猎物一定能给你带来一些补充饥饿之外的满足。\n" +
                "吞食行为是你达成某种目的的一种手段，而不是单纯的为了进食。\n" +
                "因此，欣赏他们在你体内绝望的抵抗可以让你获得情感和精神层面的额外满足。\n";
            textarea4.innerText =
                "IEAN型食者不认为吞食行为是必须的事情，但她们会为了达到某种目的而选择将对方当做食物吃掉。\n";
            break;
        case 'IEAX':
            title2.innerText = '欺凌 - The Bully';
            textareaheader.innerText =
                "“原来只需要这样你就会继续抵抗呀……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你总是知道该说些什么来让腹中的食物保持蠕动。\n' +
                '你喜欢嘲弄和挑逗他们，让他们持续不断地挣扎抵抗，因为这样可以让你获得一些……乐趣。\n' +
                '与其说你喜欢玩弄肚子里的食物，不如说你吞下他们的根本目的就是为了玩乐消遣；\n' +
                '特别是对于让食物在自己的胃里耗尽精力这件事，你沉浸其中，乐此不疲。\n' +
                '并且，支配那些自愿献身或者及其被动的食物，弄清楚怎样让他们蠕动起来也称得上是有意思的事情。\n';
            textarea4.innerText =
                'IEAX型食者并非总是恶意的，也许她们只是单纯的喜欢和猎物调情，或者在吃掉猎物的时候玩弄他们。\n';
            break;
        case 'IEPN':
            title2.innerText = '诱惑 - The Trapper';
            textareaheader.innerText =
                "“你知道如何让我们的关系更加紧密，问题在于……你什么时候愿意主动踏入？”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你喜欢诱骗自己的猎物产生一种安全感，哪怕你们双方都知道这份安全感是如此的虚假。\n" +
                "你会主动了解自己的猎物，用各种方式暗示他们的命运，但却从不露骨地将其表达出来。\n" +
                "某种程度上，你的猎物很清楚自己早晚会成为你的食物\n" +
                "然而你与生俱来的魅力却鼓励他们保持着与你微妙的关系。\n" +
                "你不会主动要求你的食物奉献自己，而是引诱他们主动挑破关系，渴求被你吃掉。\n";
            textarea4.innerText =
                "IEPN型食者充满诱惑又极度危险，她们享受诱惑猎物，吞食他们，支配他们所带来的满足感与成就感。 \n";
            break;
        case 'IEPX':
            title2.innerText = '风情 - The Temptress';
            textareaheader.innerText =
                "“我会给你最美妙的体验，而它将以你滑入我的胃中而结束。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你经常出现在公共场合，利用自己精心维系的容貌和人设吸引猎物将目光投向自己。\n' +
                '一旦猎物上钩，你便会向他们抛出一个媚眼，暗示并引导他们陷入你编织的更深的陷阱。\n' +
                '你们会去到一个适合交谈的地方，以便彼此能够更好的了解对方。\n' +
                '当你们已经足够了解彼此的身心之后，你便会将他们拉入一场激情之夜；\n' +
                '在他们品尝过你妙曼的身体与妩媚的灵魂后，现在该轮到你来品尝他们的身体了。\n';
            textarea4.innerText =
                'IEPX型食者喜欢与猎物玩一场精心策划的情欲游戏，并在过程中享受送上门的食物。她们诱人的本性通常令人难以抗拒。\n';
            break;
        case 'SVAN':
            title2.innerText = '友善 - The Companion';
            textareaheader.innerText = "”很高兴你能奉献自己，让我们一起体验这美妙的旅途吧~“";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '也许你自己都没有意识到，你与暴食的差距仅仅只是一个友善的态度。\n' +
                '相比之下，你会对人们有一个主观清晰的划分：愿意奉献自己的美味食物和其他应急食物。\n' +
                '你不会完全忽略猎物的态度和想法，而是主动寻找那些愿意成为食物的个体来满足自己的胃口。\n' +
                '你会下意识地让这场经历成为能双方都感到愉快的体验。\n' +
                '尽管满足自己的口腹之欲仍是你吞下他们的主要原因，但你共享的特质使你的食欲不会完全凌驾于食物的体验之上。\n';
            textarea4.innerText =
                'SVAN型食者往往会优先考虑猎物的体验和想法，这意味着她们的食物通常都能保持愉悦地溶解在她们的肚子里。\n';
            break;
        case 'SVAX':
            title2.innerText = '款待 - The Host';
            textareaheader.innerText = "“希望你能对这样的结局感到满意。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你喜欢在正式开始吃掉你的猎物前让他们尽可能地接受最终的结果。\n' +
                '你会尽可能地让他们不会感到难受，并清楚地阐述即将发生的一切。\n' +
                '你会解释自己的饥饿和欲望需要被他们填满，这一切对于双方而言有多么的美好。\n' +
                '你的口才加上你天生的气场具备强大的感染力。\n' +
                '即使是最不情愿的猎物，通常都能被你成功说服，并让他们沉浸在被你吃掉的畅享中。\n';
            textarea4.innerText =
                'SVAX型食者中的小部分会给自己的感染力中滴入谎言，但大多数还是希望以真诚打动食物，照顾腹中食物的情绪。\n';
            break;
        case 'SVPN':
            title2.innerText = '抑制 - The Tempted';
            textareaheader.innerText =
                "“我真的对此感到抱歉！但我实在控制不住自己……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '一直以来你的朋友们都有一个巨大的威胁，那就是源自于你的饥饿欲望。\n' +
                '你真的不愿意伤害他们，但如果饥饿欲望突然爆发，你又难以遏吃下他们的冲动。\n' +
                '把他们全部吞下去是一件多么美妙的事情？在被饥饿侵袭时你无法忽略这种想法。\n' +
                '因此，有一个自愿成为食物的伙伴对你而言是一个很好的解脱方式……\n' +
                '所以，由衷地希望你的胃口不大，一次只吃得下一个而不是一群。\n';
            textarea4.innerText =
                'SVPN型食者难以在自己的欲望和照顾周围人感受的纠结中做出选择，几乎不存在例外，她们最终都会屈服于自己的欲望。\n';
            break;
        case 'SVPX':
            title2.innerText = '食色 - The Lustful';
            textareaheader.innerText =
                "“涩涩是很棒啦……但是被吞噬的感觉会更棒哦~啊呜~！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '一个激情四射的美妙夜晚通常以你的饱腹而告终。\n' +
                '也许是在某个美妙绝顶的瞬间迷失自我，也许是帮助自己或者伴侣达到高潮；\n' +
                '也许是用这种方式取代相拥而眠……他最终的归宿必然会是你的肚子。\n' +
                '你很擅长让吞食成为你们爱情动作中的一个重要环节；\n' +
                '吞下他们是你满足性欲的重要方式。\n';
            textarea4.innerText =
                'SVPX型食者用吞食行为取代性行为，并让自己的伴侣很好地融入其中，至于他会以怎样的形态从哪里出来……';
            break;
        case 'SEAN':
            title2.innerText = '友人 - The Keeper';
            textareaheader.innerText = "“想要满足我的话，需要先到我的胃里来哦~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你热衷于与你身边的人保持足够亲密的关系。\n' +
                '但于你而言，没什么比把他们关在你的肚子里更好的方式了。\n' +
                '你喜欢与胃中的猎物度过美好的时光，即使是在日常生活中也会长时间将他们留在体内。\n' +
                '吞食这件事于你而言只是一种表达情感的方式，而非某种满足欲望的行为。\n' +
                '因此你的猎物通常都会相较安全，能得到被你关注照顾的良性体验。\n';
            textarea4.innerText =
                'SEAN型食者更关心与猎物的互动和情感联系，而不仅仅是食物摄取，猎物的概念也趋于爱人挚友，而不是食物。\n';
            break;
        case 'SEAX':
            title2.innerText = '拥怀 - The Collector';
            textareaheader.innerText =
                "“我希望我们永远在一起，即使这意味着你将会成为我的一部分……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "只有那些你喜欢的，认为能够给你的身体带来更好的翘挺曲线的个体，才有资格成为你的猎物。\n" +
                "在狩猎的过程中你会更偏向于主动奉献的生命，主动接触并了解那些吸引着你的个体。\n" +
                "你会鼓励他们探索你的身体，并期待着他们能够成为你妙曼身体的一部分。\n" +
                "而当你的猎物彻底融入你的身体后，你也不会迅速忘记这些奉献者。\n" +
                "你会抚摸因为他们的加入而更加诱人的曲线，并告诉他们你到底从他们那里获得了多少。\n";
            textarea4.innerText =
                "SEAX型食者注重猎物的情绪和感受，将他们吸收掉能获得的欲望上的满足，她们的猎物通常都是在兴奋中融入她们的身体。\n";
            break;
        case 'SEPN':
            title2.innerText = '助理 - The Nurturer';
            textareaheader.innerText =
                "“怎么样，舒服吗？玩够了的话记得告诉我哦。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你喜欢让你的猎物感到温暖和舒适，通常在吃掉他们之前和之后用安慰的话语鼓励他们。\n" +
                "你倾向于让猎物处于安全的环境，受到你的保护，而不是对他们造成任何形式的伤害。\n" +
                "如果你不得不对自己的猎物造成伤害，比如不得不消化掉他们时，你会显得十分纠结与犹豫。\n" +
                "当然，你也不会主动去狩猎你的猎物，而是当他们在向你寻求吞食的体验时，你才会将他们吞下去。\n" +
                "总的来说，你就像一个以猎物为中心的辅助吞食助理，向猎物们提供一个以满足他们诉求为主旨的吞食服务。\n";
            textarea4.innerText =
                "SEPN型食者几乎不会为了满足口腹之欲而吞食，也没有饥饿感之类的欲望，甚至部分个体都不认为自己是所谓的食者。\n";
            break;
        case 'SEPX':
            title2.innerText = '红颜 - The Romantic ';
            textareaheader.innerText =
                "“如果你也愿意的话，我希望在我的体内感受你的存在。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "浪漫主义、红颜知己、完美恋人、涩涩女孩，人们常常用这些称呼来形容你。\n" +
                "你比任何人都要了解吞食这件事在亲密关系中的本质：\n" +
                "这是在两个有着同样诉求的人之间最为激情的表露，是一种超越一切，独一无二的关系。\n" +
                "你注重于感受亲密对象在你体内的微小动作，也会被体内家伙的兴奋与欲望所感染，变得奇怪起来。\n" +
                "你通常会选择在一切结束之后把亲密对象吐出来，或者在能够复活的前提下将之消化，因你不会伤害你的亲密对象。\n";
            textarea4.innerText =
                "SEPX型食者会珍惜与她们的亲密对象建立起的情感连接，不希望他们受到任何伤害，即使是他们主动提出的伤害。\n";
            break;

        /* 自愿猎物 DESCRIPTIONS */

        case 'IVAN-W':
            title2.innerText = '自然馈赠 - The Snack';
            textareaheader.innerText =
                "“不要犹豫，直接张嘴，我能自己进去！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "所有的食者都应该由衷地感你谢这份来自大自然的馈赠，因为你渴望被某个食者吃掉。\n" +
                "你幻想被她们的红唇纳入其中，渴望被她们喉咙紧紧束缚，期待被她们胃中的低吟缠绕。\n" +
                "虽然这一切还没有发生，但是你知道，无论过程如何，你注定会成为某位女孩的食物。\n" +
                "你到处寻找食者，并试图主动被她们吃下，以至于大部分人都知道你的存在：\n" +
                "一个随时可以拿来填饱自己的小点心。";
            textarea4.innerText =
                "IVAN-W型猎物注重于被吃掉的过程和体验，只要能被吃掉，食者的身份和类型并不是什么重要的事情。\n";
            break;
        case 'IVAX-W':
            title2.innerText = '奶油泡芙 - The Thrill-seeker';
            textareaheader.innerText =
                "“你的舌头看起来好粘滑，我已经等不及被它卷进去了~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你积极追求你的吞食梦想，试图在每次遇到的食者身上把你的幻想变成现实。\n" +
                "有些食者或许会对你的主动感到质疑和警惕，但当你在她们的胃里蠕动时，所有的疑虑都会消失。\n" +
                "于你而言，被吞食能给你带来性方面的刺激，你会不惜一切代价去体验它。\n" +
                "在她们的腹中，你可能会持续不断的泄露奶油，直到把自己榨干为止。\n" +
                "因此，她们通常会戏称你为奶油小点心，比起单纯的自然馈赠，好歹算是加了点料？\n";
            textarea4.innerText =
                "IVAX-W型猎物注重于被吃掉的过程中带来的性体验，只要能被吃掉，食者的身份和类型并不是什么重要的事情。\n";
            break;
        case 'IVPN-W':
            title2.innerText = '赤诱浆果 - The Patient';
            textareaheader.innerText =
                "“为什么她们还不来吃掉我？难道是我还不够美味吗？”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "关于等待这件事，你比大多数人都要熟练。\n" +
                "你很羡慕那些遭遇了食者的人，但是你仍然无法鼓起勇气主动出击。\n" +
                "你的被动特质阻止了你进一步接近食者，即使你十分渴望被她们的胃壁包裹。\n" +
                "因此你会一直等下去，就像深山里的一颗红透的灌木浆果，等待着巧合之下闯入密林的她。\n" +
                "因为你相信，总会有一名食者悄悄盯上你，然后在她饥渴的欲望中将你吞入腹中。\n";
            textarea4.innerText =
                "IVPN-W型猎物等待着被食者吞下的机会，被吞食于他们而言是一种精神上的满足。\n";
            break;
        case 'IVPX-W':
            title2.innerText = '夏威夷果 - The Daydreamer';
            textareaheader.innerText = "“逃不掉了…真的逃不掉了~❤”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你几乎时刻都深陷在被食者吞下的幻想中，这些幻想令你无法自拔，难以抗拒。\n" +
                "轻吐而出的香甜热气，夹在腿间的温软柔舌，皴擦胸脯的的整洁皓齿，推送身体的紧致食道……\n" +
                "但你却始终无法踏出最关键的一步，当她的嘴真的在你面前张开，你却负隅抵抗，不愿沦为食物……\n" +
                "就像是被坚硬外壳包裹的夏威夷果，要想品尝果仁的香甜，就必须费劲地撬开厚厚的保护壳……\n" +
                "因此，当某个食者将你逼入绝境，而你已黔驴技穷，完全没有任何机会摆脱她之时……\n";
            textarea4.innerText =
                "IVPX-W型猎物极度渴望自己能够沦为食物，但幻想可以，来真的不行！除非……";
            break;
        case 'IEAN-W':
            title2.innerText = '水晶果冻 - The Worshipper';
            textareaheader.innerText =
                "“这里真的太舒服了，请永远不要放我离开~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "被肚子里的肉壁紧紧束缚着，这是在你看来无与伦比，无法超越的美好体验。\n" +
                "你天生对美少女的体内有着好感，或许是某些特质吸引着你，置身其中能使你的内心宁静。\n " +
                "如果一定要选择一个地方让你度过余生，那一定是她们的肚子里。\n" +
                "你就像是一块注定会被她们吞下的水晶果冻，只要能够待在里面，光是想想都令你无比期待。\n" +
                "你会将这份期待化为动力主动去寻找食者，想要在她们的体内找到那一份属于自己的安宁。\n";
            textarea4.innerText =
                "IEAN-W型猎物知道自己需要的多更是情感上的慰藉而不是肉欲欢愉，他们清楚自己目标并愿意主动实现自身的价值。\n";
            break;
        case 'IEAX-W':
            title2.innerText = '芒果冻干 - The Explorer';
            textareaheader.innerText = "“我听见了来自肚子的召唤~~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你的兴趣与爱好繁多且杂乱，对食者的倾向也是如此，并且你显然不打算浅尝辄止。\n' +
                '就像是新鲜出炉的芒果冻干，被运往世界各地的商店，期待着被不同的少女品尝。\n' +
                '因此，你享受被吞食给你带来的快乐，在肠胃的刺激中寻求性快感；\n' +
                '你也会四处探险，寻找新的喉咙与肚子进行探索，而不是被约束在某一个具体的食者的一个肚子里。\n' +
                '至少，你主观上是这样期待的。\n';
            textarea4.innerText =
                'IEAX自愿型猎物过于主动，过于自我，他们会忽略食者希望他们留下的意愿，如同花心男友狠心抛弃清纯少女。\n' +
                '这样的家伙，还是交给暴食们进行无害化处理吧。（悲）';
            break;
        case 'IEPN-W':
            title2.innerText = '奶油板栗 - The Wallflower';
            textareaheader.innerText =
                "“一个把我当成食物并像对待食物一样对待我的食者！嗯……我想我需要先冷静一下……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你几乎时刻都深陷在被食者吞下的幻想中，这些幻想令你无法自拔，难以抗拒。\n" +
                "而比起被胃壁束缚，幻想中吞下你的她对着你不断地嘲弄更加让你欲罢不能。\n" +
                "就像是被剥掉外壳的奶油板栗，无论曾经多么坚硬，于她而言也只剩下了美味。\n" +
                "但你却始终无法踏出最为关键的一步，你更多的只是幻想与期待而不是想要实现自己的幻想。\n" +
                "所以你期待着总有一天，你的某些特质会恰好让某个随机食者产生食欲，随后她一口吞掉了你。";
            textarea4.innerText =
                "IEPN-W型猎物追求的不仅仅是被吃掉的过程和结果，这件事对他们而言同样有着来源于情感方面别样诱惑力。";
            break;
        case 'IEPX-W':
            title2.innerText = '水果软糖 - The Blusher';
            textareaheader.innerText = "“张、张开了！她已经张开嘴了！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你很容易慌乱，哪怕仅仅只是看了一眼食者都可能导致你面红耳赤，心跳不已。\n' +
                '你的被动特性通常让你在食者面前显得无比乖巧与顺从；\n' +
                '那些善于戏弄自己猎物或者善于调情的食者能够更好地激发你的性欲，而你只能任凭她们摆布。\n' +
                '就像是一颗晶莹剔透的诱人软糖，被她含在嘴里，牙齿轻咬，柔舌舔舐，一点一点地融化在她的体内~\n' +
                '被吞掉于你而言几乎与被啪了无异，所以你更喜欢那些性感迷人的食者，尤其是那些能够撩动你内心的人。';
            textarea4.innerText =
                'IEPX-W型猎物更容易受到食者的影响，或者说，她们的存在本身就会不断刺激他们的情绪感官，哪怕只是想想都兴奋不已。';
            break;
        case 'SVAN-W':
            title2.innerText = '香脆薯片 - The Committed';
            textareaheader.innerText =
                "“如果我命中注定会成为某个女孩的食物，我想那个人一定是你。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你或许会主动将自己的身份视作食物，但你不会让自己落得个除了贡献养料以外毫无价值的下场。\n" +
                "比起成为随机陌生的食者的食物，你更倾向于为自己的朋友或者真正需要自己的人保留自己的价值。\n" +
                "你就像是她屯下来的储备粮薯片，默默地等待着实现价值的机会，希望她能从自己的爽脆口感中得到最好的体验。\n" +
                "本质上这仍然是一种交易：你为了满足被吃掉的体验而奉献自己，她为了满足吃掉你的欲望而向你索取。\n" +
                "但无论过程如何，动机如何，就结果而言，都是一个非常不错的双赢局面，不是吗？\n";
            textarea4.innerText =
                "SVAN-W型猎物能够很快结交到食者朋友，当他们双方都产生了吞食相关的欲望时，可以拜托或者直接消耗对方。";
            break;
        case 'SVAX-W':
            title2.innerText = '风味烤串 - The Flavourful';
            textareaheader.innerText =
                "“震惊！究竟是什么食物，竟有如此可口的味道？哦，原来是我自己！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你是一个标准的主动型食物，但作为食物，你却拥有着其他食物没有的奇妙风味。\n' +
                '你会难以遏制地通过打扮、穿着、气味等的方式主动吸引那些潜在的食者，让她们为你分泌唾液。\n' +
                '当你了解到某位食者的捕食规律时，你也会选择触发它们，激起她们的食欲，将你吞下。\n' +
                '就像是撒了特制香料的风味烤串，你存在的目的就是为了吸引她更快，更早，更渴望地品尝你的味道。\n' +
                '同时你也会积极地主张和她们一起涩涩，体验被她们吃掉的刺激，在她们的腹中宣泄自己的欲望。';
            textarea4.innerText =
                'SVAX-W型猎物喜欢寻求性刺激，并同时与食者维系着食者与食物的紧密关系，这些对他们而言并非是选择题，而是相辅相成的极致体验。';
            break;
        case 'SVPN-W':
            title2.innerText = '梦龙雪糕 - The Friend';
            textareaheader.innerText =
                "“如果实在忍不住的话就吃了我吧，我不会介意的。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "虽然你并不积极寻求成为食物的机会，但你仍然可能会结识多位潜在的食者朋友。\n" +
                "你的目的很明确，你期望着她们中的某一位最终会做出吃掉你的决定并赴之于行动。\n" +
                "比起这个，你反而很难说服自己和陌生的食者进行尝试。\n" +
                "你就像是一根维系冰凉体感的雪糕，等待着燥热难耐的她撕开你的包装，强势地将你放入她的口中。\n" +
                "你很难跟你的朋友们表明你对被吃掉的真实态度，以至于她们通常都觉得你或许并不想被她们吃掉。";
            textarea4.innerText =
                "SVPN-W型猎物是复杂且被动的，如果最终吞下他们的人是他们的朋友，他们可以得到额外的满足。";
            break;
        case 'SVPX-W':
            title2.innerText = '芝士福袋 - The Pleaser';
            textareaheader.innerText =
                "“快…快吃掉我吧……求你了，求你了！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你努力与吸引着你的那些食者个体建立联系，希望能够有幸进入她们性感的体内。\n' +
                '你更愿意被她们主导你的身心，主动将你吞下，而你则完全顺从并享受这一过程。\n' +
                '你渴望成为她们肚子的鼓包，甚至是融入她们的体内，这于你而言是极致的性体验与高潮。\n' +
                '你专注于和她们最为激情的瞬间，如同被胃液溶解了外壳的芝士福袋，流淌出粘稠而香甜的芝士夹心。\n' +
                '你不断取悦她，她的反馈又不断取悦你自己，形成一种刹车失灵的单程循环——你迟早会彻底陷入其中，无法脱身。\n';
            textarea4.innerText =
                'SVPX-W型猎物善于在被吃掉的过程中取悦食者，并且他们自己也能在这个过程中获得满足，直到彻底放飞自我。';
            break;
        case 'SEAN-W':
            title2.innerText = '脆皮烤肠 - The Eager';
            textareaheader.innerText =
                "“我们是如此亲密的朋友，但我还是希望我们的关系变得更加亲密~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你在快乐的解读上有着和食者共通的观点，即她不希望你离开她的肚子，你也不想离开。\n' +
                '你会积极促进双方更快地进入到吞食的阶段，在她们的肚子里给到她们最舒适的按摩。\n' +
                '你可能还会希望能与食者融为一体，因为你认为你们双方都将从“食物成为更强大个体的一部分”中受益。\n' +
                '你就像是被她囫囵吞下的脆皮烤肠，香甜可口之余，你保证了自己归宿的主观性，她获得了你提供的能量和曲线。\n' +
                '于你而言和她们的情感连接更重要，而不是被吃掉本身，所以你也会觉得那些单纯把你视为食物的人会有些偏激。\n';
            textarea4.innerText =
                'SEAN-W型猎物渴望与食者拥有更加亲密的关系，享受被吞食所带来的特殊的含义，待在她们体内就能获得快乐和满足。';
            break;
        case 'SEAX-W':
            title2.innerText = '黑糖布丁 - The Flirtatious';
            textareaheader.innerText =
                "“如果我们之间只隔着一层肉壁，这场令人享受的聊天就会变得更加诱人~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你非常了解自己的兴趣与欲望，喜欢寻找与你的特质相匹配的食者。\n" +
                "你擅长勾引或利用性挑逗和嘲弄刺激食者，使她们迅速进入充满欲望的的状态然后吞下你。\n" +
                "你认为只有双方都处于开心和期待情绪下，吞食才存在积极意义，所以你不希望被那些过于自我的食者吞下。\n" +
                "如果食者足够吸引你，你也会渴望如同一勺黑糖布丁被她送进嘴里，吞入腹中，被她消化吸收，成为她的一部分。\n" +
                "毕竟你渴望加入吸引着你的个体的身体曲线以帮助她们变得更具吸引力，成为诱人躯体的一部分能让你获得更多的满足感。";
            textarea4.innerText =
                "SEAX-W型猎物寻求情欲上的互动，但更注重情感上的体验，他们愿意消化的动机只会是成为她们迷人身体的一部分。";
            break;
        case 'SEPN-W':
            title2.innerText = '阿尔卑斯 - The Servant';
            textareaheader.innerText =
                "“我已经等不及要被你的胃壁束缚，或者成为你的一部分了……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你乐于无私奉献自己以成为食者的食物并享受这个过程给你带来的快乐。\n" +
                "你渴望与食者建立更加亲密的联系，因此能支配你的都是你认可的朋友食者而不是陌生人。\n" +
                "你是一个专注于满足朋友的角色，通常会选择将控制权彻底交给她们。\n" +
                "就像是一颗被她含在嘴里的阿尔卑斯，任凭她想要支配你多久，你都能够感受到无比的满足。\n" +
                "因此你更像是朋友的私人小零食或者解压玩具，每当她们需要的时候你都会被她们肆意地拿走和使用。\n";
            textarea4.innerText =
                "SEPN-W型猎物被吃掉的感觉要高于性兴奋。他们是绝对服从的奴隶，将自己的一切献给被他们认可的食者朋友。";
            break;
        case 'SEPX-W':
            title2.innerText = '水果青瓜 - The Devotee';
            textareaheader.innerText = "“请肆意地使用我吧~”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你专注于满足食者，在她们需要的时候用“可食用性玩具”的身份取悦她们。\n' +
                '你愿意将自己彻底交给她们以此来满足自己的性欲，甚至包括被她们消化。\n' +
                '你就像是为她而生的水果青瓜，用途多样且清脆爽口，无论她打算怎样使用，彼此都能得到想要的满足。\n' +
                '你渴望与食者建立更加亲密的联系，因此能够品尝到你的基本是你的朋友，爱人或主人，而不是陌生人。\n' +
                '同时，你的情感特质也令你渴望被食者调情和赞美，并与她们建立更加长久的联系。\n';
            textarea4.innerText =
                'SEPX-W型猎物会在被支配时感到性愉悦，他们渴望情感上的互动，因此他们能够选择的食者数量不多，但关系却更为亲密。';
            break;

        /* 被迫猎物 DESCRIPTIONS */

        case 'IVAN-U':
            title2.innerText = '抵抗者 - The Challenger';
            textareaheader.innerText = "“我可不会在力竭之前轻易放弃！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你有着丰富的从食者嘴里逃离的经验，因为你从不屈服于成为食物的命运。\n" +
                "尽管许多食者们知道你不是那么容易被吃下的猎物，但她们仍然不打算就此放弃吞下你的想法。\n" +
                "也许，她们中的一部分个体认为能够消化如此强大的猎物是一种值得争取的挑战和成就？\n" +
                "你也无法理解那些想要成为某人食物的想法，因为你永远不会允许自己成为食物。\n" +
                "你会千方百计地从任何吃掉你的人的身体里逃离，哪怕这会对她们造成相当严重的伤害。\n";
            textarea4.innerText =
                "IVAN-U型猎物不会屈服于自己的命运和身份，当他们被卷入食者的嘴里，唯一的想法就是逃离这里并活下去。";
            break;
        case 'IVAX-U':
            title2.innerText = '回避者 - The Evasive';
            textareaheader.innerText = "“该死，我怎么可能会爱上这个？！快放我出去！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "或许你刚刚进行了顽强的抵抗，但现在你却发现自己的心脏开始以一种奇怪的频率跳动……\n" +
                "难道被她吞下引起了你的性欲？你会在被她消化时感到兴奋？打算就此放弃然后接受自己的命运？\n" +
                "当然不是！虽然你确实感到兴奋，但你绝不会承认这样的事情会引起你的快感。\n" +
                "不愧是你！你的身体仍然保持着挣扎和抵抗！对！没错！继续保持！\n" +
                "无论她的体内给你带来了怎样的刺激，都不能轻易沉沦进去啊！！！\n";
            textarea4.innerText =
                "IVAX-U型猎物潜在地将吞食与性欲联系在一起，会在被吞下之后感到兴奋，但是他们会回避这种刺激，继续抗争到底。\n";
            break;
        case 'IVPN-U':
            title2.innerText = '知命者 - The Fatalist';
            textareaheader.innerText = "“唉……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '刚才她的肚子上还不断撑起着一个个鼓包，但现在却已经归于平静了。\n' +
                '正被困在里面的你或许是打算放弃了，或许只是在养精蓄锐，保存体力。\n' +
                '你知道作为猎物，大概率是要被食者吃掉的，因此在命运真的降临时只会进行基本的抵抗。\n' +
                '你难以在胃壁中抵抗太久，尽管这会使某些期待食物挣扎的食者感到无聊，进而考虑放你一马……？\n' +
                '那么，你认为活下来的结局真的是你所期待的吗？还是说……\n';
            textarea4.innerText =
                'IVPN-U型猎物很容易放弃他们的抵抗，并在食者的腹中轻易接受他们的命运，他们的被动特质使得他们无法坚持退太久。';
            break;
        case 'IVPX-U':
            title2.innerText = '堕落者 - The Swayed';
            textareaheader.innerText = "“适应了以后，感觉好像还行……？”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "被吞下之前的你：“我就算是被捏死，死外边，从这跳下去，也绝不会屈服于你的肚子！”\n" +
                "被吞下之后的你：“斯哈斯哈！姐姐的体内好棒！”\n" +
                "你绝对是一个复杂的家伙，你知道被吞食这件事到底有多么的危险，食者的体内到底有多么恶心。\n" +
                "但如果你真的深陷其中，你就会很快屈服，一旦她们开始吞食你，你就会感到兴奋。\n" +
                "你彻底理解了被吃掉是一种多么令人难以抗拒的奇妙体验，而这份美妙的体验大抵胜过最初的不情愿。\n";
            textarea4.innerText =
                "IVPX-U型猎物在真的被吞下之前是发自真心的抵触，但在那之后也是发自真心的渴望；这种渴望更多地来自性与本能的欲望。";
            break;
        case 'IEAN-U':
            title2.innerText = '祈求者 - The Remorseful';
            textareaheader.innerText = "“求你了，我还有未尽之事……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "有时候你真的应该好好反思一下自己的行为，而不是真的等到来不及的时候才开始后悔。\n" +
                "因为你在被食者抓住之后就和开始后悔原来自己还有很多理想可以实现。\n" +
                "所以，你开始挣扎，开始反抗自己的命运，开始向往自由，开始劝说她们放过你。\n" +
                "你的情感特质是你优秀的武器，能够更加容易地对那些顾及猎物感受、拥有共情能力的食者造成影响。\n" +
                "她们或许真的会考虑放过你……但，这样的食者又能有多少呢？\n";
            textarea4.innerText =
                "IEAN-U型猎物可以通过自己的EA特质来劝说食者放过自己，但这份力量通常只对SE特质的食者有效。";
            break;
        case 'IEAX-U':
            title2.innerText = '立牌者 - The Squirmer';
            textareaheader.innerText = "“快、快放我出去！我不是食物！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "虽然你会尽量避免被吃掉的处境，但食者在你面前张开嘴时，你还是会忍不住多看一眼……\n" +
                "你会在食者的面前以及里面坚定地抵抗，声称自己不是食物，而这一切不过是为了掩盖你的兴奋和激动。\n" +
                "因为你知道这样通常都能勾起食者玩弄自己猎物的兴趣，进而将这种兴趣在你的身上付之行动……\n" +
                "是的，你的抵抗，挣扎和反对，其实本质上就是在说，“快，快欺负我！我真的很享受！”\n" +
                "只要她们开始嘲笑你的反抗，享受你的挣扎，描述你将来会加入的部位，你就能在她们的肚子里蠕动一整个夜晚。\n";
            textarea4.innerText =
                "IEAX-U型猎物通过坚决的挣扎和抗议来掩盖自己的兴奋，沉浸于被食者嘲弄的情感享受。";
            break;
        case 'IEPN-U':
            title2.innerText = '绝望者 - The Tragic';
            textareaheader.innerText = "“完蛋了，逃不掉了…”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "当你回过神来的时候，已经在她的喉咙里了。为什么你无法做出反抗？为什么她如此轻易就能将你吃下？\n" +
                "你通常只会做出最为简单的逃跑尝试，而她们只需要对着肚子轻轻一拍，就能让你立刻安静下来。\n" +
                "一旦你发现自己被她们盯上，你就会彻底放弃抵抗，屈服于成为食物的命运。\n" +
                "而如果当她将肚子里的你介绍给了你的朋友们，当你的朋友得知现在的你不过是她肚子里的食物……\n" +
                "这样的结果大概会让你觉得尴尬又羞耻。多少还会带点兴奋。\n";
            textarea4.innerText =
                "IEPN-U型猎物会轻易放弃抵抗，接受命运，他们更多地在乎别人发现自己成为食物后的反应，而不是自己是否会被消化。";
            break;
        case 'IEPX-U':
            title2.innerText = '徘徊者 - The Indecisive';
            textareaheader.innerText =
                "“嗯…这里其实还挺性感的……只要别让我呆上太久……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "在许多食者的眼里，你就是个主动型，即使满嘴你否认自己渴望被吃掉的事实。\n" +
                "所以哪怕你一直否认，一旦你真的进了她们的肚子，被肉壁束缚而产生的性刺激仍然会让你迅速闭嘴。\n" +
                "因此，当这一切真实发生之后，你会迅速感到兴奋，感到刺激，并将自己代入到“食物”的身份上。\n" +
                "然而一旦食者的身体开始消化你，或者被她们无限期地困在肚子里，你又会后悔自己沉浸过头，导致丢了性命。\n" +
                "毕竟你接受的只是肉壁和体内环境带给你的性刺激，而不是接受了成为食物的命运。";
            textarea4.innerText =
                "IEPX-U型猎物几乎将吞食和性行为重叠在一起，在消化液威胁到他们的生命之前，他们会享受这场另类的性爱。";
            break;
        case 'SVAN-U':
            title2.innerText = '患养者 - The Feeder';
            textareaheader.innerText =
                "“我带来了今天的猎物…你会继续和我交易的，对吧？哈哈……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "其他的猎物偶尔能看到你和一位食者同时出现，但你从未消失在他们活动的区域。\n" +
                "要问为什么的话，或许曾经被你投喂给她的张三李四王五可以回答这个问题……\n" +
                "你通过和她们建立连接或交易，成为她们的长期饭票，让她们相信你能带来更多食物的同时受她们保护。\n" +
                "你更像是她们的饲养员，你总是为她们提供新的猎物，以保证自己不会是她们的下一顿。\n" +
                "但你应该随时警惕她们肚子里的咕噜声，毕竟……很多食者并不擅长等待和忍耐。\n";
            textarea4.innerText =
                "SVAN-U型猎物与食者进行交易，用牺牲其他同类的方式换取自己的生存，如果这份交易突然失效，他们也会极力抵抗。";
            break;
        case 'SVAX-U':
            title2.innerText = '湿鞋者 - The Voyeur';
            textareaheader.innerText = "“很高兴里面的人是他而不是我……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                '你通常以旁观的视角欣赏和期待其他人被食者吞进的肚子，并从中获得兴奋和激动，但你又害怕成为她们食物。\n' +
                '享受吞食带来的性刺激，又不敢亲身经历，这正是你作为被迫型的典型表现。\n' +
                '你可能会偶尔将猎物同类喂进同伴的肚子里，会关注捕食相关的社交媒体内容，会在别人被吞下时驻足观看并获得快感……\n' +
                '你所做的一切会不断扩张你的欲望，让你越来越渴望主动经历，直到你越过了曾经树立警戒线。\n' +
                '直到这时，你的性欲望会反客为主，减少你对成为食物的恐惧，让你逐渐期待着，最终甚至可能会主动将自己喂进她们的肚子。\n';
            textarea4.innerText =
                'SVAX-U型猎物会从最初的害怕潜移默化地转化为最终的渴望经历被吞食的体验，最终将自己送入食者的嘴中。\n' +
                '从这方面来看，他们或许是潜在的自愿型猎物的替补。';
            break;
        case 'SVPN-U':
            title2.innerText = '屈服者 - The Gourmet';
            textareaheader.innerText =
                "“希望你至少会喜欢我的味道，即使这里的环境对我来说有些恶心。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你是真的不想被吃掉的，但如果真的被食者接近，你也会很快屈服并被她们肆意掌控，为所欲为。\n" +
                "但还有个前提，如果你必须要成为她们的食物，那至少应该是一顿难以忘怀的大餐，能够带给她们极致的体验。\n" +
                "尽管你大概不会承认，但你确实期待在她们的肚子里收到对你味道的赞美；\n" +
                "或者夸奖你为她们做出了多么杰出的贡献，期待你被吸收后后她们能获得怎样的提升。\n" +
                "这至少比成为一顿普通的果腹消耗品，被消耗后迅速被遗忘要好的多。\n";
            textarea4.innerText =
                "SVPN-U型猎物会很快屈服并希望成为一顿难忘的美味大餐，他们的感官特质注定了他们会对食者挑逗的言语产生反应。";
            break;
        case 'SVPX-U':
            title2.innerText = '沉溺者 - The Offering';
            textareaheader.innerText = "“嗯…既然事已至此，那就试着享受吧……”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你是真的不想被吃掉的，但如果真的被食者接近，你也会很快屈服并被她们肆意掌控，为所欲为。\n" +
                "你或许不会希望自己成为一顿美味大餐，但你肯定专注于在束缚着自己的胃内寻求身体上的快感。\n" +
                "你抵触成为食物的命运，但最终在她们的面前放弃，让自己完全处于被支配的状态下。\n" +
                "当你彻底被食者控制并支配时，你能获得额外的兴奋感；\n" +
                "因此当你已经深陷于她们的体内，那种被彻底支配的感觉也会令你沦陷在性与欲望的沼泽中难以自拔。\n";
            textarea4.innerText =
                "SVPX-U型猎物会很快屈服并沉浸于被食者支配所带来的强烈兴奋与快感中，并且通常只会在被吞下去之后开始放飞自我。";
            break;
        case 'SEAN-U':
            title2.innerText = '蒙羞者 - The Humiliated';
            textareaheader.innerText = "“快、快放开我！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "当你被食者吞食的时候你会发现，她们给你带来的最大的情感反馈竟然羞耻和屈辱。\n" +
                "至于胃壁给你带来的感受和体验，于你而言并不如食者的言语和感情上的体验重要。\n" +
                "你注重对方的感受，在乎对方的想法，这使得你极其容易被对方挑逗和嘲弄，从而生出屈辱情绪。\n" +
                "她们的嘲笑会让你更加坚定地想要脱离这尴尬的局面，更加卖力的逃跑和脱困；\n" +
                "而你所做的一切只是想要维护你那脆弱的自尊心，使其不会遭受到来自吃掉你的家伙言语上的伤害。";
            textarea4.innerText =
                "SEAN-U型猎物很容易遭受捉弄和羞辱，对言语表达更加敏感，嘲笑不会让他们兴奋或者放弃，只会令他们的自尊心受到伤害。";
            break;
        case 'SEAX-U':
            title2.innerText = '嫌正者 - The Closeted';
            textareaheader.innerText =
                "“我才没有脸红，只是太热了而已！”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "有个词语用来形容你是再合适不过了：“口嫌体正直”！\n" +
                "你注重对方的感受，在乎对方的想法，这使得你极其容易被对方挑逗和嘲弄，从而生出屈辱情绪。\n" +
                "你会在她们对你的戏弄中找到一些性刺激，但口嫌体正的你打死也不会承认你正沉浸于被她们吃掉的状态。\n" +
                "她们的嘲笑会让你更加尴尬，但也更加兴奋，所以，你通常能在她们的嘲笑声中更加卖力地蠕动；\n" +
                "然而你的挣扎和蠕动动不是因为你感受到了羞耻，而是你用来掩盖自己被食者支配时产生的快感。";
            textarea4.innerText =
                "SEAX-U型猎物很容易遭受捉弄和羞辱，但性刺激将这份屈辱转化为了快感，他们享受这份快感，但不愿承认自己沉溺其中。";
            break;
        case 'SEPN-U':
            title2.innerText = '纯良者 - The Trusting';
            textareaheader.innerText =
                "“呃…好吧，但是我想出去的时候你得立刻放了我，行吗？”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "总的来说，你是极不情愿成为某位食者的食物的。\n" +
                "但在被你信任的食者朋友的软磨硬泡、威逼利诱下，你还是会愿意短暂性地扮演她们的食物。\n" +
                "你注重连接对象的感受，所以她们总能很轻松地将你诱骗进她们的体内。\n" +
                "在多数情况下，你还是希望只是在短暂地扮演她们的食物，而不是莫名其妙真的成为了食物。\n" +
                "然而尽管如此，在她们的主导和强势下你往往会迅速陷入被动，变成自愿型的，她们真正的食物。";
            textarea4.innerText =
                "SEPN-U型猎物主观抗拒消化，试图掌控局面以保证自己的安全，但很容易陷入被动，进而转变为真正的食物。";
            break;
        case 'SEPX-U':
            title2.innerText = '服务者 - The Toy';
            textareaheader.innerText =
                "“你尽情地享受就好，不用在意我。”";
            textarea.innerHTML = typeDesc;
            textarea2.innerText =
                "你并不像你的食者那样享受吞食带来的一切，比如满足感什么的。\n" +
                "但你和你的食者亲密的关系使你通常可以克服这一点，以满足她们吃掉你的愿望。\n" +
                "但你也不会是彻底服务于她们的纯粹的工具，你本身也能从这个过程中获得快感。\n" +
                "你更注重情感和表达带来的快感，在和亲密对象的负距离接触中享受身体上的性愉悦。\n" +
                "你能够在被她们支配带来的臣服、羞耻、屈辱情感中找到性方面的刺激，虽然你并不会承认这是你喜欢的东西。";
            textarea4.innerText =
                "SEPX-U型猎物并不特别享受被吃掉的感觉，他们妥协于亲密关系带来的情感连接，在与亲密对象交互的过程中享受情性刺激。";
            break;
    }

    // Build the Traits Description


    let speciality = {
        I: {
            TITLE: "<b>自我 - Individual (I)</b>",
            HEAD: "自我特质影响着个体趋于自私自利，自我中心，这使得他们通常只考虑自己，而不会在意对方的感受。",
            PRED: "拥有自我特质的食者的行为主要以满足自身的欲望和需求为目的，不会耗费精力去刻意地满足猎物的期望。<br>" +
                "她们中的某些个体会放慢进食的节奏或者添加一些娱乐项目，但这一切的最终目的都是为了取悦她们自己。",
            WPREY: "拥有自我特质的自愿型猎物在被捕食的过程中，只关注于满足自己的欲望和需求，不太会考虑食者的欲望和感受。<br>" +
                "他们的行为主要以满足自己的需求和欲望为目标，而不会过多在意食者是否愿意接受他们这样的食物。",
            UPREY: "拥有自我特质的被迫型猎物在被捕食的过程中，只关注于满足自己的欲望和需求，不太会考虑食者的欲望和感受。<br>" +
                "他们不太关心食者的体验和需求，只会自顾自地逃跑，毕竟被迫型猎物主观上并不愿意被吞掉。"
        },
        S: {
            TITLE: "<b>共享 - Shared (S)</b>",
            HEAD: "共享特质令拥有它的个体懂得忧他人之忧，乐他人之乐，而不是一味地满足自己。",
            PRED: "拥有共享特质的食者会在吞食的过程中主动取悦自己的猎物。<br>" +
                "她们仍然会想办法让自己得到满足，但她们会首先尊重猎物的愿望。<br>" +
                "只有自己的猎物伴侣在自己这里获得了快乐，她们才会真正得到满足。<br>" +
                "并且，她们通常只会吃掉那些自愿成为食物的人。<br>" +
                "因为她们从不强硬地忽略食物的感受，只会请（you）求（huo）他们主动奉献自己。<br>" +
                "如果她们在迫不得已的情况下吃掉了强烈反抗的被迫猎物，那么她们多少都会难过一段时间。<br>",
            WPREY: "拥有共享特质的自愿型猎物会在被吞食的过程中主取悦自己的食者。<br>" +
                "他们仍然会想办法让自己得到满足，但他们会首先尊重食者的愿望。<br>" +
                "只有自己的食者伴侣在自己这里获得了快乐，他们才会真正得到满足。<br>" +
                "因此，他们在许多时候都扮演着牺牲者、奉献者一类的角色，将自己的身心都献给吞下他们的人。<br>",
            UPREY: "拥有共享特质的被迫型猎物通常会以一种相对不情愿的态度来应对他们的食者。<br>" +
                "这通常表现为一种迟疑：他们不太愿意，但也不太反对。<br>" +
                "他们可能会因为不愿给食者造成伤害，进而将对死亡的恐惧转化为对奉献的认可。<br>" +
                "因此他们可能并不希望成为食物，但当他们真的被吃下去之后，他们也会很快选择顺从。<br>"
        },
        V: {
            TITLE: "<b>本能 - Visceral (V)</b>",
            HEAD: "本能特质影响个体的行为趋于本能与合理性，这种影响往往表现在生理的层面上。",
            PRED: "拥有本能特质的食者的捕食行为受到原始的饥饿感或者来自身体本能的欲望驱使。<br>" +
                "她们吞食的动力源自于生理的需要，或者对吞食行为本身的渴望。<br>" +
                "至于那些所谓的和猎物的关系，吞食的意义，于她们而言根本无关紧要。<br>",
            WPREY: "拥有本能特质的自愿型猎物渴望被吞食的理由通常是因为他们能在这个过程中感到愉悦。<br>" +
                "他们在生理上享受这一经历，而不是因为食者的体内能带给他们情绪上的慰藉。",
            UPREY: "拥有本能特质的被迫型猎物通常是出于活下去的本能而趋于逃避；<br>" +
                "或者是因为被困在食者体内所造成的不适和痛苦驱使他们奋力反抗。<br>"
        },
        E: {
            TITLE: "<b>情感 - Emotional (E)</b>",
            HEAD: '情感特质带来的影响趋于表现在心理的层面，这使得拥有它的个体更多地关注整个吞食过程背后的深层含义。<br><br>',
            PRED: "拥有情感特质的食者享受与猎物之间的关系，可能是一种情感的表达，也可能是一种支配的表现；<br>" +
                "或者是因为她们享受把另一个生物保留在自己的体内甚至将他们转化为身体的一部分所带来的心态上的变化。<br>" +
                "她们同时也享受食物在体内祈求或挣扎所带来的情感上的冲击。<br>",
            WPREY: "拥有情感特质的自愿型猎物享受着与食者之间的关系，可能是一种情感的表达，也可能是一种被支配的表现；<br>" +
                "或者是因为他们享受被另一个生物吞下后从个体到食物的身份上的变化，甚至是期待着被食者消化后成为她们身体的一部分所带来的心态上的变化。<br>" +
                "他们同时也享受被食者挑逗、玩弄时带来的情感上的冲击。<br>",
            UPREY: "拥有情感特质的被迫型猎物更希望自己能够顺利逃脱，因为他们对被食者以这种方式征服所带来的影响尤为看重。<br>" +
                "不是因为他们生理上对被吞食这件事感到恐惧，而是因为被吞食后，他们再也无法继续自己的生活，甚至会因此失去生命。<br>"
        },
        A: {
            TITLE: "<b>主动 - Active (A)</b>",
            HEAD: "主动特质驱使着个体下意识地推动诉求的发生，通过付出看得见的努力去达成自己的目的。",
            PRED: "拥有主动特质的食者的行动机制很简单，她们通常主动狩猎自己的猎物，主动创造能够吞下猎物的机会。<br>" +
                "被她们抓住的猎物可能会被她们毫不犹豫地物吞下，直奔主题向来是主动特质的一大表现。<br>" +
                "如果遭受到猎物的反抗也无所谓，她们不会介意使用一些强制的手段让这些反抗无效化。<br>",
            WPREY: "拥有主动特质的自愿型猎物的行动机制很简单：<br>" +
                "他们通常主动靠近食者，将自己暴露在危险中，或者以摆烂的姿态面对成为食物的命运。<br>" +
                "他们会主动渴求成为食者的食物，甚至主动钻进她们的肚子里。<br>" +
                "这样的主动性有时甚至会让一些资深食者感到迷茫……到底谁才是猎物？<br>",
            UPREY: "拥有主动特质的被迫型猎物的行动机制很简单：<br>" +
                "他们通常主动远离危险，想方设法使自己安全，即使被食者盯上，他们也会奋力反抗。<br>" +
                "他们绝不妥协自己的命运，在食者的股掌之间拉扯，不放过任何逃跑的机会。<br>" +
                "即使最终被吞入腹中，他们也会竭尽全力地抵抗胃壁的挤压。<br>"
        },
        P: {
            TITLE: "<b>被动 - Passive (P)</b>",
            HEAD: "被动特质影响个体的行为趋于消极，他们从不主动去创造和推动对自己有利的处境。",
            PRED: "拥有被动特质的食者倾向于等待猎物成为她们的食物，而不是主动出击，狩猎自己的目标。<br>" +
                "如果出现了令她们食欲大动的猎物，她们大概率仍然保持被动等待。<br>" +
                "她们也会通过观察、了解自己的猎物，制定一个完美的计划令自己的猎物主动奉献自己。<br>" +
                "她们通常不会轻易承认或者暴露自己的食者身份，即使猎物就在身边也能控制住疯狂分泌的唾液。<br>" +
                "当然，这种状态通常都是脆弱的，诱惑过大她们就会很快屈服。<br>",
            WPREY: "拥有被动特质的自愿型猎物不会刻意去寻找食者，也不会刻意躲着她们。<br>" +
                "但是，一旦他们被抓住，通常就会因为各种心理因素而快速屈服自己的命运。<br>" +
                "比如服从的性格、绝望无助的心理状态或者被吞食带给他们的性刺激。<br>" +
                "一旦他们接受了自己的处境，就会更积极地服从吞下他们的人，接受她们的肆意支配。<br>" +
                "他们甚至会在特定情况下改变对自己的认知，接受自己作为食物的命运，甚至承认是“玩具“的身份。",
            UPREY: "拥有被动特质的被迫型猎物通常会是一个失败主义者。<br>" +
                "虽然他们抗拒成为食物，但却不会积极争取自己的命运，而是随遇而安，躺平摆烂。<br>" +
                "并且，一旦被抓住，他们通常都会由于绝望的情绪而迅速放弃抵抗。<br>" +
                "对于他们来说，在绝对的力量面前，抵抗和挣扎是没有意义的。"
        },
        X: {
            TITLE: "<b>性欲 - SeXual (X)</b>",
            HEAD: "性欲特质将吞食与性欲绑定到了一起，吞食的行为会为他们带来相对的性刺激。",
            PRED: "拥有性欲特质的食者认为吞食猎物是一种诱惑，充满了情欲。<br>" +
                "她们通常难以抗拒吞下猎物的行为带来的身体上的冲击和兴奋。<br>" +
                "与其说吞食猎物是某种爱好或者娱乐，她们更倾向于将吞食猎物理解为性欲的延伸，并加以享受。<br>",
            WPREY: "拥有性欲特质的自愿型猎物认为被吞食是一种诱惑，充满了情欲。<br>" +
                "他们通常难以抗拒被食者吞下时带来的身体上的冲击和兴奋。<br>" +
                "与其说被她们吞食是某种爱好或者娱乐，他们更倾向于将被吞食理解为性欲的延伸，并加以享受。<br>",
            UPREY: "拥有性欲特质的被迫型猎物认为被吞食是一种诱惑，带着情欲的成份。<br>" +
                "他们通常难以抗拒被食者吞下时附带的身体上的冲击和兴奋，哪怕他们抗拒被吞掉这件事本身。<br>" +
                "即便如此，一旦他们被纳入某位食者的体内，他们仍然可以很快感觉到这份欲望并加以享受。<br>"
        },
        N: {
            TITLE: "<b>感官 - SeNsual (N)</b>",
            HEAD: "感官特质能够摒弃身体欲望的影响，给个体带来纯粹的精神上的快乐和想法上的满足。",
            PRED: "拥有感官特质的食者吞食猎物的行为可以具有各种各样的动机，这取决于她们的其他特质带来的影响。<br>" +
                "一般来说，她们吞食是为了果腹、获得满足感、和食物增进关系或单纯的娱乐行为，而不是出于性体验。<br>" +
                "不过这并不意味着感官特质的食者不能偶尔体验一下吞食给她们的身体带来的性冲击和兴奋。<br>",
            WPREY: "拥有感官特质的自愿型猎物更注重于被吞食这件事带给自己的精神方面的体验而不是肉体的欲望。<br>" +
                "他们并不在乎甚至感受不到被吞食带来的身体方面的欲望，而是专注于感受自己心中的渴望被实现所带来的满足感。",
            UPREY: "拥有感官特质的被迫型猎物，或许应该称你为局外人？<br>" +
                "意外被卷入吞食场景的他们中，有一部分似乎在潜意识里对吞食有着微妙的见解。<br>" +
                "感官特质的被迫型猎物难以从被吞食里感受到到来自身体的欲望；<br>" +
                "而是更在乎这件事会给自己带来怎样的精神和心理方面的影响。<br>" +
                "这种情况一旦遇上被迫特质，就会使得他们更像是一个无辜的受害者；<br>" +
                "因为只有在共享特质的影响下，他们才能勉强在这场进食行为中获得一些精神方面的享受。"
        }
    }

    let my_speciality = [];
    if (I >= S) my_speciality.push("I");
    else my_speciality.push("S");
    if (V >= E) my_speciality.push("V");
    else my_speciality.push("E");
    if (A >= P) my_speciality.push("A");
    else my_speciality.push("P");
    if (X >= N) my_speciality.push("X");
    else my_speciality.push("N");


    function getDesc(my_type, tags = ["TITLE", "HEAD", "PRED", "UPREY", "WPREY"], output = ["I", "S", "V", "E", "A", "P", "X", "N"]) {
        let desc = '';
        my_speciality.forEach(function (type) {
            if (output.indexOf(type) !== -1) {
                tags.forEach(function (key) {
                    desc += `<div class='result-desc-${key}'>${speciality[type][key]}</div>`;
                })
            }
        })
        return desc;
    }

    textarea3.innerHTML = getDesc(my_speciality, ["TITLE", "HEAD"]);

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


    const theme = {
        PRED: 'rgb(224, 172, 95)',
        WPREY: 'rgb(137, 226, 144)',
        UPREY: 'rgb(230, 169, 255)',
    }

    const tezhi_bg_color = {
        S: "#FFAE57",
        I: "#FF7853",
        V: "#EA5151",
        E: "#CC3F57",
        A: "#9A2555",
        P: "#d5769b",
        X: "#ff7589",
        N: "#ff8c15",
    }
    const tezhi_font_color = {
        S: "#a079f5",
        I: "#7281d0",
        V: "#66abc7",
        E: "#209f6a",
        A: "#3fd7b5",
        P: "#68aef3",
        X: "#67ee9d",
        N: "#fff",
    }
    const tezhi_name = {
        I: "自我 [I]",
        S: "共享 [S]",
        V: "本能 [V]",
        E: "情感 [E]",
        A: "主动 [A]",
        P: "被动 [P]",
        X: "性欲 [X]",
        N: "感官 [N]",
    }
    var theme_color = theme[testType];
    const child_last = function (name, value) {
        return {
            name: value,
            itemStyle: {
                color: "#444",// 最外层背景色
            },
            label: {
                formatter: "{c}%",
                opacity: 1,
                color: "#6cf",// 最外层背景色
            },
            nodeClick: false,
            children: [
                {
                    name: tezhi_name[name],
                    itemStyle: {
                        color: tezhi_bg_color[name],// 最外层背景色
                    },
                    label: {
                        opacity: 1,
                        color: tezhi_font_color[name],// 文字色
                    },
                    value: value,
                    nodeClick: false,
                }
            ]
        };
    }
    const bgColor = '#444';
    const data = [
        {
            name: "特质",
            itemStyle: {
                color: theme_color,
            },
            label: {
                color: bgColor,
            },
            children: [
                {
                    name: '体验',
                    itemStyle: {
                        color: "#bb2929"
                    },
                    children: [
                        child_last("E", Math.round(ePerc)),
                        child_last("V", Math.round(vPerc)),
                    ]
                },
                {
                    name: '感受',
                    itemStyle: {
                        color: "#e67198"
                    },
                    children: [
                        child_last("X", Math.round(xPerc)),
                        child_last("N", Math.round(nPerc)),
                    ]
                },
                {
                    name: '行为',
                    itemStyle: {
                        color: "#1aa0c4"
                    },
                    children: [
                        child_last("A", Math.round(aPerc)),
                        child_last("P", Math.round(pPerc)),
                    ]
                },
                {
                    name: '态度',
                    itemStyle: {
                        color: "#c6be4a"
                    },
                    children: [
                        child_last("S", Math.round(sPerc)),
                        child_last("I", Math.round(iPerc)),
                    ]
                },
            ]
        }
    ];
    let option = {
        backgroundColor: bgColor,
        color: theme_color,
        series: [
            {
                type: 'sunburst',
                center: ['50%', '50%'],
                data: data,
                sort: function (a, b) {
                    if (a.depth === 1) {
                        return b.getValue() - a.getValue();
                    } else {
                        return a.dataIndex - b.dataIndex;
                    }
                },
                label: {
                    rotate: '',
                    color: bgColor
                },
                itemStyle: {
                    borderColor: bgColor,
                    borderWidth: 2
                },
                levels: [
                    {},
                    {
                        r0: 0,
                        r: 23,
                        label: {
                            rotate: 0
                        }
                    },
                    {
                        r0: 23,
                        r: 60
                    },
                    {
                        r0: 65,
                        r: 80,
                        itemStyle: {
                            shadowBlur: 2,
                            shadowColor: "#FF7853",
                            color: 'transparent'
                        },
                        label: {
                            rotate: 'tangential',
                            fontSize: 10,
                        }
                    },
                    {
                        r0: 80,
                        r: 85,
                        itemStyle: {
                            shadowBlur: 50,
                            shadowColor: theme_color
                        },
                        label: {
                            rotate: 'radial',
                            fontSize: 12,
                            position: 'outside',
                        },
                        downplay: {
                            label: {
                                opacity: 0.7
                            }
                        }
                    }
                ]
            }
        ]
    };


    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    option && myChart.setOption(option);
    myChart.on('click', function (e) {
        let output = [];
        let tags = ["TITLE", "HEAD",];
        switch (e.name) {
            case "态度":
                tags.push(testType);
                output = ["I", "S"];
                break;
            case "体验":
                tags.push(testType);
                output = ["V", "E"];
                break;
            case "行为":
                tags.push(testType)
                output = ["A", "P"];
                break;
            case "感受":
                tags.push(testType)
                output = ["X", "N"];
                break;
            case "特质":// main
                output = ["I", "S", "V", "E", "A", "P", "X", "N"];
                break;
            case "":// 返回
                output = ["I", "S", "V", "E", "A", "P", "X", "N"];
                break;
            default:
                if (e.dataIndex === 0 && typeof e.main == 'undefined') {
                    output = ["I", "S", "V", "E", "A", "P", "X", "N"];
                }
                return;
        }
        textarea3.innerHTML = getDesc(my_speciality, tags, output);
    })
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
