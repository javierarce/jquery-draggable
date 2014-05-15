$(function() {

  $.fn.drags = function(opt) {

    var self = this;

    opt = $.extend({ stickiness: 20, cursor: "move" }, opt);

    var $canvas = opt.canvas;

    self.allowDragging = true; 

    var horizontal_guides = [350];

    $canvas.append("<div class='guide horizontal one' />")
    $canvas.find(".guide.horizontal.one").offset( { top: 350});
    $canvas.find(".guide.horizontal.one").css( { left: 0 });

    var vertical_guides = [250, 500];

    $canvas.append("<div class='guide vertical one' />")
    $canvas.find(".guide.vertical.one").offset( { left: 250});
    $canvas.find(".guide.vertical.one").css( { top: 0 });

    $canvas.append("<div class='guide vertical two' />")
    $canvas.find(".guide.vertical.two").offset( { left: 500});
    $canvas.find(".guide.vertical.two").css( { top: 0 });

    var onMouseDown = function(e) {

      self.allowDragging = true;

      e.preventDefault(); 

      var positions = $canvas.find("div").map(function() {

        var l = $(this).offset().left;

        return l;

      });

      var $drag = $(this).addClass('draggable');

      var
      z_idx    = $drag.css('z-index'),
      drg_h    = $drag.outerHeight(),
      drg_w    = $drag.outerWidth(),
      pos_y    = $drag.offset().top  + drg_h - e.pageY,
      pos_x    = $drag.offset().left + drg_w - e.pageX,
      canvas_x = $canvas.offset().left,
      canvas_y = $canvas.offset().top,
      canvas_w = $canvas.width(),
      canvas_h = $canvas.height();

      var onMouseUp = function() {
        $(this).css('z-index', z_idx);
        self.allowDragging = false;
        //$canvas.find(".guide").remove();
      };

      var onMouseMove = function(e) {

        if (!self.allowDragging) return;

        var top  = e.pageY + pos_y - drg_h;
        var left = e.pageX + pos_x - drg_w;

        var otop  = top; 
        var oleft = left;

        var canvas_right  = canvas_x + canvas_w;
        var canvas_bottom = canvas_y + canvas_h;

        for (var i = 0; i < horizontal_guides.length; i++) {

          var target_l = horizontal_guides[i];

          if ( ( top >= target_l - opt.stickiness ) && ( top <= target_l + opt.stickiness ) ) {
            top = target_l;
            break;
          } else if ( ( top + drg_h <= target_l + opt.stickiness) && ( top + drg_h >= target_l - opt.stickiness ) ) {
            top = target_l - drg_h ;
            break;
          }
        }
        for (var i = 0; i < vertical_guides.length; i++) {

          var target_l = vertical_guides[i];

          if ( ( left >= target_l - opt.stickiness ) && ( left <= target_l + opt.stickiness ) ) {
            left = target_l;
            break;
          } else if ( ( left + drg_w <= target_l + opt.stickiness) && ( left + drg_w >= target_l - opt.stickiness ) ) {
            left = target_l - drg_w ;
            break;
          }
        }

        // LEFT
        if (left - opt.stickiness < canvas_x) {
          left = canvas_x;
        } else if (left + drg_w + opt.stickiness >  canvas_right ) {
          left = canvas_right - drg_w;
        }

        // TOP
        if (top - opt.stickiness < canvas_y) {
          top = canvas_y;
        } else if (top + drg_h + opt.stickiness >  canvas_bottom ) {
          top = canvas_bottom - drg_h;
        } 


        if (top == otop && left == oleft) {
          $(this).find(".draggable").removeClass("sticky");
        } else {
          $(this).find(".draggable").addClass("sticky");
        }

        var offset = { top: top, left: left };

        $('.draggable').offset(offset);
        $('.draggable').on("mouseup", onMouseUp);

      }

      $drag.css('z-index', 1000).parents().on("mousemove", onMouseMove);

    };

    var onExit = function() {
      $(".draggable").parents().off("mousemove");

      $(".draggable").removeClass('sticky');
      $(".draggable").removeClass('draggable');

    };

    $("body").on("mouseup", onExit);

    return this.css('cursor', opt.cursor).on("mousedown", onMouseDown).on("mouseup", onExit);

  }

  $(".canvas > div").drags( { canvas: $(".canvas") } );

});
