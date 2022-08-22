(function($) {

    $.fn.visible = function(partial) {
        var $t            = $(this),
            $w            = $(window),
            viewTop       = $w.scrollTop(),
            viewBottom    = viewTop + $w.height(),
            _top          = $t.offset().top + ($w.height() / 3);
        if($(window).width() < 580) {
          var _top        = $t.offset().top + ($w.height() / 5);
        }
        var _bottom       = _top + $t.height(),
            compareTop    = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;
  
      return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
    };
    $.fn.visibleDelay = function(partial) {
        var $t            = $(this),
            $w            = $(window),
            viewTop       = $w.scrollTop(),
            viewBottom    = viewTop + $w.height(),
            _top          = $t.offset().top + ($w.height() / 2);
        var _bottom       = _top + $t.height(),
            compareTop    = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;
  
      return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
    };
  
    var stuck = false,
        $window = $(window),
        didScroll = false,
        progressBar = $('.progress-bar'),
        header = $('header'),
        dist = 50;
  
    $window.scroll(function() {
      didScroll = true;
      if ( $window.scrollTop() >= dist && stuck === false ) {
          stuck = true;
          header.addClass('reduced');
          $('.top-down-arrow').addClass('hidden');
      }
      if ( $window.scrollTop() <= dist && stuck === true ) {
          stuck = false;
          header.removeClass('reduced');
          $('.top-down-arrow').removeClass('hidden');
      }
      var wintop = $(window).scrollTop(),
          docheight = $(document).height(),
          winheight = $(window).height();
      var totalScroll = (wintop/(docheight-winheight))*100;
      $('.progress-bar-inner').css('left', totalScroll + '%');
    });
  
    setInterval(function() {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 150);
  
    function hasScrolled() {
      $('.on-reveal').each(function() {
        var $this = $(this);
        if($this.visible(true)) {
          $this.addClass('come-in');
          var $secondary = $this.attr('data-secondary-delay');
          if($secondary) {
            setTimeout(function() {
              $this.addClass('secondary-come-in');
            }, $secondary);
          }
        }
      });
      $('.play-on-reveal').each(function() {
        var $this = $(this);
        var $videoEl = $this.find('video');
        var $video = $videoEl.get(0);
        if($this.visible(true)) {
          if($this.attr('data-played') === 'false') {
            $this.attr('data-played', 'true')
            if ($video.paused) {
              $video.play();
              $videoEl.on('ended', function() {
                if($this.hasClass('can-restart')) {
                  $('.restart-video').addClass('show');
                }
              });
            }
  
          }
        }
      });
      $('.play-on-reveal-delay').each(function() {
        var $this = $(this);
        var $videoEl = $this.find('video');
        var $video = $videoEl.get(0);
        if($this.visibleDelay(true)) {
          if($this.attr('data-played') === 'false') {
            $this.attr('data-played', 'true')
            if ($video.paused) {
              $video.play();
              $videoEl.on('ended', function() {
                if($this.hasClass('can-restart')) {
                  $('.restart-video').addClass('show');
                }
              });
            }
  
          }
        }
      });
    }
  
  
  
    function bindEvent(element, eventName, eventHandler) {
          if (element.addEventListener) {
              element.addEventListener(eventName, eventHandler, false);
          } else if (element.attachEvent) {
              element.attachEvent('on' + eventName, eventHandler);
          }
      }
  
      var iframeEl = document.getElementById('top_video');
      var sendMessage = function (msg) {
          iframeEl.contentWindow.postMessage(msg, '*');
      };
  
      $('.watch-film-link').click(function() {
        var wrap = $(this).parents('.full-width-video-wrap');
              wrap.addClass('playing');
        var iframeURL = wrap.find('.iframe-container').attr('data-iframe-url');
        if($('html').hasClass('no-touch')) {
          var iframeURL = iframeURL + '&autoplay=true';
        }
        wrap.find('iframe').attr('src', iframeURL);
              return false;
        });
      bindEvent(window, 'message', function(e) {
        var methods = {
          ready: function(data) {
          },
          pause: function(data) {
          },
          play: function(data) {
          },
          complete: function(data) {
            $('.share-video').show();
            $('.end-frame').show();
          }
        }
        try {
          var json = JSON.parse(e.data);
          if (json.length > 0 && typeof methods[json[0].kind] === 'function') {
          // json is an array
          methods[json[0].kind].call(null, json[0]);
          } else if (typeof methods[json.kind] === 'function') {
          // json is an object
          methods[json.kind].call(null, json);
          }
        }
        catch (error) {
          console.log('could not handle ovpComm event', e.data);
        }
      });
  
      $('.close-video').click(function() {
        var wrap = $(this).parents('.full-width-video-wrap');
             wrap.removeClass('playing');
         wrap.find('.share-video').hide();
         wrap.find('.end-frame').hide();
         wrap.find('iframe').attr('src', '');
             return false;
         });
  
    $(document).ready(function() {
      $('.carousel').each(function() {
        var $carousel = $(this),
            $next = $carousel.parent().find('.next-button'),
            $prev = $carousel.parent().find('.prev-button');
        $carousel.flickity({
          imagesLoaded: true,
          wrapAround: true,
          dragThreshold: 10,
          lazyLoad: 2,
          prevNextButtons: false
        });
        $next.click(function() {
          $carousel.flickity('next');
          return false;
        });
        $prev.click(function() {
          $carousel.flickity('previous');
          return false;
        });
      });
  
      $('.with-play-button .play-video').click(function() {
        var wrap = $(this).parents('.full-width-video-wrap'),
            video = wrap.find('video'),
            vidStatus = 'paused';
        wrap.addClass('playing');
        video.get(0).play();
        video.on("play", function() {
           vidStatus = 'playing';
        });
        video.on("pause", function() {
           vidStatus = 'paused';
        });
        video.on('click', function() {
          if(vidStatus == 'playing') {
            video.get(0).pause();
            vidStatus = 'paused';
          }
          else {
            video.get(0).play();
            vidStatus = 'playing';
          }
        });
        video.on("ended", function() {
           video.get(0).pause();
           wrap.removeClass('playing');
        });
        return false;
      });
  
      $('.with-play-button-iframe .play-video').click(function() {
        var wrap = $(this).parents('.full-width-video-wrap');
        wrap.addClass('playing');
        var iframeURL = wrap.attr('data-iframe-url');
        if($('html').hasClass('no-touch')) {
          var iframeURL = iframeURL + '&autoplay=true';
        }
        wrap.find('iframe').attr('src', iframeURL);
        return false;
      });
  
      $('.watch-film-link').click(function() {
  
      });
  
      $('.can-restart .play-video').click(function() {
        var wrap = $(this).parents('.full-width-video'),
            video = wrap.find('video');
        $(this).parent().removeClass('show');
        video.get(0).play();
        return false;
      });
  
      $('.header-logo-link').click(function() {
        $('html, body').animate({
          scrollTop: 0
        }, 1000);
        return false;
      });
  
      $('.top-down-arrow img').click(function() {
        var target = $(this).attr('data-target');
        var offset = $(target).offset().top;
        $('html, body').animate({
          scrollTop: offset - 60
        }, 1000);
        return false;
      });
  
      $('.share-link').click(function() {
        window.open($(this).attr('href'), 'ShareWindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 275) + ', left=' + ($(window).width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
            return false;
      });
  
      $('.line-up-team').fitText(1.3);
      $('.line-up-location, .line-date-time').fitText(2.5);
  
    });
  
    function calcVH() {
      if($('html').hasClass('touch')) {
        if($(window).width() > 650) {
          var height = $(window).outerHeight(true);
          $('.full-width-video-wrap').css({'height' : height - 140 + 'px'});
        }
        else {
          var height = $(window).outerHeight(true);
          $('.full-width-video-wrap').css({'height' : height - 140 + 'px'});
        }
      }
    }
    calcVH();
    $(window).on('orientationchange', function() {
      setTimeout(function() {
        calcVH();
      }, 10);
    });
  
    $(window).load(function() {
      $('.carousel').each(function() {
        var $carousel = $(this);
        $carousel.flickity('resize');
      });
    });
  
  
  
  
  })( jQuery );
  