(function ($) {
  /*------------------
        Preloader
    --------------------*/
  $(window).on("load", function () {
    $(".loader").fadeOut();
    $("#preloader").delay(200).fadeOut("slow");
  });
})(jQuery);

// Phần hover vào ảnh
var eles = document.querySelectorAll("a[data-title], li[data-title]");
var tooltip = document.querySelector(".tooltip");
eles.forEach((item, index) => {
  item.addEventListener("mousemove", function (e) {
    if (e.target.getAttribute("data-title")) {
      tooltip.innerText = e.target.getAttribute("data-title");
    } else {
      tooltip.innerText = e.target.parentElement.getAttribute("data-title");
    }
    tooltip.style.display = "inline-block";
    tooltip.style.top = e.pageY - tooltip.clientHeight - 20 + "px";
    tooltip.style.left = e.pageX - tooltip.clientWidth / 2 + "px";
  });
  item.addEventListener("mouseleave", function (e) {
    tooltip.style.display = "";
  });
});
