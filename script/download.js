function downloadAsPicture(imgName) {
    var getPixelRatio = function (context) { // 获取设备的PixelRatio
        var backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 0.5;
        return (window.devicePixelRatio || 0.5) / backingStore;
    };
    //生成的图片名称
    imgName += ".jpg";
    var shareContent = document.getElementById("results-show");
    let descResult = $("#results-scores");
    let descBigScreenResult = $("#results-desc-score-text");
    descResult.css('overflow-y', 'none');
    descResult.css('height', 'auto');
    descBigScreenResult.css('overflow-y', 'none');
    descBigScreenResult.css('height', 'auto');
    var width = shareContent.offsetWidth;
    var height = shareContent.offsetHeight;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    var scale = getPixelRatio(context); //将canvas的容器扩大PixelRatio倍，再将画布缩放，将图像放大PixelRatio倍。
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.width + 'px';
    context.scale(1, 1);

    var opts = {
        scale: scale, canvas: canvas, width: width, height: height, dpi: window.devicePixelRatio
    };
    html2canvas(shareContent, opts).then(function (canvas) {
        context.imageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        var dataUrl = canvas.toDataURL('image/jpeg', 1.0);
        dataURIToBlob(imgName, dataUrl, callback);
    });
    descResult.attr('style', '');
    descBigScreenResult.attr('style', '');
}

// edited from https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill
var dataURIToBlob = function (imgName, dataURI, callback) {
    var binStr = atob(dataURI.split(',')[1]), len = binStr.length, arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }

    callback(imgName, new Blob([arr]));
}

var callback = function (imgName, blob) {
    var triggerDownload = $("<a>").attr("href", URL.createObjectURL(blob)).attr("download", imgName).appendTo("body").on("click", function () {
        if (navigator.msSaveBlob) {
            return navigator.msSaveBlob(blob, imgName);
        }
    });
    triggerDownload[0].click();
    triggerDownload.remove();
};
