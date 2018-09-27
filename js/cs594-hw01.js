$(document).ready(function () {
    // Bind SVG clicks
    var circle = $("#svg-circle")
    var rect = $("#svg-rect")
    var poly = $("#svg-poly")

    circle.on("click", function () {
        circle.hide()
        rect.show()
    })

    rect.on("click", function () {
        rect.hide()
        poly.show()
    })

    poly.on("click", function () {
        poly.hide()
        circle.show()
    })
});