var svgObj = document.getElementById("svgObj");
var zoom = document.getElementById("zoom");
var viewer = document.getElementById("viewer");
var zoomLabel = document.getElementById("zoomLabel");
var gr2, gr3;

var calculateOpacity = function(zoomVal, showVal){
    var result = (zoomVal -  showVal) / 40;
    if(result < 0)
        return 0;

    if(result > 1)
        return 1;

    return result;
}
var updateCSVLayers = function (zoomVal) {

    svgObj.style.transform = "scale(" + zoomVal / 100 + ")";
    zoomLabel.textContent = Math.round(zoomVal) + "%";

    gr3.style.opacity = calculateOpacity(zoomVal, 120);
}

svgObj.addEventListener("load", function () {

    var svgDoc = svgObj.contentDocument;
    gr3 = svgDoc.getElementById("layer3");

    gr3.style.opacity = 0;
    svgObj.style.transform = "scale(1)";

    var svg = svgDoc.getElementById("svg2");
    svg.style.cursor = "move";

    viewer.addEventListener('mousedown', start_drag);
    viewer.addEventListener('mousemove', while_drag);
    viewer.addEventListener('mouseup', stop_drag);
    svgDoc.addEventListener('mousedown', start_drag);
    svgDoc.addEventListener('mousemove', while_drag);
    svgDoc.addEventListener('mouseup', stop_drag);

}, false);


zoom.addEventListener("input", function (e) {
    updateCSVLayers(e.currentTarget.valueAsNumber);
}, false);


var drugStartPoint;
function start_drag(e) {
    drugStartPoint = {};
    drugStartPoint.x = e.clientX;
    drugStartPoint.y = e.clientY;
}

function while_drag(e) {

    if (drugStartPoint) {

        if (Math.abs(e.clientX - drugStartPoint.x) > 0.6)
         viewer.scrollLeft += e.clientX - drugStartPoint.x < 0 ? -2 : 2;
        if (Math.abs(e.clientY - drugStartPoint.y) > 0.6)
         viewer.scrollTop += e.clientY - drugStartPoint.y < 0 ? -2: 2;

        console.log(e.clientY - drugStartPoint.y);

        drugStartPoint.x = e.clientX;
        drugStartPoint.y = e.clientY;
    }
}