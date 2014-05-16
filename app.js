$(function() {

  $.fn.drags = function(opt) {

    var self = this;
    var $guide = null;

    opt = $.extend({ stickiness: 10, cursor: "move" }, opt);

    var $canvas = opt.canvas;

    self.allowDragging = true; 

    // Guide offsets
    var horizontal_guides = [500, 200];
    var vertical_guides   = [400, 500]; 
    var vertical_limits,  horizontal_limits, verticals, horizontals = []; 

    for (var i = 0; i < horizontal_guides.length; i++) {

      var position = horizontal_guides[i];

      var $el = $("<div class='guide horizontal' />");
      $canvas.append($el)

      $el.offset( { top: position }).css( { left: 0 });

    }

    for (var i = 0; i < vertical_guides.length; i++) {

      var position = vertical_guides[i];

      var $el = $("<div class='guide vertical' />");
      $canvas.append($el)
      $el.offset( { left: position }).css( { top: 0 });
    }

    var onMouseDown = function(e) {

      self.allowDragging = true;

      e.preventDefault(); 

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

      verticals = [];
      horizontals = [];
      vertical_limits   = [];
      horizontal_limits = [];

      $(".block").each(function(i, e) {
        if (!$(e).hasClass("draggable")) {

          var t = $(e).offset().top;
          horizontal_limits.push(t);
          horizontal_limits.push(t + $(e).height());

          var l = $(e).offset().left;
          vertical_limits.push(l);
          vertical_limits.push(l + $(e).width());
        }
      });

      verticals   = verticals.concat(vertical_limits, vertical_guides);
      horizontals = horizontals.concat(horizontal_limits, horizontal_guides);

      var onMouseUp = function() {
        $(this).css('z-index', z_idx);
        self.allowDragging = false;
      };

      var onMouseMove = function(e) {

        if (!self.allowDragging) return;

        var top  = e.pageY + pos_y - drg_h;
        var left = e.pageX + pos_x - drg_w;

        var otop  = top; 
        var oleft = left;

        var canvas_right  = canvas_x + canvas_w;
        var canvas_bottom = canvas_y + canvas_h;

        // CHECK GUIDES
        for (var i = 0; i < horizontals.length; i++) {

          var target_l = horizontals[i];

          if ( ( top >= target_l - opt.stickiness ) && ( top <= target_l + opt.stickiness ) ) {
            top = target_l;
            break;
          } else if ( ( top + drg_h <= target_l + opt.stickiness) && ( top + drg_h >= target_l - opt.stickiness ) ) {
            top = target_l - drg_h ;
            break;
          }

        }

        for (var i = 0; i < verticals.length; i++) {

          var target_l = verticals[i];

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

  var colors = ["#1abc9c", "#16a085", "#f39c12", "#3498db", "#9b59b6", "#e67e22", "#f1c40f", "#e74c3c"];

  var ol = $(".canvas").offset().left;
  var ot = $(".canvas").offset().top;
  var cw = $(".canvas").width();
  var ch = $(".canvas").height();
  var cl = ol + cw;
  var ct = ot + ch;

  for (var i = 0; i < 5; i++) {

    $block = $("<div class='block' />");

    var w = Math.round(30 + Math.random() * 100);
    var h = Math.round(30 + Math.random() * 100);

    var l = Math.round(Math.random() * cw);
    var t = Math.round(Math.random() * ch);

    while ( (l + ol + w) >= cl || (t + ot + h) >= ct) {
      l = Math.round(Math.random() * cw);
      t = Math.round(Math.random() * ch);
    }

    var color = colors[Math.round(Math.random() * (colors.length - 1))];

    $block.offset({ left: l, top: t }).css({ width: w, height: h, backgroundColor: color });
    $(".canvas").append($block);

  }

  $(".canvas > .block").drags( { canvas: $(".canvas") } );

});
