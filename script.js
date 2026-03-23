// Smooth section reveal and minimalist interactivity

(function () {
  // Update footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle with cool animations
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navBackdrop = document.getElementById('nav-backdrop');
  var navAnimationOverlay = document.getElementById('nav-animation-overlay');
  var navFooter = document.querySelector('.nav-menu__footer');
  
  function closeMobileMenu() {
    // Trigger closing animation first
    if (navAnimationOverlay) {
      navAnimationOverlay.classList.remove('is-active');
      navAnimationOverlay.classList.add('is-closing');
      
      // Close menu after closing animation completes
      setTimeout(function() {
        navMenu.classList.remove('is-open');
        navBackdrop.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navFooter) navFooter.classList.remove('is-open');
        document.body.style.overflow = '';
        
        // Remove closing class after menu is closed
        navAnimationOverlay.classList.remove('is-closing');
      }, 700); // Start menu close 300ms before animation ends (1000ms - 300ms)
    } else {
      // Fallback if no animation overlay
      navMenu.classList.remove('is-open');
      navBackdrop.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      if (navFooter) navFooter.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }
  
  function openMobileMenu() {
    // First, make the menu visible
    navMenu.classList.add('is-open');
    navBackdrop.classList.add('is-open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    if (navFooter) navFooter.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    
    // Then trigger the animation after a short delay to sync with menu visibility
    if (navAnimationOverlay) {
      // Get the position of the nav toggle button relative to the nav-menu container
      var toggleRect = navToggle.getBoundingClientRect();
      var menuRect = navMenu.getBoundingClientRect();
      
      // Calculate position relative to the menu container
      var centerX = toggleRect.left + toggleRect.width / 2 - menuRect.left;
      var centerY = toggleRect.top + toggleRect.height / 2 - menuRect.top;
      
      // Set CSS custom properties for the animation origin
      navAnimationOverlay.style.setProperty('--animation-x', centerX + 'px');
      navAnimationOverlay.style.setProperty('--animation-y', centerY + 'px');
      
      // Delay animation start to sync with menu visibility
      setTimeout(function() {
        // Remove any existing classes and add opening animation
        navAnimationOverlay.classList.remove('is-closing');
        navAnimationOverlay.classList.add('is-active');
      }, 100); // Small delay to let menu become visible
    }
  }
  
  if (navToggle && navMenu && navBackdrop) {
    navToggle.addEventListener('click', function () {
      if (navMenu.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
    
    // Close menu when clicking backdrop
    navBackdrop.addEventListener('click', closeMobileMenu);
    
    // Close menu after clicking a link
    navMenu.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target.matches('a')) {
        closeMobileMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
    
    // Close menu when clicking outside the menu
    document.addEventListener('click', function(e) {
      if (navMenu.classList.contains('is-open')) {
        // Check if the click is outside the menu and not on the toggle button
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });
  }

  // IntersectionObserver for reveal-on-scroll animations
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once visible, stop observing to avoid repeated work
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

  // Highlight active nav link while scrolling
  var sectionIds = ['about', 'testimonials', 'process', 'portfolio', 'contact'];
  var sections = sectionIds
    .map(function (id) { var el = document.getElementById(id); return el ? el : null; })
    .filter(Boolean);
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));

  function setActive(id) {
    links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
  }

  var scrollHandler = function () {
    var scrollPos = window.scrollY + 120; // offset for sticky header
    var current = sections[0] && sections[0].id;
    sections.forEach(function (sec) {
      if (sec && sec.offsetTop <= scrollPos) current = sec.id;
    });
    if (current) setActive(current);
  };

  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler();

  // Analytics tracking for CTA clicks
  document.querySelectorAll('.button--primary').forEach(function(button) {
    button.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          'event_category': 'engagement',
          'event_label': this.textContent.trim()
        });
      }
    });
  });

  // Track form submissions
  var form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          'event_category': 'conversion',
          'event_label': 'contact_form'
        });
      }
    });
  }

  // Track external link clicks
  document.querySelectorAll('a[href^="http"]').forEach(function(link) {
    link.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'external_link_click', {
          'event_category': 'engagement',
          'event_label': this.href
        });
      }
    });
  });

  // Mobile menu UI detection and optimization
  function optimizeMobileMenuForBrowser() {
    var navLinks = document.querySelector('.nav-links');
    var navFooter = document.querySelector('.nav-menu__footer');
    
    if (!navLinks || !navFooter) return;
    
    // Detect if browser supports modern viewport units
    var supportsDvh = CSS.supports('height', '100dvh');
    var supportsSafeArea = CSS.supports('padding', 'env(safe-area-inset-bottom)');
    
    // Fallback for browsers without modern CSS support
    if (!supportsDvh || !supportsSafeArea) {
      var viewportHeight = window.innerHeight;
      var isLandscape = window.innerWidth > window.innerHeight;
      
      // Calculate appropriate bottom padding based on viewport
      var bottomPadding = 80; // Base padding
      
      // Adjust for different screen sizes and orientations
      if (viewportHeight < 600) {
        bottomPadding = 60;
      } else if (viewportHeight < 500) {
        bottomPadding = 40;
      }
      
      if (isLandscape) {
        bottomPadding = Math.min(bottomPadding, 60);
      }
      
      // Apply calculated padding
      navLinks.style.paddingBottom = bottomPadding + 'px';
      navFooter.style.paddingBottom = Math.max(bottomPadding * 0.6, 20) + 'px';
    }
  }
  
  // Run optimization on load and resize
  optimizeMobileMenuForBrowser();
  window.addEventListener('resize', optimizeMobileMenuForBrowser);
  window.addEventListener('orientationchange', function() {
    setTimeout(optimizeMobileMenuForBrowser, 100);
  });

  // Services Carousel functionality (Mobile only)
  var carouselTrack = document.getElementById('services-carousel-track');
  var carouselPrev = document.getElementById('carousel-prev');
  var carouselNext = document.getElementById('carousel-next');
  var carouselIndicators = document.getElementById('carousel-indicators');
  
  if (carouselTrack && carouselPrev && carouselNext && carouselIndicators) {
    var currentSlide = 0;
    var totalSlides = carouselTrack.children.length;
    var isMobile = window.innerWidth <= 1024;
    
    function updateCarousel() {
      if (!isMobile) {
        // On desktop, reset transform and hide navigation
        carouselTrack.style.transform = 'translateX(0)';
        return;
      }
      
      // Add bounce effect to the track
      carouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      // Calculate the width of the container (visible area)
      var containerWidth = carouselTrack.parentElement.offsetWidth;
      // Each card is 33.333333% of the track width, which equals 100% of container width
      var translateX = -(currentSlide * containerWidth);
      
      carouselTrack.style.transform = 'translateX(' + translateX + 'px)';
      
      // Update indicators with animation
      var indicators = carouselIndicators.querySelectorAll('.carousel__indicator');
      indicators.forEach(function(indicator, index) {
        indicator.classList.toggle('active', index === currentSlide);
      });
      
      // Update button states
      carouselPrev.disabled = currentSlide === 0;
      carouselNext.disabled = currentSlide >= totalSlides - 1;
      
      // Add a subtle pulse effect to the active card
      setTimeout(function() {
        var activeCard = carouselTrack.children[currentSlide];
        if (activeCard) {
          activeCard.style.transform = 'scale(1.02)';
          setTimeout(function() {
            activeCard.style.transform = 'scale(1)';
          }, 200);
        }
      }, 100);
    }
    
    function goToSlide(slideIndex) {
      if (!isMobile) return;
      
      if (slideIndex >= 0 && slideIndex < totalSlides) {
        currentSlide = slideIndex;
        updateCarousel();
      }
    }
    
    function nextSlide() {
      if (!isMobile) return;
      
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateCarousel();
      }
    }
    
    function prevSlide() {
      if (!isMobile) return;
      
      if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
      }
    }
    
    // Event listeners
    carouselNext.addEventListener('click', nextSlide);
    carouselPrev.addEventListener('click', prevSlide);
    
    // Indicator clicks
    carouselIndicators.addEventListener('click', function(e) {
      if (e.target.classList.contains('carousel__indicator')) {
        var slideIndex = parseInt(e.target.getAttribute('data-slide'));
        goToSlide(slideIndex);
      }
    });
    
    // Handle resize to update mobile/desktop mode
    window.addEventListener('resize', function() {
      var wasMobile = isMobile;
      isMobile = window.innerWidth <= 1024;
      
      // Reset to first slide if switching from desktop to mobile
      if (!wasMobile && isMobile) {
        currentSlide = 0;
      }
      
      // Update carousel with new dimensions
      updateCarousel();
    });
    
    // Initialize carousel after a short delay to ensure DOM is ready
    setTimeout(function() {
      updateCarousel();
    }, 100);
  }

  // Web Services Carousel functionality (Mobile only)
  var webCarouselTrack = document.getElementById('web-services-carousel-track');
  var webCarouselPrev = document.getElementById('web-services-carousel-prev');
  var webCarouselNext = document.getElementById('web-services-carousel-next');
  var webCarouselIndicators = document.getElementById('web-services-carousel-indicators');
  
  if (webCarouselTrack && webCarouselPrev && webCarouselNext && webCarouselIndicators) {
    var webCurrentSlide = 0;
    var webTotalSlides = webCarouselTrack.children.length;
    var webIsMobile = window.innerWidth <= 1024;
    
    function updateWebCarousel() {
      if (!webIsMobile) {
        // On desktop, reset transform and hide navigation
        webCarouselTrack.style.transform = 'translateX(0)';
        return;
      }
      
      // Add bounce effect to the track
      webCarouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      // Calculate the width of the container (visible area)
      var containerWidth = webCarouselTrack.parentElement.offsetWidth;
      // Each card is 25% of the track width, which equals 100% of container width
      var translateX = -(webCurrentSlide * containerWidth);
      
      webCarouselTrack.style.transform = 'translateX(' + translateX + 'px)';
      
      // Update indicators with animation
      var indicators = webCarouselIndicators.querySelectorAll('.carousel__indicator');
      indicators.forEach(function(indicator, index) {
        indicator.classList.toggle('active', index === webCurrentSlide);
      });
      
      // Update button states
      webCarouselPrev.disabled = webCurrentSlide === 0;
      webCarouselNext.disabled = webCurrentSlide >= webTotalSlides - 1;
      
      // Add a subtle pulse effect to the active card
      setTimeout(function() {
        var activeCard = webCarouselTrack.children[webCurrentSlide];
        if (activeCard) {
          activeCard.style.transform = 'scale(1.02)';
          setTimeout(function() {
            activeCard.style.transform = 'scale(1)';
          }, 200);
        }
      }, 100);
    }
    
    function goToWebSlide(slideIndex) {
      if (!webIsMobile) return;
      
      if (slideIndex >= 0 && slideIndex < webTotalSlides) {
        webCurrentSlide = slideIndex;
        updateWebCarousel();
      }
    }
    
    function nextWebSlide() {
      if (!webIsMobile) return;
      
      if (webCurrentSlide < webTotalSlides - 1) {
        webCurrentSlide++;
        updateWebCarousel();
      }
    }
    
    function prevWebSlide() {
      if (!webIsMobile) return;
      
      if (webCurrentSlide > 0) {
        webCurrentSlide--;
        updateWebCarousel();
      }
    }
    
    // Event listeners
    webCarouselNext.addEventListener('click', nextWebSlide);
    webCarouselPrev.addEventListener('click', prevWebSlide);
    
    // Indicator clicks
    webCarouselIndicators.addEventListener('click', function(e) {
      if (e.target.classList.contains('carousel__indicator')) {
        var slideIndex = parseInt(e.target.getAttribute('data-slide'));
        goToWebSlide(slideIndex);
      }
    });
    
    // Handle resize to update mobile/desktop mode
    window.addEventListener('resize', function() {
      var wasMobile = webIsMobile;
      webIsMobile = window.innerWidth <= 1024;
      
      // Reset to first slide if switching from desktop to mobile
      if (!wasMobile && webIsMobile) {
        webCurrentSlide = 0;
      }
      
      // Update carousel with new dimensions
      updateWebCarousel();
    });
    
    // Initialize carousel after a short delay to ensure DOM is ready
    setTimeout(function() {
      updateWebCarousel();
    }, 100);
  }

  // Social Services Carousel functionality (Mobile only)
  var socialCarouselTrack = document.getElementById('social-services-carousel-track');
  var socialCarouselPrev = document.getElementById('social-services-carousel-prev');
  var socialCarouselNext = document.getElementById('social-services-carousel-next');
  var socialCarouselIndicators = document.getElementById('social-services-carousel-indicators');
  
  if (socialCarouselTrack && socialCarouselPrev && socialCarouselNext && socialCarouselIndicators) {
    var socialCurrentSlide = 0;
    var socialTotalSlides = socialCarouselTrack.children.length;
    var socialIsMobile = window.innerWidth <= 1024;
    
    function updateSocialCarousel() {
      if (!socialIsMobile) {
        // On desktop, reset transform and hide navigation
        socialCarouselTrack.style.transform = 'translateX(0)';
        return;
      }
      
      // Add bounce effect to the track
      socialCarouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      // Calculate the width of the container (visible area)
      var containerWidth = socialCarouselTrack.parentElement.offsetWidth;
      // Each card is 25% of the track width, which equals 100% of container width
      var translateX = -(socialCurrentSlide * containerWidth);
      
      socialCarouselTrack.style.transform = 'translateX(' + translateX + 'px)';
      
      // Update indicators with animation
      var indicators = socialCarouselIndicators.querySelectorAll('.carousel__indicator');
      indicators.forEach(function(indicator, index) {
        indicator.classList.toggle('active', index === socialCurrentSlide);
      });
      
      // Update button states
      socialCarouselPrev.disabled = socialCurrentSlide === 0;
      socialCarouselNext.disabled = socialCurrentSlide >= socialTotalSlides - 1;
      
      // Add a subtle pulse effect to the active card
      setTimeout(function() {
        var activeCard = socialCarouselTrack.children[socialCurrentSlide];
        if (activeCard) {
          activeCard.style.transform = 'scale(1.02)';
          setTimeout(function() {
            activeCard.style.transform = 'scale(1)';
          }, 200);
        }
      }, 100);
    }
    
    function goToSocialSlide(slideIndex) {
      if (!socialIsMobile) return;
      
      if (slideIndex >= 0 && slideIndex < socialTotalSlides) {
        socialCurrentSlide = slideIndex;
        updateSocialCarousel();
      }
    }
    
    function nextSocialSlide() {
      if (!socialIsMobile) return;
      
      if (socialCurrentSlide < socialTotalSlides - 1) {
        socialCurrentSlide++;
        updateSocialCarousel();
      }
    }
    
    function prevSocialSlide() {
      if (!socialIsMobile) return;
      
      if (socialCurrentSlide > 0) {
        socialCurrentSlide--;
        updateSocialCarousel();
      }
    }
    
    // Event listeners
    socialCarouselNext.addEventListener('click', nextSocialSlide);
    socialCarouselPrev.addEventListener('click', prevSocialSlide);
    
    // Indicator clicks
    socialCarouselIndicators.addEventListener('click', function(e) {
      if (e.target.classList.contains('carousel__indicator')) {
        var slideIndex = parseInt(e.target.getAttribute('data-slide'));
        goToSocialSlide(slideIndex);
      }
    });
    
    // Handle resize to update mobile/desktop mode
    window.addEventListener('resize', function() {
      var wasMobile = socialIsMobile;
      socialIsMobile = window.innerWidth <= 1024;
      
      // Reset to first slide if switching from desktop to mobile
      if (!wasMobile && socialIsMobile) {
        socialCurrentSlide = 0;
      }
      
      // Update carousel with new dimensions
      updateSocialCarousel();
    });
    
    // Initialize carousel after a short delay to ensure DOM is ready
    setTimeout(function() {
      updateSocialCarousel();
    }, 100);
  }

  // Discord Services Carousel functionality (Mobile only)
  var discordCarouselTrack = document.getElementById('discord-services-carousel-track');
  var discordCarouselPrev = document.getElementById('discord-services-carousel-prev');
  var discordCarouselNext = document.getElementById('discord-services-carousel-next');
  var discordCarouselIndicators = document.getElementById('discord-services-carousel-indicators');
  
  if (discordCarouselTrack && discordCarouselPrev && discordCarouselNext && discordCarouselIndicators) {
    var discordCurrentSlide = 0;
    var discordTotalSlides = discordCarouselTrack.children.length;
    var discordIsMobile = window.innerWidth <= 1024;
    
    function updateDiscordCarousel() {
      if (!discordIsMobile) {
        // On desktop, reset transform and hide navigation
        discordCarouselTrack.style.transform = 'translateX(0)';
        return;
      }
      
      // Add bounce effect to the track
      discordCarouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      // Calculate the width of the container (visible area)
      var containerWidth = discordCarouselTrack.parentElement.offsetWidth;
      // Each card is 25% of the track width, which equals 100% of container width
      var translateX = -(discordCurrentSlide * containerWidth);
      
      discordCarouselTrack.style.transform = 'translateX(' + translateX + 'px)';
      
      // Update indicators with animation
      var indicators = discordCarouselIndicators.querySelectorAll('.carousel__indicator');
      indicators.forEach(function(indicator, index) {
        indicator.classList.toggle('active', index === discordCurrentSlide);
      });
      
      // Update button states
      discordCarouselPrev.disabled = discordCurrentSlide === 0;
      discordCarouselNext.disabled = discordCurrentSlide >= discordTotalSlides - 1;
      
      // Add a subtle pulse effect to the active card
      setTimeout(function() {
        var activeCard = discordCarouselTrack.children[discordCurrentSlide];
        if (activeCard) {
          activeCard.style.transform = 'scale(1.02)';
          setTimeout(function() {
            activeCard.style.transform = 'scale(1)';
          }, 200);
        }
      }, 100);
    }
    
    function goToDiscordSlide(slideIndex) {
      if (!discordIsMobile) return;
      
      if (slideIndex >= 0 && slideIndex < discordTotalSlides) {
        discordCurrentSlide = slideIndex;
        updateDiscordCarousel();
      }
    }
    
    function nextDiscordSlide() {
      if (!discordIsMobile) return;
      
      if (discordCurrentSlide < discordTotalSlides - 1) {
        discordCurrentSlide++;
        updateDiscordCarousel();
      }
    }
    
    function prevDiscordSlide() {
      if (!discordIsMobile) return;
      
      if (discordCurrentSlide > 0) {
        discordCurrentSlide--;
        updateDiscordCarousel();
      }
    }
    
    // Event listeners
    discordCarouselNext.addEventListener('click', nextDiscordSlide);
    discordCarouselPrev.addEventListener('click', prevDiscordSlide);
    
    // Indicator clicks
    discordCarouselIndicators.addEventListener('click', function(e) {
      if (e.target.classList.contains('carousel__indicator')) {
        var slideIndex = parseInt(e.target.getAttribute('data-slide'));
        goToDiscordSlide(slideIndex);
      }
    });
    
    // Handle resize to update mobile/desktop mode
    window.addEventListener('resize', function() {
      var wasMobile = discordIsMobile;
      discordIsMobile = window.innerWidth <= 1024;
      
      // Reset to first slide if switching from desktop to mobile
      if (!wasMobile && discordIsMobile) {
        discordCurrentSlide = 0;
      }
      
      // Update carousel with new dimensions
      updateDiscordCarousel();
    });
    
    // Initialize carousel after a short delay to ensure DOM is ready
    setTimeout(function() {
      updateDiscordCarousel();
    }, 100);
  }

  // Discord Skills Carousel functionality (Mobile only)
  var discordSkillsCarouselTrack = document.getElementById('discord-skills-carousel-track');
  var discordSkillsCarouselPrev = document.getElementById('discord-skills-carousel-prev');
  var discordSkillsCarouselNext = document.getElementById('discord-skills-carousel-next');
  var discordSkillsCarouselIndicators = document.getElementById('discord-skills-carousel-indicators');
  
  if (discordSkillsCarouselTrack && discordSkillsCarouselPrev && discordSkillsCarouselNext && discordSkillsCarouselIndicators) {
    var discordSkillsCurrentSlide = 0;
    var discordSkillsTotalSlides = discordSkillsCarouselTrack.children.length;
    var discordSkillsIsMobile = window.innerWidth <= 1024;
    
    function updateDiscordSkillsCarousel() {
      if (!discordSkillsIsMobile) {
        // On desktop, reset transform and disable all carousel functionality
        discordSkillsCarouselTrack.style.transform = 'translateX(0)';
        discordSkillsCarouselTrack.style.transition = 'none';
        return;
      }
      
      // Add bounce effect to the track
      discordSkillsCarouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      var containerWidth = discordSkillsCarouselTrack.parentElement.offsetWidth;
      var translateX = -(discordSkillsCurrentSlide * containerWidth);
      
      discordSkillsCarouselTrack.style.transform = 'translateX(' + translateX + 'px)';
      
      var indicators = discordSkillsCarouselIndicators.querySelectorAll('.carousel__indicator');
      indicators.forEach(function(indicator, index) {
        indicator.classList.toggle('active', index === discordSkillsCurrentSlide);
      });
      
      discordSkillsCarouselPrev.disabled = discordSkillsCurrentSlide === 0;
      discordSkillsCarouselNext.disabled = discordSkillsCurrentSlide >= discordSkillsTotalSlides - 1;
      
      // Add a subtle pulse effect to the active skill category
      setTimeout(function() {
        var activeSkill = discordSkillsCarouselTrack.children[discordSkillsCurrentSlide];
        if (activeSkill) {
          activeSkill.style.transform = 'scale(1.02)';
          setTimeout(function() {
            activeSkill.style.transform = 'scale(1)';
          }, 200);
        }
        
        // Trigger skills animation for mobile when slide changes
        if (discordSkillsIsMobile) {
          skillsAnimationManager.animateSkills('discord-skills-carousel-track', true);
        }
      }, 100);
    }
    
    function goToDiscordSkillsSlide(slideIndex) {
      if (!discordSkillsIsMobile) return;
      if (slideIndex >= 0 && slideIndex < discordSkillsTotalSlides) {
        discordSkillsCurrentSlide = slideIndex;
        updateDiscordSkillsCarousel();
      }
    }
    
    function nextDiscordSkillsSlide() {
      if (!discordSkillsIsMobile) return;
      if (discordSkillsCurrentSlide < discordSkillsTotalSlides - 1) {
        discordSkillsCurrentSlide++;
        updateDiscordSkillsCarousel();
      }
    }
    
    function prevDiscordSkillsSlide() {
      if (!discordSkillsIsMobile) return;
      if (discordSkillsCurrentSlide > 0) {
        discordSkillsCurrentSlide--;
        updateDiscordSkillsCarousel();
      }
    }
    
    discordSkillsCarouselNext.addEventListener('click', nextDiscordSkillsSlide);
    discordSkillsCarouselPrev.addEventListener('click', prevDiscordSkillsSlide);
    
    discordSkillsCarouselIndicators.addEventListener('click', function(e) {
      if (e.target.classList.contains('carousel__indicator')) {
        var slideIndex = parseInt(e.target.getAttribute('data-slide'));
        goToDiscordSkillsSlide(slideIndex);
      }
    });
    
    window.addEventListener('resize', function() {
      var wasMobile = discordSkillsIsMobile;
      discordSkillsIsMobile = window.innerWidth <= 1024;
      if (!wasMobile && discordSkillsIsMobile) {
        discordSkillsCurrentSlide = 0;
      }
      updateDiscordSkillsCarousel();
    });
    
    setTimeout(function() {
      updateDiscordSkillsCarousel();
    }, 100);
  }

  // Social Skills Carousel functionality (Mobile only)
  var socialSkillsCarouselTrack = document.getElementById('social-skills-carousel-track');
  var socialSkillsCarouselPrev = document.getElementById('social-skills-carousel-prev');
  var socialSkillsCarouselNext = document.getElementById('social-skills-carousel-next');
  var socialSkillsCarouselIndicators = document.getElementById('social-skills-carousel-indicators');
  
  if (socialSkillsCarouselTrack && socialSkillsCarouselPrev && socialSkillsCarouselNext && socialSkillsCarouselIndicators) {
    var socialSkillsCurrentSlide = 0;
    var socialSkillsTotalSlides = socialSkillsCarouselTrack.children.length;
    var socialSkillsIsMobile = window.innerWidth <= 1024;
    
    function updateSocialSkillsCarousel() {
      if (!socialSkillsIsMobile) {
        // On desktop, reset transform and disable all carousel functionality
        socialSkillsCarouselTrack.style.transform = 'translateX(0)';
        socialSkillsCarouselTrack.style.transition = 'none';
        return;
      }
      
      // Add bounce effect to the track
      socialSkillsCarouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      var containerWidth = socialSkillsCarouselTrack.parentElement.offsetWidth;
      var translateX = -(socialSkillsCurrentSlide * containerWidth);
      
      socialSkillsCarouselTrack.style.transform = 'translateX(' + translateX + 'px)';
      
      var indicators = socialSkillsCarouselIndicators.querySelectorAll('.carousel__indicator');
      indicators.forEach(function(indicator, index) {
        indicator.classList.toggle('active', index === socialSkillsCurrentSlide);
      });
      
      socialSkillsCarouselPrev.disabled = socialSkillsCurrentSlide === 0;
      socialSkillsCarouselNext.disabled = socialSkillsCurrentSlide >= socialSkillsTotalSlides - 1;
      
      // Add a subtle pulse effect to the active skill category
      setTimeout(function() {
        var activeSkill = socialSkillsCarouselTrack.children[socialSkillsCurrentSlide];
        if (activeSkill) {
          activeSkill.style.transform = 'scale(1.02)';
          setTimeout(function() {
            activeSkill.style.transform = 'scale(1)';
          }, 200);
        }
        
        // Trigger skills animation for mobile when slide changes
        if (socialSkillsIsMobile) {
          skillsAnimationManager.animateSkills('social-skills-carousel-track', true);
        }
      }, 100);
    }
    
    function goToSocialSkillsSlide(slideIndex) {
      if (!socialSkillsIsMobile) return;
      if (slideIndex >= 0 && slideIndex < socialSkillsTotalSlides) {
        socialSkillsCurrentSlide = slideIndex;
        updateSocialSkillsCarousel();
      }
    }
    
    function nextSocialSkillsSlide() {
      if (!socialSkillsIsMobile) return;
      if (socialSkillsCurrentSlide < socialSkillsTotalSlides - 1) {
        socialSkillsCurrentSlide++;
        updateSocialSkillsCarousel();
      }
    }
    
    function prevSocialSkillsSlide() {
      if (!socialSkillsIsMobile) return;
      if (socialSkillsCurrentSlide > 0) {
        socialSkillsCurrentSlide--;
        updateSocialSkillsCarousel();
      }
    }
    
    socialSkillsCarouselNext.addEventListener('click', nextSocialSkillsSlide);
    socialSkillsCarouselPrev.addEventListener('click', prevSocialSkillsSlide);
    
    socialSkillsCarouselIndicators.addEventListener('click', function(e) {
      if (e.target.classList.contains('carousel__indicator')) {
        var slideIndex = parseInt(e.target.getAttribute('data-slide'));
        goToSocialSkillsSlide(slideIndex);
      }
    });
    
    window.addEventListener('resize', function() {
      var wasMobile = socialSkillsIsMobile;
      socialSkillsIsMobile = window.innerWidth <= 1024;
      if (!wasMobile && socialSkillsIsMobile) {
        socialSkillsCurrentSlide = 0;
      }
      updateSocialSkillsCarousel();
    });
    
    setTimeout(function() {
      updateSocialSkillsCarousel();
    }, 100);
  }

  // Web Skills Carousel functionality (Mobile only)
  var webSkillsCarouselTrack = document.getElementById('web-skills-carousel-track');
  var webSkillsCarouselPrev = document.getElementById('web-skills-carousel-prev');
  var webSkillsCarouselNext = document.getElementById('web-skills-carousel-next');
  var webSkillsCarouselIndicators = document.getElementById('web-skills-carousel-indicators');
  
  if (webSkillsCarouselTrack && webSkillsCarouselPrev && webSkillsCarouselNext && webSkillsCarouselIndicators) {
    var webSkillsCurrentSlide = 0;
    var webSkillsTotalSlides = webSkillsCarouselTrack.children.length;
    var webSkillsIsMobile = window.innerWidth <= 1024;
    
    function updateWebSkillsCarousel() {
      if (!webSkillsIsMobile) {
        // On desktop, reset transform and disable all carousel functionality
        webSkillsCarouselTrack.style.transform = 'translateX(0)';
        webSkillsCarouselTrack.style.transition = 'none';
        return;
      }
      
      // Add bounce effect to the track
      webSkillsCarouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      var containerWidth = webSkillsCarouselTrack.parentElement.offsetWidth;
      var translateX = -(webSkillsCurrentSlide * containerWidth);
      
      webSkillsCarouselTrack.style.transform = 'translateX(' + translateX + 'px)';
      
      var indicators = webSkillsCarouselIndicators.querySelectorAll('.carousel__indicator');
      indicators.forEach(function(indicator, index) {
        indicator.classList.toggle('active', index === webSkillsCurrentSlide);
      });
      
      webSkillsCarouselPrev.disabled = webSkillsCurrentSlide === 0;
      webSkillsCarouselNext.disabled = webSkillsCurrentSlide >= webSkillsTotalSlides - 1;
      
      // Add a subtle pulse effect to the active skill category
      setTimeout(function() {
        var activeSkill = webSkillsCarouselTrack.children[webSkillsCurrentSlide];
        if (activeSkill) {
          activeSkill.style.transform = 'scale(1.02)';
          setTimeout(function() {
            activeSkill.style.transform = 'scale(1)';
          }, 200);
        }
        
        // Trigger skills animation for mobile when slide changes
        if (webSkillsIsMobile) {
          skillsAnimationManager.animateSkills('web-skills-carousel-track', true);
        }
      }, 100);
    }
    
    function goToWebSkillsSlide(slideIndex) {
      if (!webSkillsIsMobile) return;
      if (slideIndex >= 0 && slideIndex < webSkillsTotalSlides) {
        webSkillsCurrentSlide = slideIndex;
        updateWebSkillsCarousel();
      }
    }
    
    function nextWebSkillsSlide() {
      if (!webSkillsIsMobile) return;
      if (webSkillsCurrentSlide < webSkillsTotalSlides - 1) {
        webSkillsCurrentSlide++;
        updateWebSkillsCarousel();
      }
    }
    
    function prevWebSkillsSlide() {
      if (!webSkillsIsMobile) return;
      if (webSkillsCurrentSlide > 0) {
        webSkillsCurrentSlide--;
        updateWebSkillsCarousel();
      }
    }
    
    webSkillsCarouselNext.addEventListener('click', nextWebSkillsSlide);
    webSkillsCarouselPrev.addEventListener('click', prevWebSkillsSlide);
    
    webSkillsCarouselIndicators.addEventListener('click', function(e) {
      if (e.target.classList.contains('carousel__indicator')) {
        var slideIndex = parseInt(e.target.getAttribute('data-slide'));
        goToWebSkillsSlide(slideIndex);
      }
    });
    
    window.addEventListener('resize', function() {
      var wasMobile = webSkillsIsMobile;
      webSkillsIsMobile = window.innerWidth <= 1024;
      if (!wasMobile && webSkillsIsMobile) {
        webSkillsCurrentSlide = 0;
      }
      updateWebSkillsCarousel();
    });
    
    setTimeout(function() {
      updateWebSkillsCarousel();
    }, 100);
  }

  // Skills Animation Manager
  var skillsAnimationManager = {
    intervals: {},
    isDesktop: window.innerWidth > 1024,
    
    // Animate skills for a specific carousel
    animateSkills: function(carouselId, isActive) {
      var carouselTrack = document.getElementById(carouselId);
      if (!carouselTrack) return;
      
      // Clear existing interval for this carousel
      if (this.intervals[carouselId]) {
        clearInterval(this.intervals[carouselId]);
      }
      
      var skillCategories = carouselTrack.querySelectorAll('.skill__category');
      
      // On mobile, animate only the visible/active category
      if (!this.isDesktop) {
        // Find the currently visible category based on carousel position
        var visibleCategory = null;
        var carouselContainer = carouselTrack.parentElement;
        var containerWidth = carouselContainer.offsetWidth;
        var trackTransform = carouselTrack.style.transform;
        var currentTranslateX = 0;
        
        if (trackTransform && trackTransform.includes('translateX')) {
          var match = trackTransform.match(/translateX\(([^)]+)\)/);
          if (match) {
            currentTranslateX = parseInt(match[1]);
          }
        }
        
        var currentSlide = Math.abs(currentTranslateX / containerWidth);
        visibleCategory = skillCategories[currentSlide] || skillCategories[0];
        
        if (visibleCategory) {
          var skillItems = visibleCategory.querySelectorAll('.skill__item');
          
          skillItems.forEach(function(item, itemIndex) {
            setTimeout(function() {
              // Clear any existing classes
              item.classList.remove('animate-active');
              
              // Add active class (same as hover)
              setTimeout(function() {
                item.classList.add('animate-active');
                
                // Hold the active state for 0.25 seconds (same as desktop)
                setTimeout(function() {
                  item.classList.remove('animate-active');
                }, 250);
              }, 10);
            }, itemIndex * 150); // 0.15 seconds between each tag (same as desktop)
          });
          
          // Set up interval to restart animation after the last tag completes
          var totalDuration = skillItems.length * 150 + 250 + 2000; // Total time + buffer + 2s delay
          this.intervals[carouselId] = setInterval(function() {
            skillsAnimationManager.animateSkills(carouselId, true);
          }, totalDuration);
        }
      } else {
        // On desktop, animate all categories with overlapping effect
        skillCategories.forEach(function(category, categoryIndex) {
          var skillItems = category.querySelectorAll('.skill__item');
          
          skillItems.forEach(function(item, itemIndex) {
            setTimeout(function() {
              // Clear any existing classes
              item.classList.remove('animate-active');
              
              // Add active class (same as hover)
              setTimeout(function() {
                item.classList.add('animate-active');
                
                // Hold the active state for 0.25 seconds (same as transition)
                setTimeout(function() {
                  item.classList.remove('animate-active');
                }, 250);
              }, 10);
            }, (categoryIndex * 900) + (itemIndex * 150)); // 0.9s between categories, 0.15s between tags (continuous cascade)
          });
        });
        
        // Set up interval for continuous animation on desktop
        var totalDuration = skillCategories.length * 900 + (skillCategories[0]?.querySelectorAll('.skill__item').length || 4) * 150 + 250;
        this.intervals[carouselId] = setInterval(function() {
          skillsAnimationManager.animateSkills(carouselId, true);
        }, totalDuration);
      }
    },
    
    // Start animation for all skills carousels
    startAllAnimations: function() {
      var carouselIds = [
        'web-skills-carousel-track',
        'social-skills-carousel-track', 
        'discord-skills-carousel-track'
      ];
      
      carouselIds.forEach(function(id) {
        // Only start automatic animation on desktop
        if (skillsAnimationManager.isDesktop) {
          skillsAnimationManager.animateSkills(id, true);
        }
      });
    },
    
    // Stop all animations
    stopAllAnimations: function() {
      Object.keys(this.intervals).forEach(function(key) {
        clearInterval(this.intervals[key]);
      });
      this.intervals = {};
    },
    
    // Update mobile/desktop mode
    updateMode: function() {
      var wasDesktop = this.isDesktop;
      this.isDesktop = window.innerWidth > 1024;
      
      if (wasDesktop !== this.isDesktop) {
        this.stopAllAnimations();
        setTimeout(function() {
          skillsAnimationManager.startAllAnimations();
        }, 500);
      }
    }
  };
  
  // Initialize skills animations
  setTimeout(function() {
    skillsAnimationManager.startAllAnimations();
  }, 2000);
  
  // Handle resize events
  window.addEventListener('resize', function() {
    skillsAnimationManager.updateMode();
  });
})();


