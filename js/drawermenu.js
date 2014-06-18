// drawermenu.js

var drawerMenu = function(options){

  var self = this;
  var $body = $('body');

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
    } else if ($body.hasClass('menu-open') || $body.hasClass('menu-transition')) {
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
    self.$wrapper.css({
      'width' : self.$wrapper.outerWidth(),
      'minHeight' : self.$drawermenu.outerHeight()
    });
    $body.removeClass('menu-closed').addClass('menu-transition');
    self.$wrapper.animate({
        left: self.distance
      }, 'fast', function() {
        $body.removeClass('menu-transition').addClass('menu-open');
        // close by clicking outside of drawermenu
        self.$wrapper.one('click.drawermenu', function() {
          self.close();
        });
      }
    );
  };

  self.close = function() {
    $body.removeClass('menu-open').addClass('menu-transition');
    self.$wrapper.animate({
      left: '0'
    }, 'fast', function() {
      self.$drawermenu.scrollTop(0);
      $body.removeClass('menu-transition').addClass('menu-closed');  
      self.$wrapper.css({
        'width' : 'auto',
        'minHeight' : 0,
      });
      
    });
  };

  self.reset = function() {
    $body.removeClass('menu-open menu-transition').addClass('menu-closed');
    self.$wrapper.stop()
    .css({
      'width' : 'auto',
      'minHeight' : 0,
      'left' : 'auto'
    })
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
