// drawermenu.js

var drawerMenu = function(options){

  var self = this;
  var $body = $('body');
  var trans_end = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

  defaults = {
    menu : '',
    page_wrapper : ''
  };

  options = $.extend(defaults, options);

  self.init = function(){

    self.$menu = $(options.menu);
    self.$wrapper = $(options.page_wrapper);
    self.$drawermenu = $('<div id="drawermenu" />');
      
    if (!self.$menu.length || !self.$wrapper.length) { return false; }

    self.status();
    var resizeDelay;
    $(window).bind('resize', function() {
      clearTimeout(resizeDelay);
      resizeDelay = setTimeout(function() {
        self.status();
      }, 100);
    });

    $('#button-drawermenu').on('click', function() {
      if ($body.hasClass('menu-closed')) {
        self.open();
      }
    });

    // swipe to close - requires jQuery mobile
    if ($.isFunction($.fn.swipeleft)) {
      self.$drawermenu.swipeleft(function() {
        self.close();
        self.$wrapper.unbind('click.drawermenu');
      });
    }
    
  };

  self.status = function() {
    var viewport_small = self.$menu.is(':hidden') ? true : false;
    var drawermenu_present = $('#drawermenu').length ? true : false;
    if (viewport_small && !drawermenu_present) {
      self.build();
    } else if (drawermenu_present && !$body.hasClass('menu-closed')) {
      self.reset();
    }
  };

  self.build = function() {
    self.$drawermenu_content = $('<div class="content" />');
    self.$drawermenu_content.append(self.$menu.html());
    self.$drawermenu_content.appendTo(self.$drawermenu);

    // insert drawer menu
    $body.prepend(self.$drawermenu);
    self.distance = self.drawermenu_width = parseFloat(self.$drawermenu.innerWidth()) * 100 / parseFloat($body.innerWidth()) + '%';
    $body.addClass('menu-closed');
    
  };

  self.open = function() {
    $body.removeClass('menu-closed').addClass('menu-opening');
    self.$wrapper.css({'width' : self.$wrapper.outerWidth()})
    .addClass('move-out')
    .one(trans_end, function() {
      $(this).one('click.drawermenu', function() {
        self.close();
      });
      $body.removeClass('menu-opening').addClass('menu-open');
    });
  };

  self.close = function() {
    $body.removeClass('menu-open').addClass('menu-closing');
    self.$wrapper.removeClass('move-out').addClass('move-back')
    .one(trans_end, function() {
      $(this).removeClass('move-back')
      .css({'width' : 'auto'});
      $body.removeClass('menu-closing').addClass('menu-closed');
      self.$drawermenu.scrollTop(0);  
    });
  };

  self.reset = function() {
    $body.removeClass('menu-opening menu-open menu-closing').addClass('menu-closed');
    self.$wrapper.removeClass('move-out move-back')
    .css({'width' : 'auto'})
    .unbind('click.drawermenu');
    self.$drawermenu.scrollTop(0);
  };

  
  if (options.menu !== '' && options.page_wrapper !== '') {
    self.init();
  }

};



$(document).ready(function() {

  var newDrawerMenu = new drawerMenu({
    menu : '#page-head nav.nav-main',
    page_wrapper : '#page-wrap'
  });

});
