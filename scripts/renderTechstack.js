import techstack from "../data/techstack.js";

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const contextPhrases = [
    "learning in projects",
    "used in prototypes",
    "used in production",
    "daily driver",
    "core stack",
    "hands-on experience",
    "shipped real features",
];

function getProficiencyContext() {
    const level = proficiencyLevels[Math.floor(Math.random() * proficiencyLevels.length)];
    const context = contextPhrases[Math.floor(Math.random() * contextPhrases.length)];
    return `${level} • ${context}`;
}

export default function renderTechstack() {
    const container = document.getElementById("techstack");
    if (!container) return;

    container.innerHTML = "";

    techstack.forEach((tech) => {
        const techItem = document.createElement("div");
        const cats = Array.isArray(tech.tags) ? tech.tags : [];
        const proficiencyContext = getProficiencyContext();

        techItem.dataset.cats = cats.join(" ");
        techItem.className =
            "flex items-start justify-start gap-[1rem] my-auto h-[5rem] p-[10px] bg-[#1B3A2E] rounded-lg text-[#A8B6B2]";
        techItem.innerHTML = `
            <div class="h-[56px] w-[56px] rounded-lg p-[8px] my-auto" style="background-color: ${tech.backgroundColor}">
                <img src="${tech.icon}" alt="${tech.name}" />
            </div>
            <div class="my-auto">
                <p class="h-full my-auto text-left text-md font-medium">
                    ${tech.name}
                </p>
                <p class="text-xs font-extralight">
                    ${proficiencyContext}
                </p>
            </div>
        `;

        container.appendChild(techItem);
    });
}

export function initTechstackFilters() {
    const container = document.getElementById("techstack");
    const filterButtons = document.querySelectorAll("[data-filter]");
    if (!container || !filterButtons.length) return;

    function setActiveButton(filter) {
        filterButtons.forEach((btn) => {
            const isActive = btn.dataset.filter === filter;
            btn.classList.toggle("bg-[#A8B6B2]", isActive);
            btn.classList.toggle("text-[#1B3A2E]", isActive);
            btn.classList.toggle("border-none", isActive);
            btn.classList.toggle("border-[#A8B6B2]", !isActive);
            btn.classList.toggle("text-[#A8B6B2]", !isActive);
        });
    }

    function applyFilter(filter) {
        const cards = container.querySelectorAll("[data-cats]");
        cards.forEach((card) => {
            const cats = (card.dataset.cats || "").split(" ").filter(Boolean);
            const shouldShow = filter === "all" || cats.includes(filter);
            card.classList.toggle("hidden", !shouldShow);
        });
    }

    let activeFilter = "all";
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            activeFilter = btn.dataset.filter || "all";
            setActiveButton(activeFilter);
            applyFilter(activeFilter);
        });
    });

    setActiveButton(activeFilter);
    applyFilter(activeFilter);
}
