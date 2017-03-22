Template.registerHelper("isMobile", function() {
  $window = $(window)
  return ($window.width() < 992);
});
