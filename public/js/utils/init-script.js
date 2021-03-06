function init () {
  const $ = require('jquery');

  // General use DOM elements
  const $mobileNav = $('#mobile-nav');

  // General use helpers
  function checkClassNames ($target, classList) {
    return classList.some((className) => {
      return $target.hasClass(className);
    });
  }

  // Global click handler
  $('html').on('click', (e) => {
    const $target = $(e.target);
    // console.log($target);
    navEvents($target);
    // imageEvents($target);
  });

  // Nav functionality
  function navEvents ($target) {
    const allowedClasses = ['hamburger', 'hamburger-cont', 'hamburger-top', 'hamburger-bottom', 'hamburger-inner'];
    const isNavEvent = checkClassNames($target, allowedClasses);
    const navIsOpen = $mobileNav.hasClass('mobile-open');

    if (isNavEvent) {
      $mobileNav.toggleClass('mobile-open');
    } else if (navIsOpen) {
      $mobileNav.removeClass('mobile-open');
    }
  }

  // Images Functionality
  // function imageEvents ($target) {
    // Do nothing for now...
  // }
}

module.exports = init;