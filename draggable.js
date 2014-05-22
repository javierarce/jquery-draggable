$(function() {

  $.fn.draggable = function(opt) {

    var self  = this;
    var $ruleA  = null;
    var $ruleB = null;
    var $ruleC = null;
    var $ruleD = null;

    var $elements = this; 

    opt = $.extend({ horizontal_guides: [], vertical_guides: [], stickiness: 15, cursor: "move" }, opt);

    var $container = opt.container;

    self.allowDragging = true; 

    // Guide offsets
    var horizontal_guides = opt.horizontal_guides;
    var vertical_guides   = opt.vertical_guides;

    var vertical_limits, horizontal_limits, verticals, horizontals = []; 

    $ruleA = $("<div class='rule' />");
    $ruleA.offset( { top: 0 }).css( { left: 0 });
    $container.append($ruleA)

    $ruleB = $("<div class='rule' />");
    $ruleB.offset( { top: 0 }).css( { left: 0 });
    $container.append($ruleB);

    $ruleC = $("<div class='rule horizontal' />");
    $ruleC.offset( { top: 0 }).css( { left: 0 });
    $container.append($ruleC);

    $ruleD = $("<div class='rule horizontal' />");
    $ruleD.offset( { top: 0 }).css( { left: 0 });
    $container.append($ruleD);

    for (var i = 0; i < horizontal_guides.length; i++) {

      var position = horizontal_guides[i];

      var $el = $("<div class='guide horizontal' />");
      $container.append($el)

      $el.offset( { top: position }).css( { left: 0 });

    }

    for (var i = 0; i < vertical_guides.length; i++) {

      var position = vertical_guides[i];

      var $el = $("<div class='guide vertical' />");
      $container.append($el)
      $el.offset( { left: position }).css( { top: 0 });
    }

    var onMouseDown = function(e) {

      self.allowDragging = true;

      e.preventDefault(); 
      e.stopPropagation();

      var $drag = $(this).addClass('draggable');

      var
      z_idx    = $drag.css('z-index'),
      drg_h    = $drag.outerHeight(),
      drg_w    = $drag.outerWidth(),
      pos_y    = $drag.offset().top  + drg_h - e.pageY,
      pos_x    = $drag.offset().left + drg_w - e.pageX,
      container_x = $container.offset().left,
      container_y = $container.offset().top,
      container_w = $container.width(),
      container_h = $container.height();

      verticals = [];
      horizontals = [];
      vertical_limits   = [];
      horizontal_limits = [];

      $elements.each(function(i, e) {

        if (!$(e).hasClass("draggable")) {

          var t = $(e).offset().top;
          horizontal_limits.push(t);
          horizontal_limits.push(t + $(e).height());

          var l = $(e).offset().left;
          vertical_limits.push(l);
          vertical_limits.push(l + $(e).width());

        }

      });

      verticals   = verticals.concat(vertical_limits, vertical_guides).sort();
      horizontals = horizontals.concat(horizontal_limits, horizontal_guides).sort();

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

        var container_right  = container_x + container_w;
        var container_bottom = container_y + container_h;

        // CHECK GUIDES
        for (var i = 0; i < horizontals.length; i++) {

          var target_l = horizontals[i];

          if ( ( top >= target_l - opt.stickiness ) && ( top <= target_l + opt.stickiness ) ) {
            top = target_l;
            $ruleC.offset( { top: top }).css({ left: 0, opacity: 1 })
            //break;
          } else if ( ( top + drg_h <= target_l + opt.stickiness) && ( top + drg_h >= target_l - opt.stickiness ) ) {
            top = target_l - drg_h ;
            $ruleD.offset( { top: top + drg_h }).css({ left: 0, opacity: 1 })
            //break;
          }

        }

        for (var i = 0; i < verticals.length; i++) {

          var target_l = verticals[i];

          if ( ( left >= target_l - opt.stickiness ) && ( left <= target_l + opt.stickiness ) ) {
            left = target_l;
            $ruleA.offset( { left: left }).css({ top: 0, opacity: 1 })
            //break;
          } else if ( ( left + drg_w <= target_l + opt.stickiness) && ( left + drg_w >= target_l - opt.stickiness ) ) {
            left = target_l - drg_w ;
            $ruleB.offset( { left: left + drg_w }).css({ top: 0, opacity: 1 })
            //break;
          } 

        }

        // LEFT
        if (left - opt.stickiness < container_x) {
          left = container_x;
        } else if (left + drg_w + opt.stickiness >  container_right ) {
          left = container_right - drg_w;
        }

        // TOP
        if (top - opt.stickiness < container_y) {
          top = container_y;
        } else if (top + drg_h + opt.stickiness >  container_bottom ) {
          top = container_bottom - drg_h;
        } 


        if (top == otop && left == oleft) {
          $(this).find(".draggable").removeClass("sticky");
          $(".rule").css({ opacity: 0 });
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
      $(".rule").css({ opacity: 0 });

      $(".draggable").removeClass('sticky');
      $(".draggable").removeClass('draggable');

    };

    $("body").on("mouseup", onExit);

    return this.css('cursor', opt.cursor).on("mousedown", onMouseDown).on("mouseup", onExit);

  }

});
