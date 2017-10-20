(function($) {
  return $(window).on("scroll", (function(_this) {
    return function(event) {
      if ($(_this).scrollTop() > 150) {
        return $("#to_top_button").fadeIn("600");
      } else {
        return $("#to_top_button").fadeOut("600");
      }
    };
  })(this));
})(jQuery);
