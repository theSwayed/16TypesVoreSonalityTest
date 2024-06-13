let speciality = {};
let statements = {};
let theme = {};
$("document").ready(function () {
    $.get('data/main/index.json').then(function (data) {
        $.each(data, (k, v) => {
            $("#pick-button").append(`<button style="background-color: ${v.bgColor}" data-slug="${v.slug}">${v.name}</button>`)
            localStorage.setItem(v.mark, JSON.stringify(v))
            localStorage.setItem(v.slug, JSON.stringify(v))
            statements[v.mark] = v.slug;
            theme[v.slug] = v.bgColor;
        })
        loadAPP();
    }, function (data, err, err1) {
        console.log(data, err, err1)
        alert("数据库加载失败，请检查浏览器或网络环境");
    })
});

//载入程序
function loadAPP() {
    $.get('data/speciality/data.json').then(function (data) {
        speciality = data;
        $.getScript('script/script.js');
    }, function (data, err, err1) {
        console.log(data, err, err1)
        alert("数据库加载失败，请检查浏览器或网络环境");
    })
}
