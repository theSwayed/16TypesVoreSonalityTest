//=======================
//Variable Initialization
//Self explainatory...
//====================

// Keeps track of test progression
// 0 = menu, 1 = in test, 2 = end of test
let testState = 0;
// UI Elements
const uiElements = {
    pickButton: $("#pick-button"),
    stronglyAgreeBtn: $('#stragr-button'),   // Strongly Agree
    agreeBtn: $('#agr-button'),              // Agree
    neutralBtn: $('#na-button'),             // Neutral
    disagreeBtn: $('#dis-button'),           // Disagree
    stronglyDisagreeBtn: $('#strdis-button'),// Strongly Disagree
    title: $('#title'),
    title2: $('#results-desc-header-title'),
    textarea: $('#results-desc-header-type-desc'),
    textareaHeader: $('#results-desc-header-quote'),
    desc: $('#results-desc-text'),
    speciality: $('#results-desc-speciality-text'),
    summarize: $('#results-summarize-text'),
    backBtn: $('#back-button'),
    resetBtn: $('#reset-button'),
    body: $('body'),
    progressbarFill: $('#progress-bar-full'),
    resetBtn2: $('#reset-button-2'),
    shareLink: $('#results-share'),
    questionHeader: $('#question-header'),
    questionText: $('#question-text')
};

// Scores
let scores = {
    I: 0,
    S: 0,
    V: 0,
    E: 0,
    A: 0,
    P: 0,
    X: 0,
    N: 0
};

//TestLogic

let testType = '',
    type = '',
    questionNo = 0,
    questions,
    scoreHist = [];

let typeDesc = '';
let transTypeDesc = '';
let questionType = '';


//=====================
//Event Listener Adding
//Area for adding event listeners
//===============================

//Test Type Buttons
uiElements.pickButton.on('click', 'button', function () {
    testType = $(this).data('slug');

    // 获取背景色值
    changeTheme($(this).css('background-color'))
    startTest();
});

//Test Answers
uiElements.stronglyAgreeBtn.on('click', function () {
    onAnswer(4);
});
uiElements.agreeBtn.on('click', function () {
    onAnswer(3);
});
uiElements.neutralBtn.on('click', function () {
    onAnswer(2);
});
uiElements.disagreeBtn.on('click', function () {
    onAnswer(1);
});
uiElements.stronglyDisagreeBtn.on('click', function () {
    onAnswer(0);
});

//Back Button
uiElements.backBtn.on('click', function () {
    if (questionNo > 0) {
        prevQuestion();
    }
});

//Reset Buttons
uiElements.resetBtn.on('click', function () {
    if (confirm("确定要离开此页面吗？将回到首页并重置已做的所有试题！")) {
        resetTest();
        resetScores();
        window.location.hash = '#';
    }
});
uiElements.resetBtn2.on('click', function () {
    if (confirm("确定要离开此页面吗？测试结果将会被重置！")) {
        resetTest();
        resetScores();
        window.location.hash = '#';
    }
});

//Share Button
uiElements.shareLink.on('click', function () {
    sentToClipboard()
});

//======================
//Data Loading Functions
//Functions that deal with external data
//======================================

//Used to load a JSON File
function getJsonData(file, callback) {
    $.get(file, "json").then((data) => {
        callback(data);
    });
}

//Desc: (Currently) copies page url to user's clipboard (with warning).
function sentToClipboard() {
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
    (scores.I = 0), (scores.S = 0), (scores.V = 0), (scores.E = 0), (scores.A = 0), (scores.P = 0), (scores.X = 0), (scores.N = 0);
    type = '';
    questionNo = 0;
}

//========================
//辅助测试函数
//处理其他测试功能的函数（主要是图形，有时是数据）
//==============================================================================

// 描述: 开始实际测试
// 参数: (str) questionData - 要加载的问题数据JSON的相对位置
function startTest() {

    //Set vars
    resetScores();
    testState = 1;
    questionNo = 0;

    //Attempt to load questions
    getJsonData("data/question/" + testType + ".json", (text) => {
        questions = text;
        nextQuestion();
    });

    //UI update
    //console.log(questions); for debug
    uiElements.progressbarFill.css('width', 0); //Set bar (back) to 0
    uiElements.backBtn.attr('disabled', ''); //Disable back button
    hideMenu('main-menu'); //Hide main menu
    showMenu('test-menu'); //Show test menu
}

//Checks which score to change
function typeCheck(type, value) {
    scores[type] += value;
}

//Desc: When an answer is given...
//Args: (int) index - current question number
function onAnswer(index) {
    //Get current score to history
    scoreHist.push([scores.I, scores.S, scores.V, scores.E, scores.A, scores.P, scores.X, scores.N]);

    //Calc new score
    let answer = questions[questionNo].answers[index];
    if (answer.type != null && answer.value != null) {
        typeCheck(answer.type, answer.value);
    }
    questionNo++;
    if (checkFinal()) return;
    //load next question
    nextQuestion();
}

//Desc: Displays next question and sets it's type
function nextQuestion() {
    //console.log("I=" + I + ",S=" + S + "V=" + V + ",E=" + E + ",A=" + A + ",P=" + P + ",X=" + X + ",N=" + N)
    //console.log(scoreHist)
    setQuestionType();

    //Enable back button
    if (questionNo > 0) uiElements.backBtn.removeAttr('disabled');
}

//描述: 显示上一个问题并设置其类型
function prevQuestion() {

    //console.log("I=" + I + ",S=" + S + "V=" + V + ",E=" + E + ",A=" + A + ",P=" + P + ",X=" + X + ",N=" + N)
    //Decrement question number
    questionNo--;
    //Sets last score
    let lastScores = scoreHist.pop();
    scores.I = lastScores[0]
    scores.S = lastScores[1]
    scores.V = lastScores[2]
    scores.E = lastScores[3]
    scores.A = lastScores[4]
    scores.P = lastScores[5]
    scores.X = lastScores[6]
    scores.N = lastScores[7]
    //Sets question type
    setQuestionType();
    if (questionNo === 0) uiElements.backBtn.removeAttr('disabled');
}

function setQuestionType() {
    if (questionNo >= 0 && questionNo <= 4) {
        questionType = 'I';
    } else if (questionNo >= 5 && questionNo <= 9) questionType = 'S';
    else if (questionNo >= 10 && questionNo <= 14) questionType = 'V';
    else if (questionNo >= 15 && questionNo <= 19) questionType = 'E';
    else if (questionNo >= 20 && questionNo <= 24) questionType = 'A';
    else if (questionNo >= 25 && questionNo <= 29) questionType = 'P';
    else if (questionNo >= 30 && questionNo <= 34) questionType = 'X';
    else if (questionNo >= 35 && questionNo <= 39) questionType = 'N';
    //Update progress bar
    uiElements.progressbarFill.css('width', `${((questionNo + 1) / questions.length) * 100}%`)
    uiElements.questionHeader.text('阐述 ' + (questionNo + 1) + '/' + questions.length);
    uiElements.questionText.text(questions[questionNo].question);
}

//Desc: 检查是否是最后一题
function checkFinal() {
    if (questionNo >= questions.length) {
        finalResult();
        window.location.hash = `#${type}/${scores.I}-${scores.S}-${scores.V}-${scores.E}-${scores.A}-${scores.P}-${scores.X}-${scores.N}`;
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
    window.location.hash = `#`;
}

// 描述: 显示给定菜单
// 参数: (str) menu - 菜单的ID
function showMenu(menu) {
    let element = $("#" + menu);
    switch (menu) {
        case "results-menu":
            element.css('display', "flex");
            break;
        default: //usual case
            element.css('display', "inline");
            break;
    }
}

// 描述: 隐藏给定菜单
// 参数: (str) menu - 菜单的ID
function hideMenu(menu) {
    $("#" + menu).css('display', "none");
}

// 描述: 更改主题颜色
// 参数: (str) color - CSS值（包括 'var()'）
function changeTheme(color) {
    $(':root').get(0).style.setProperty('--currentTheme', color);
}

//=====================
//Functions To Sort Out
//=====================
let typeMap = [];

function finalResult() {
    typeDesc = '';
    type = '';
    transTypeDesc = '';
    typeMap = [];

    typeMap.push(scores.I >= scores.S ? "I" : "S")
    typeMap.push(scores.V >= scores.E ? "V" : "E")
    typeMap.push(scores.A >= scores.P ? "A" : "P")
    typeMap.push(scores.X >= scores.N ? "X" : "N")
    console.log("scores", scores)
    console.log("typeMap", typeMap)
    type = typeMap.join('');
    console.log("type2", type)
    let transMap = [];
    let keyMap = [];
    $.each(typeMap, function (index, value) {
        transMap.push(speciality[value].name);
        keyMap.push(speciality[value].key);
    });
    transTypeDesc = transMap.join(' / ');
    typeDesc = keyMap.join(' / ');
    type = type + '-' + getData(testType, 'mark');
    console.log("type3", type)

    // 设置结果头部的测试类型输出
    $('#results-desc-header-type').text(type);

    hideMenu('test-menu');
    showMenu('results-menu');
}

function getDesc(my_type, tags = [], output = ["I", "S", "V", "E", "A", "P", "X", "N"]) {
    let desc = '';
    typeMap.forEach(function (type) {
        if (output.indexOf(type) !== -1) {
            tags.forEach(function (key) {
                let tmp = "";
                if (key === 'name')
                    tmp = `<b>${speciality[type][key]} - ${speciality[type].key}</b>`;
                else if (Object.values(statements).indexOf(key) !== -1)
                    tmp = speciality[type][key].join("<br>")
                else
                    tmp = speciality[type][key];
                desc += `<div class='result-desc-${key}'>${tmp}</div>`;
            })
        }
    })
    return desc;
}

// Initialisation
const hashRegex = /^#([IS][VE][AP][XN])-([A-Z]+)(?:\/(\d{1,3}(?:-(\d{1,3})){7}))?$/i;

function processHash() {
    console.log("识别hash", window.location.hash)
    if (window.location.hash == '' || window.location.hash == '#') {
        resetTest();
        resetScores();
        hideMenu('results-menu');
    } else {
        const m = hashRegex.exec(window.location.hash);
        if (m !== null) {
            const mark = (m[2] ?? '').toUpperCase();
            const load = getData(mark);
            testType = load.slug;
            console.log("重置testType", testType)
            changeTheme(load.bgColor);
            if (m[3]) {
                const tokens = m[3].split('-');
                console.log('识别分数', tokens)
                scores.I = parseInt(tokens[0]);
                scores.S = parseInt(tokens[1]);
                scores.V = parseInt(tokens[2]);
                scores.E = parseInt(tokens[3]);
                scores.A = parseInt(tokens[4]);
                scores.P = parseInt(tokens[5]);
                scores.X = parseInt(tokens[6]);
                scores.N = parseInt(tokens[7]);
            } else {
                const type = m[1].toUpperCase();
                console.log('初始化分数', type)
                if (type[0] == 'I') scores.I = 30; else scores.S = 30;
                if (type[1] == 'V') scores.V = 30; else scores.E = 30;
                if (type[2] == 'A') scores.A = 30; else scores.P = 30;
                if (type[3] == 'X') scores.X = 30; else scores.N = 30;
            }
            hideMenu('main-menu');
            if (!type)
                finalResult();
            // 编辑描述
            descriptions();
        }
    }
}

function getData(mark, key = null) {
    let data = JSON.parse(localStorage.getItem(mark));
    return key ? data[key] : data;
}

$(window).on('hashchange', processHash);
processHash();


function descriptions() {
    typeDesc = "<br>" + transTypeDesc;
    getJsonData('data/result/' + testType + '.json', (data) => {
        let special = data[type];
        uiElements.title2.text(special.name);
        uiElements.textarea.html(typeDesc)
        uiElements.textareaHeader.text(special.sub);
        uiElements.desc.html(special.desc.join("<br>"));
        uiElements.summarize.text(special.summarize)
    })

    uiElements.speciality.html(getDesc(typeMap, ["name", "desc"]));

    // PERCENTAGE CALCULATOR

    // Hard code max values for all (30) strdis+stragr

    let isTotal = 30;
    let veTotal = 30;
    let apTotal = 30;
    let xnTotal = 30;

    let iPerc = (scores.I / isTotal) * 100;
    let sPerc = (scores.S / isTotal) * 100;
    let vPerc = (scores.V / veTotal) * 100;
    let ePerc = (scores.E / veTotal) * 100;
    let aPerc = (scores.A / apTotal) * 100;
    let pPerc = (scores.P / apTotal) * 100;
    let xPerc = (scores.X / xnTotal) * 100;
    let nPerc = (scores.N / xnTotal) * 100;


    const special_bg_color = {
        S: "#FFAE57",
        I: "#FF7853",
        V: "#EA5151",
        E: "#CC3F57",
        A: "#9A2555",
        P: "#d5769b",
        X: "#ff7589",
        N: "#ff8c15",
    }
    const special_font_color = {
        S: "#a079f5",
        I: "#7281d0",
        V: "#66abc7",
        E: "#209f6a",
        A: "#3fd7b5",
        P: "#68aef3",
        X: "#67ee9d",
        N: "#fff",
    }
    const special_name = {
        I: "自我 [I]",
        S: "共享 [S]",
        V: "本能 [V]",
        E: "情感 [E]",
        A: "主动 [A]",
        P: "被动 [P]",
        X: "性欲 [X]",
        N: "感官 [N]",
    }
    let theme_color = theme[testType];
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
                    name: special_name[name],
                    itemStyle: {
                        color: special_bg_color[name],// 最外层背景色
                    },
                    label: {
                        opacity: 1,
                        color: special_font_color[name],// 文字色
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
        let tags = ["name", "desc",];
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
            case "特质":
                output = ["I", "S", "V", "E", "A", "P", "X", "N"];
                break;
            default:
                if (e.dataIndex === 0 && typeof e.main == 'undefined') {
                    output = ["I", "S", "V", "E", "A", "P", "X", "N"];
                } else {
                    output = null;
                }
                break;
        }
        if (output)
            uiElements.speciality.html(getDesc(testType, tags, output));
    })
}
