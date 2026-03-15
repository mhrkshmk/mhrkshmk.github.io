import initParticlePortrait from "./particlePortrait.js";
import renderWorkExperience from "./renderWorkExperience.js";
import renderPetProjects from "./renderPetProjects.js";
import renderTechstack, { initTechstackFilters } from "./renderTechstack.js";
import { initHeroTyping, initSectionReveal, initRippleEffect } from "./uiEffects.js";

const portraitCanvas = document.getElementById("particle-portrait");

renderTechstack();
initTechstackFilters();
renderWorkExperience();
renderPetProjects();

if (portraitCanvas) {
    initParticlePortrait(portraitCanvas, {
        imageSrc: "./assets/images/me-home.png",
        highlightColor: "#50C878",
    });
}

initHeroTyping();
initSectionReveal();
initRippleEffect();
