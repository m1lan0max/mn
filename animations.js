import { gsap } from "https://cdn.skypack.dev/gsap@3.12.5";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap@3.12.5/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function animateLogo() {
  const logo = document.getElementById("mnssa-logo");
  if (!logo) return;

  gsap.fromTo(
    logo,
    { scale: 0.3, rotation: -40, opacity: 0, y: -20 },
    {
      scale: 1,
      rotation: 0,
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.8)",
    }
  );
}

function animateCardsOnScroll() {
  const cards = document.querySelectorAll(".card, .form-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { y: 32, opacity: 0, scale: 0.97 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
      }
    );

    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        scale: 1.02,
        y: -4,
        duration: 0.18,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    });
  });
}

function animateHeroOrbit() {
  const orbit = document.querySelector(".hero-orbit");
  if (!orbit) return;

  gsap.fromTo(
    orbit,
    { scale: 0.9, opacity: 0, y: 16 },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 1.3,
      ease: "power3.out",
      delay: 0.3,
    }
  );

  gsap.to(".hero-orbit-dot", {
    rotate: 360,
    transformOrigin: "center center",
    repeat: -1,
    duration: 12,
    ease: "none",
  });
}

function setYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  animateLogo();
  animateHeroOrbit();
  animateCardsOnScroll();
  setYear();
});

