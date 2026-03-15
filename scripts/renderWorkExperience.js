import workExperience from "../data/workExperience.js";

const tabsContainer = document.getElementById("experience-tabs");
const panelsContainer = document.getElementById("experience-panels");

export default function renderWorkExperience() {
    if (!tabsContainer || !panelsContainer) return;

    tabsContainer.innerHTML = "";
    panelsContainer.innerHTML = "";

    tabsContainer.classList.add("relative");

    const indicator = document.createElement("span");
    indicator.className = "absolute right-0 top-0 block w-[2px] bg-[#50C878]";
    tabsContainer.appendChild(indicator);

    const panelsByKey = {};

    function moveIndicatorToTab(tab, animate = true) {
        if (!tab) return;

        if (animate) {
            indicator.classList.add("transition-all", "duration-500");
        } else {
            indicator.classList.remove("transition-all", "duration-500");
        }

        indicator.style.top = `${tab.offsetTop}px`;
        indicator.style.height = `${tab.offsetHeight}px`;
        indicator.style.transform = "none";
    }

    function animatePanelDescription(panel) {
        const items = panel.querySelectorAll(".exp-desc-item");

        items.forEach((item) => {
            item.classList.remove("is-visible");
        });

        requestAnimationFrame(() => {
            items.forEach((item) => {
                item.classList.add("is-visible");
            });
        });
    }

    workExperience.forEach((job, index) => {
        const key = job.name.toLowerCase();

        const tab = document.createElement("button");
        tab.className = "ripple-btn w-[160px] h-[48px] text-left px-[20px] py-[6px] text-[#A8B6B2] font-extralight";
        tab.textContent = job.name;
        tab.dataset.tab = key;

        const panel = document.createElement("div");
        panel.dataset.panel = key;
        panel.className = `flex flex-col gap-[1.5rem] p-[1.5rem] pt-0 ml-[1.5rem] ${index === 0 ? "block" : "hidden"}`;
        panel.innerHTML = `
            <div class="flex flex-col gap-[0.25rem] text-[#E5E7EB]">
                <h3 class="text-[1.5rem] font-semibold">${job.role} @ <span class="text-[#50C878]">${job.name}</span></h3>
                <p class="text-[#A8B6B2] text-[0.875rem]">${job.date}</p>
            </div>
            <ul class="list-image-[url(./assets/icons/sort-right.svg)] flex flex-col gap-[1rem] ml-[1rem] text-[#A8B6B2]">
                ${job.description
                    .map(
                        (desc, itemIndex) => `<li class="exp-desc-item pl-[1rem]" style="--item-index:${itemIndex}">${desc}</li>`,
                    )
                    .join("")}
            </ul>
        `;

        panelsByKey[key] = panel;

        tab.addEventListener("click", () => {
            tabsContainer.querySelectorAll("button[data-tab]").forEach((t) => {
                t.classList.remove("text-[#50C878]");
                t.classList.add("text-[#A8B6B2]");
            });
            tab.classList.remove("text-[#A8B6B2]");
            tab.classList.add("text-[#50C878]");

            Object.values(panelsByKey).forEach((p) => {
                p.classList.add("hidden");
                p.classList.remove("block");
            });

            panel.classList.remove("hidden");
            panel.classList.add("block");

            animatePanelDescription(panel);
            moveIndicatorToTab(tab, true);
        });

        tabsContainer.appendChild(tab);
        panelsContainer.appendChild(panel);
    });

    const firstTab = tabsContainer.querySelector("button[data-tab]");
    if (firstTab) {
        firstTab.classList.remove("text-[#A8B6B2]");
        firstTab.classList.add("text-[#50C878]");

        const firstPanel = panelsContainer.querySelector("[data-panel]");
        if (firstPanel) animatePanelDescription(firstPanel);

        // Initial placement before transitions.
        moveIndicatorToTab(firstTab, false);

        // Re-measure after layout settles (fixes first-paint half-height issue).
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                moveIndicatorToTab(firstTab, false);
                indicator.classList.add("transition-all", "duration-500");
            });
        });

        // Fonts can change line-height after initial paint.
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => moveIndicatorToTab(firstTab, false));
        }
    }
}
