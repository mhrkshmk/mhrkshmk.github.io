export function initHeroTyping() {
    const heroTyped = document.getElementById("hero-typed");
    if (!heroTyped) return;

    const prefix = "Hello, ";
    const name = "Mehr";
    const suffix = " here.";
    const plainText = `${prefix}${name}${suffix}`;
    let i = 0;

    heroTyped.textContent = "";

    const timer = setInterval(() => {
        i += 1;
        const current = plainText.slice(0, i);

        const prefixPart = current.slice(0, Math.min(prefix.length, current.length));
        const rest = current.slice(prefix.length);
        const namePart = rest.slice(0, Math.min(name.length, rest.length));
        const suffixPart = rest.slice(name.length);

        heroTyped.innerHTML = `${prefixPart}<span class="font-medium text-[#50C878]">${namePart}</span>${suffixPart}`;

        if (i >= plainText.length) {
            clearInterval(timer);
        }
    }, 95);
}

export function initSectionReveal() {
    const sections = document.querySelectorAll(".reveal-section");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
}

export function initRippleEffect() {
    document.querySelectorAll(".ripple-btn").forEach((button) => {
        button.addEventListener("click", function (e) {
            const circle = document.createElement("span");
            circle.classList.add("ripple");

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = `${size}px`;
            circle.style.left = `${e.clientX - rect.left - size / 2}px`;
            circle.style.top = `${e.clientY - rect.top - size / 2}px`;

            this.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    });
}
