function VikaSliderInfinite(obj) {
  var instance = this;
  obj = obj || {};
  instance.id = obj['id'] || 1;
  instance.infinity = obj['infinity'] || false;

  instance.move_carousel_start = obj['move_carousel_start'] || function () {};
  instance.move_carousel_end = obj['move_carousel_end'] || function () {};

  instance.resize_carousel = function () {
    division = 3;
    $('#carousel' + instance.id + ' #slides' + instance.id).css('margin-left', 0);
    all = ($('#carousel' + instance.id + ' #slides' + instance.id + ' .item').length / division + 1) * $('#carousel' + instance.id + ' #slides' + instance.id + ' .item').eq(0).width();
    dif = $('#carousel' + instance.id).offset().left;
    dif_ = $('.left-carousel' + instance.id).offset().left;
    j = -all + (dif_ - dif);
    s = $('#carousel' + instance.id + ' #slides' + instance.id + ' li').css('padding-right');
    s = s.replace('px', '') * 1;
    f = $('#carousel' + instance.id + ' #slides' + instance.id + ' .item').length / division - 4;
    j = j - (s * f);
    $('#carousel' + instance.id + ' #slides' + instance.id).css('margin-left', j);
  }

  instance.queue = function () {
    if (instance.queue_n > 0) {
      if (instance.queue_n >= 1) {
        instance.speed = 300;
      }
      if (instance.queue_n >= 2) {
        instance.speed = 200;
      }
      if (instance.queue_n >= 3) {
        instance.speed = 100;
      }
      if (instance.queue_n >= 4) {
        instance.speed = 50;
      }
      instance.queue_n = instance.queue_n - 1;
      if (instance.queue_n == 0) {
        instance.speed = 300;
      }
      $('#buttons-' + instance.id + ' .' + instance.direction).click();
    }
  }

  instance.moveto_while = function (n) {
    if (instance.animate == false) {
      k = n - instance.real_pos;
      if (k < 0) {
        k = k * -1;
        instance.queue_n = k;
        instance.direction = 'prev';
        instance.queue();
      } else {
        instance.queue_n = k;
        instance.direction = 'next';
        instance.queue();
      }
    }
  }
  
  instance.pos = 0;
  instance.start_pos = 0;
  instance.animate = false;
  instance.queue_n = 0;
  instance.direction = '';
  instance.real_pos = 0;
  instance.speed = 300;
  if (instance.click_left == null) instance.click_left = -1000;
  if (instance.dot_fast_click == null) instance.dot_fast_click = false;
  var speed = 5000;
  instance.item_width = $('#carousel' + instance.id + ' #slides' + instance.id + ' li').outerWidth();
  instance.left_value = instance.item_width * (-1);
  $("body").on("click", '#carousel' + instance.id + ' .item', function () {
    i = $(this).closest('.slides').parent().data('carousel') * 1;
    if (instance.animate == false) {
      ind = $('#carousel' + i + ' .item').index(this);
      k = ind - instance.start_pos;
      if (k <= instance.click_left) {
        return false;
      }
      if (k < 0) {
        k = k * -1;
        instance.queue_n = k;
        instance.direction = 'prev';
        instance.queue();
      } else {
        instance.queue_n = k;
        instance.direction = 'next';
        instance.queue();
      }
    }
  });
  $("body").on("click", '.carousel-items-dot-' + instance.id + ' li', function () {
    i = $(this).parent().data('carousel');
    ind = $('.carousel-items-dot-' + i + ' li').index(this);
    if (instance.animate == false)
      instance.moveto_while(ind + 1);
  });
  $('.carousel-items-dot-' + instance.id + ' li').removeClass('active');
  $('.carousel-items-dot-' + instance.id + ' li').eq(0).addClass('active');
  bf_ = "";
  a = 0;
  $('#carousel' + instance.id + ' #slides' + instance.id + ' li .item').each(function () {
    a++;
    $(this).attr('data-id', a);
    if (a == 1) {
      $(this).addClass('first-item');
    }
    $('.carousel-items-dot-' + instance.id).append('<li></li>');
  });
  $('#carousel' + instance.id + ' #slides' + instance.id + ' li .item').eq(a - 1).addClass('last-item');
  $('#carousel' + instance.id + ' #slides' + instance.id + ' ul li').eq(0).addClass('active');
  $("#carousel" + instance.id + " #slides" + instance.id + " li").each(function () {
    bf_ = bf_ + '<li class="copy">' + $(this).html() + '</li>';
  });
  instance.pos = a + 1;
  instance.start_pos = instance.pos;
  instance.real_pos = 1;
  $('#carousel' + instance.id + ' #slides' + instance.id + ' ul').prepend(bf_);
  $('#carousel' + instance.id + ' #slides' + instance.id + ' ul').append(bf_);
  if (instance.infinity == false) {
    $('#carousel' + instance.id + ' #slides' + instance.id + ' .copy').css('visibility', 'hidden');
    $('#buttons-' + instance.id + ' .prev').addClass('no');
    $('#carousel' + instance.id + ' .copy .item').html('');
  }
  instance.resize_carousel();
  $('#carousel' + instance.id + ' #slides' + instance.id + ' li:first').before($('#slides' + instance.id + ' li:last'));
  $('#carousel' + instance.id + ' #slides' + instance.id + ' ul').css({
    'left': instance.left_value
  });
  $('.buttons .prev').click(function () {
    i = $(this).closest('.buttons').data('carousel') * 1;
    if (instance.animate == true)
      return false;
    division = 3;
    if (instance.infinity == false) {
      if (instance.real_pos == 1) {
        return false;
      }
      if (instance.real_pos <= 2) {
        $('#buttons-' + i + ' .prev').addClass('no');
      }
    }
    if (instance.animate == false) {
      $('#buttons-' + i + ' .next').removeClass('no');
      instance.animate = true;
      left_indent = parseInt($('#carousel' + i + ' #slides' + i + ' ul').css('left')) + instance.item_width;
      instance.pos = instance.pos - 1;
      if (instance.pos < 1) {
        instance.pos = $('#carousel' + i + ' .item').length;
      }
      instance.real_pos = instance.real_pos - 1;
      if (instance.real_pos < 1) {
        instance.real_pos = $('#carousel' + i + ' .item').length / division;
      }
      if (instance.dot_fast_click == true) {
        $('.carousel-items-dot-' + i + ' li').removeClass('active');
        j = instance.real_pos - (instance.queue_n + 1);
        $('.carousel-items-dot-' + i + ' li').eq(j).addClass('active');
      } else {
        $('.carousel-items-dot-' + i + ' li').removeClass('active');
        $('.carousel-items-dot-' + i + ' li').eq(instance.real_pos - 1).addClass('active');
      }
      instance.move_carousel_start(instance, instance.real_pos);
      if (instance.queue_n == 0) {
        $('#carousel' + instance.id + ' #slides' + instance.id + ' ul li').removeClass('active');
        $('#carousel' + instance.id + ' #slides' + instance.id + ' ul li').eq($('#carousel' + instance.id + ' .slides ul li').length / division).addClass('active');
        instance.move_carousel_end(instance, instance.real_pos - 1);
      }
      $('#carousel' + instance.id + ' #slides' + instance.id + ' ul').animate({
        'left': left_indent
      }, instance.speed, function () {
        i = $(this).parent().parent().data('carousel');
        $('#carousel' + i + ' #slides' + i + ' li:first').before($('#carousel' + i + ' .slides li:last'));
        $('#carousel' + i + ' #slides' + i + ' ul').css({
          'left': 0
        });
        instance.animate = false;
        instance.queue();
      });
    }
    return false;
  });
  $('.buttons .next').click(function () {
    i = $(this).closest('.buttons').data('carousel') * 1;
    if (instance.animate == true)
      return false;
    division = 3;
    if (instance.infinity == false) {
      if (instance.real_pos == $('#carousel' + i + ' #slides' + i + ' ul li').length / division) {
        return false;
      }
      if (instance.real_pos >= $('#carousel' + i + ' #slides' + i + ' ul li').length / division - 1) {
        $('#buttons-' + i + ' .next').addClass('no');
      }
    }
    if (instance.animate == false) {
      $('#buttons-' + i + ' .prev').removeClass('no');
      instance.animate = true;
      left_indent = parseInt($('#carousel' + i + ' #slides' + i + ' ul').css('left')) - instance.item_width;
      instance.pos = instance.pos + 1;
      if (instance.pos > $('#carousel' + i + ' .item').length) {
        instance.pos = 1;
      }
      instance.real_pos = instance.real_pos + 1;
      if (instance.real_pos > $('#carousel' + i + ' .item').length / division) {
        instance.real_pos = 1;
      }
      instance.move_carousel_start(instance, instance.real_pos);
      if (instance.queue_n == 0) {
        $('#carousel' + i + ' #slides' + i + ' ul li').removeClass('active');
        k = Math.ceil($('#carousel' + i + ' #slides' + i + ' ul li').length / division + 2);
        $('#carousel' + i + ' #slides' + i + ' ul li').eq(k).addClass('active');
        instance.move_carousel_end(instance, instance.real_pos - 1);
      }
      if (instance.dot_fast_click == true) {
        $('.carousel-items-dot-' + i + ' li').removeClass('active');
        j = instance.real_pos - 1 + (instance.queue_n);
        $('.carousel-items-dot-' + i + ' li').eq(j).addClass('active');
      } else {
        $('.carousel-items-dot-' + i + ' li').removeClass('active');
        $('.carousel-items-dot-' + i + ' li').eq(instance.real_pos - 1).addClass('active');
      }
      $('#carousel' + i + ' #slides' + i + ' ul').animate({
        'left': left_indent
      }, instance.speed, function () {
        i = $(this).parent().parent().data('carousel');
        $('#carousel' + i + ' #slides' + i + ' li:last').after($('#carousel' + i + ' #slides' + i + ' li:first'));
        $('#carousel' + i + ' #slides' + i + ' ul').css({
          'left': 0
        });
        instance.animate = false;
        instance.queue();
      });
    }
    return false;
  });
  $(window).resize(function () {
    instance.resize_carousel();
  });
  instance.moveto_while(instance.start_pos);
}