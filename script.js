$(document).ready(function() {

  // 1. Progress Bar Update Function
  function updateProgressBar() {
    let winScroll = $(window).scrollTop();
    let docHeight = $(document).height() - $(window).height();
    let scrolled = docHeight > 0 ? Math.round((winScroll / docHeight) * 100) : 0;
    
    // Clamp percentage between 0 and 100
    scrolled = Math.min(100, Math.max(0, scrolled));
    
    $('#progress-bar').css('width', scrolled + '%').text(scrolled + '%');
    sessionStorage.setItem('scrollPercentage', scrolled);
  }

  // Calculate progress on scroll and window resize
  $(window).on('scroll resize', updateProgressBar);

  // Preserve & Restore progress on page reload/refresh
  $(window).on('load', function() {
    setTimeout(function() {
      updateProgressBar();
    }, 100);
  });

  // 2. IntersectionObserver for Re-animating Sections on Scroll
  // Remove static wow classes so Observer can trigger them dynamically
  $('.wow').removeClass('wow');

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animated class when section/element comes into view
        $(entry.target).addClass('animate__animated');
        
        // Re-trigger animation by resetting style
        entry.target.style.animation = 'none';
        entry.target.offsetHeight; /* trigger reflow */
        entry.target.style.animation = null;
      }
    });
  }, {
    threshold: 0.05 // Triggers when 10% of the element is visible
  });

  // Observe all elements with animate__ classes
  $('[class*="animate__"]').each(function() {
    animationObserver.observe(this);
  });

  // 3. Smooth Scroll & Active Menu State
  $('.navbar-nav .nav-link, .btn[href^="#"]').on('click', function(e) {
    let target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      
      $('.navbar-nav .nav-link').removeClass('active');
      $(this).addClass('active');

      $('html, body').stop().animate({
        scrollTop: target.offset().top - 80
      }, 500, function() {
        updateProgressBar();
      });

      $('.navbar-collapse').collapse('hide');
    }
  });

  // 4. Sync Menu Highlight on Manual Scroll
  $(window).on('scroll', function() {
    let scrollPos = $(document).scrollTop() + 120;
    
    $('.navbar-nav .nav-link').each(function() {
      let currLink = $(this);
      let refElement = $(currLink.attr('href'));
      
      if (refElement.length && refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
        $('.navbar-nav .nav-link').removeClass('active');
        currLink.addClass('active');
      }
    });
  });

  // 5. Typing Effect for Hero Title
  const phrases = ["Responsive Websites.", "Bootstrap Frontends.", "WordPress Solutions."];
  let i = 0, j = 0;
  let currentPhrase = [];
  let isDeleting = false;

  function loopTyping() {
    let textContainer = document.getElementById("typing-text");
    if (!textContainer) return;

    if (i < phrases.length) {
      if (!isDeleting && j <= phrases[i].length) {
        currentPhrase.push(phrases[i][j]);
        j++;
        textContainer.innerHTML = currentPhrase.join("");
      }

      if (isDeleting && j <= phrases[i].length) {
        currentPhrase.pop();
        j--;
        textContainer.innerHTML = currentPhrase.join("");
      }

      if (j === phrases[i].length) {
        isDeleting = true;
      }

      if (isDeleting && j === 0) {
        currentPhrase = [];
        isDeleting = false;
        i++;
        if (i === phrases.length) i = 0;
      }
    }
    setTimeout(loopTyping, isDeleting ? 80 : 150);
  }
  loopTyping();

  // 6. Portfolio Category Filter
  $('.filter-btn').on('click', function() {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    let filterValue = $(this).attr('data-filter');

    if (filterValue === 'all') {
      $('.portfolio-item').show(300);
    } else {
      $('.portfolio-item').not('.' + filterValue).hide(300);
      $('.portfolio-item').filter('.' + filterValue).show(300);
    }
  });

});