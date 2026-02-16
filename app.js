// Tyler Mullins Portfolio JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const navbarToggle = document.getElementById("navbarToggle");
  const navbarMenu = document.getElementById("navbarMenu");
  const navbarLinks = document.querySelectorAll(".navbar__link");
  const header = document.querySelector(".header");

  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener("click", function () {
      const isActive = navbarMenu.classList.toggle("active");
      navbarToggle.classList.toggle("active", isActive);
      navbarToggle.setAttribute("aria-expanded", String(isActive));
    });

    // Close mobile menu when clicking on a link
    navbarLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navbarToggle.classList.remove("active");
        navbarMenu.classList.remove("active");
        navbarToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      const isClickInsideNav =
        navbarMenu.contains(event.target) ||
        navbarToggle.contains(event.target);

      if (!isClickInsideNav && navbarMenu.classList.contains("active")) {
        navbarToggle.classList.remove("active");
        navbarMenu.classList.remove("active");
        navbarToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scrolling for navigation links
  navbarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (targetId && targetId.startsWith("#")) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          const headerHeight = document.querySelector(".header").offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight - 16;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Active navigation link highlighting
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const correspondingNavLink = document.querySelector(
        `.navbar__link[href="#${sectionId}"]`
      );

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navbarLinks.forEach((link) => link.classList.remove("active"));
        if (correspondingNavLink) {
          correspondingNavLink.classList.add("active");
        }
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink);
  updateActiveNavLink();

  // Header background + subtle hide/show on scroll
  let lastScrollY = window.scrollY;
  function handleNavbarScroll() {
    const currentY = window.scrollY;

    if (header) {
      if (currentY > 40) {
        header.classList.add("header--scrolled");
      } else {
        header.classList.remove("header--scrolled");
      }
    }

    lastScrollY = currentY;
  }

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  // IntersectionObserver-based scroll animations
  const animatedSelectors =
    ".timeline__item, .skill__item, .certification__item, .highlight";
  const animatedElements = document.querySelectorAll(animatedSelectors);

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-on-scroll");
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  animatedElements.forEach((el) => scrollObserver.observe(el));

  // Parallax effect for hero section (subtle)
  const hero = document.querySelector(".hero");
  function parallaxEffect() {
    const scrolled = window.pageYOffset;
    if (hero && scrolled < hero.offsetHeight) {
      const rate = scrolled * -0.15;
      hero.style.transform = `translateY(${rate}px)`;
    }
  }

  window.addEventListener("scroll", parallaxEffect);

  // Typing animation for hero subtitle
  function typeWriter(element, text, speed = 70) {
    if (!element) return;
    let i = 0;
    element.textContent = "";

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  setTimeout(() => {
  const heroSubtitle = document.querySelector('.hero__subtitle-text');
  if (heroSubtitle) {
    const originalText = heroSubtitle.textContent.trim();
    typeWriter(heroSubtitle, originalText, 70);
  }
}, 600);


  // Contact form handling (Formspree)
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;

      submitButton.textContent = "Sending...";
      submitButton.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          showFormMessage(
            "Thank you for your message! I'll get back to you soon.",
            "success"
          );
          contactForm.reset();
        } else {
          const data = await response.json();
          if (data.errors) {
            showFormMessage(
              "There was an error with your submission. Please check your form and try again.",
              "error"
            );
          } else {
            showFormMessage(
              "Oops! There was a problem submitting your form. Please try again.",
              "error"
            );
          }
        }
      } catch (error) {
        console.error("Form submission error:", error);
        showFormMessage(
          "There was a problem sending your message. Please try again later.",
          "error"
        );
      } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });

    function showFormMessage(message, type) {
      const existingMessage = document.querySelector(".form-message");
      if (existingMessage && existingMessage.parentNode) {
        existingMessage.parentNode.removeChild(existingMessage);
      }

      const messageDiv = document.createElement("div");
      messageDiv.className = `form-message status status--${type}`;
      messageDiv.textContent = message;

      contactForm.parentNode.insertBefore(messageDiv, contactForm);

      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv);
        }
      }, 5000);
    }

    // Basic validation styling
    const formInputs = contactForm.querySelectorAll(".form-control");
    formInputs.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.checkValidity()) {
          this.classList.remove("invalid");
          this.classList.add("valid");
        } else {
          this.classList.remove("valid");
          this.classList.add("invalid");
        }
      });

      input.addEventListener("input", function () {
        this.classList.remove("invalid", "valid");
      });
    });
  }

  // Set footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  console.log("Tyler Mullins Portfolio enhanced and loaded successfully.");
});
