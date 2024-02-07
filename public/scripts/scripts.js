const FARBA = {
  WH: window.innerHeight,

  WW: document.documentElement.clientWidth,

  isTouch: 'ontouchstart' in window || navigator.msMaxTouchPoints,

  //lazy load для сторонних либ
  lazyLibraryLoad(scriptSrc, linkHref, callback) {
    let script;
    const domScript = document.querySelector(`script[src="${scriptSrc}"]`);
    const domLink = document.querySelector(`link[href="${linkHref}"]`);

    if (!domScript) {
      script = document.createElement("script");
      script.src = scriptSrc;
      document.querySelector("#wrapper").after(script);
    }

    if (linkHref !== "" && !domLink) {
      let style = document.createElement("link");
      style.href = linkHref;
      style.rel = "stylesheet";
      document.querySelector("link").before(style);
    }

    if (!domScript) {
      script.onload = callback;
    } else {
      domScript.onload = callback;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  $('.ui-select, .ui-checkbox').styler();

  // боковая панель навигации
  (function() {
    const lis = document.querySelectorAll('.nav > ul > li > a');

    lis.forEach(a => {
      a.addEventListener('click', (event) => {
        const href = a.getAttribute('href');

        if (href === '#' || href === 'javascript:void(0)') {
          event.preventDefault();            
        }

        const parent = a.parentNode;
        parent.classList.toggle('active');
      })
    })
  })();

  // открытие учетной записи
  (function() {
    const select = document.querySelector('.header-user');
    const trigger = document.querySelector('.header-user-trigger');

    trigger.addEventListener('click', () => {
      select.classList.toggle('opened');
    })

  })();

  // аккордион
  (function() {
    document.querySelectorAll('.accordion-trigger').forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        let parentItem = this.parentNode;        
        
        let isOpened = parentItem.classList.contains('opened');        
        
        document.querySelectorAll('.accordion-item.opened').forEach(function(item) {
          item.classList.remove('opened');
        });    
       
        if (!isOpened) {
          parentItem.classList.add('opened');
        }
      });
    });
    
    
  })();


  //плавающие forms

  if ($('.form__side').length) {
    let $window = $(window);
    let $formSide = $('.form__side');
    let $formSideSpace = $('.form__side-space');
    let $blockWrapper = $('.block-wrapper');
    let $header = $('.header');
  
    $window.on('scroll', () => {
      let headerHeight = $header.height();
      let wrapperTopMargin = parseInt($blockWrapper.css('margin-top'));
  
      let windowOffset = $window.scrollTop() + headerHeight + wrapperTopMargin;
      let floatOffset = $formSideSpace.offset().top;
      let contentHeight = $blockWrapper.height() - headerHeight;
      let floatHeight = $formSide.height();
      let floatStop = floatOffset + contentHeight - floatHeight;
  
      if (windowOffset > floatOffset && windowOffset < floatStop) {
        $formSide.addClass('float');
      } else {
        $formSide.removeClass('float');
      }
  
      if (windowOffset >= floatStop) {
        $formSide.addClass('flip-bottom');
      } else {
        $formSide.removeClass('flip-bottom');
      }
    });
  
    $window.resize(() => {
      let parentWidth = $formSideSpace.width();
      $formSide.css({"width": parentWidth + "px"});
    }).resize();
  }

  // article slider
  (function() {
    if (!document.querySelector('.article-slider')) return
  
    var swiper = new Swiper('.article-slider', {   
      grabCursor: true,    
      slidesPerView: 1,     
      autoplay: false,
      // loop: true,
      navigation: {
        nextEl: ".article-slider .article-slider-next",
        prevEl: ".article-slider .article-slider-prev",
      },
    });  
  })();

  // загруженный файл в форме
  (function() {
    if (!document.querySelector('.ui-input-file')) return

    document.querySelector('.ui-input-file').addEventListener('change', function(e) {
      let fileName = e.target.files[0].name;
      document.querySelector('.ui-send-trigger').textContent = fileName;

      // Добавить класс "hidden" к элементу ui-send-formats
    let sendFormats = document.querySelector('.ui-send-formats');
    if (sendFormats) {
      sendFormats.classList.add('hidden');
    }
    });
  })();

  // Открытие попапа галлереи
  $(document).on("click", ".mfp-link__gallery", function () {     
    var gallery = $(this).closest('.mfp__gallery');      
    var links = gallery.find('.mfp-link__gallery');      
    var a = $(this); 
    var index = links.index(a);

    $.magnificPopup.open({
      items: { src: a.attr("data-href"), links, index },
      type: "ajax",
      overflowY: "scroll",
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      ajax: {
        tError: "Error. Not valid url"     
      },
      callbacks: {
        open: function () {
          setTimeout(function(){
            $('.mfp-wrap').addClass('not_delay');
            $('.mfp-popup').addClass('not_delay');
          },700);

          document.documentElement.style.overflow = 'hidden'
        },

        close: function() {
          document.documentElement.style.overflow = '';
          
          // сброс данных
            popupData = null;
            links = null;
            index = null;
        }
      }
    });
    return false;
  });

  // Открытие попапа
  $(document).on("click", ".mfp-link", function () {
    var a = $(this);
    $.magnificPopup.open({
      items: { src: a.attr("data-href") },
      type: "ajax",
      overflowY: "scroll",
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      ajax: {
        tError: "Error. Not valid url",
      },
      callbacks: {
        open: function () {
          setTimeout(function(){
            $('.mfp-wrap').addClass('not_delay');
            $('.mfp-popup').addClass('not_delay');
          },700);
  
          document.documentElement.style.overflow = 'hidden'
        },
  
        close: function() {
          document.documentElement.style.overflow = ''
        }
      }
    });
    return false;
  });

  // разветвляющийся выпадающий список
  (function() {
    document.querySelectorAll('.ui-dropdown-head').forEach(head => {
      head.addEventListener('click', e => {
        e.currentTarget.classList.toggle('open');     
        let content = e.currentTarget.closest('.ui-dropdown')
          .querySelector('.ui-dropdown-content');                     
        content.classList.toggle('open');
        updateHeight() 
      });    
    });

    function updateHeight() {
      document.querySelectorAll('.ui-dropdown-content > ul > li > ul').forEach(ul => {
        const paddingTop = getComputedStyle(ul).paddingTop;  
        const height = ul.lastElementChild.offsetTop - ul.firstElementChild.offsetTop + parseInt(paddingTop) + parseInt(paddingTop)/2;  
      
        ul.style.setProperty('--height', height + 'px');    
      });
    }

    updateHeight();

    document.querySelectorAll('.ui-dropdown-content ul > li > ul > li:has(> ul)').forEach(li => {       
      let toggle = document.createElement('div');
      toggle.classList.add('toggler');

      li.prepend(toggle);

      toggle.addEventListener('click', () => {
        li.classList.toggle('open');
        updateHeight();
      });
    })

    document.querySelectorAll('.ui-dropdown-content li a').forEach(link => {
      link.addEventListener('click', e => {      
        e.preventDefault();
        
        let text = e.target.innerText;        
        let input = document.querySelector('.ui-dropdown-head-input');       
        
        input.value = text;
    
        let content = document.querySelector('.ui-dropdown-content');
        content.classList.remove('open');   
        
        let head = document.querySelector('.ui-dropdown-head');
        head.classList.remove('open'); 
      });    
    });
    
  })();

  // слайдер новостей
  (function() {
    if (!document.querySelector('.news-slider')) return
  
    var swiper = new Swiper('.news-slider', {   
      grabCursor: true,    
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 20,
      // autoHeight: true,
      autoplay: true,
      loop: true,
      navigation: {
        nextEl: ".news-slider-next",
        prevEl: ".news-slider-prev",
      },
      breakpoints: {
        992: {
          slidesPerView: 2,
          spaceBetween: 20,
          autoplay: false,
          loop: false,        
        },  
        1025: {
          slidesPerView: 3,
          spaceBetween: 12,
          autoplay: false,
          loop: false,
        },
        1141: {
          slidesPerView: 3,
          spaceBetween: 20,
          autoplay: false,
          loop: false,
        },
        1440: {
          slidesPerView: 4,
          spaceBetween: 20,       
          autoplay: false,
          loop: false,         
        }
      }
    });  
  })();

  

})