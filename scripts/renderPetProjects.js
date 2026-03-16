import petProjects from "../data/petProjects.js";

export default function renderPetProjects() {
    const cardsContainer = document.getElementById("cards");
    if (!cardsContainer) return;

    cardsContainer.innerHTML = "";

    petProjects.forEach((project) => {
        const articleElement = document.createElement("article");
        articleElement.className = "group/project-card flex min-h-[348px] flex-col justify-between  px-[28px] py-[32px] rounded-xl bg-[#1B3A2E] hover:-translate-y-2 hover:bg-[#2A473B]";
        articleElement.innerHTML = `
            <header class="flex items-center justify-between">
                <h3 class="text-[9px] font-semibold text-[#50C878] px-2 py-1 border border-[#50C878] rounded-full">${project.category}</h3>
                <div class="flex gap-2 items-center">
                    <a class="h-fit w-fit" target="_blank" rel="noopener noreferrer" href="https://github.com/mhrkshmk/Quizzical.git"><img src="./assets/icons/github2.svg" class="h-7 w-7 rounded-full" alt="GitHub link" /></a>
                    <a class="cursor-pointer" target="_blank" rel="noopener noreferrer" href="#"><img src="./assets/icons/right-arrow.svg" class="h-6 w-6 rounded-full border border-[#DBDBDB] p-1 group-hover/project-card:-rotate-45 transition-all duration-[600ms]" alt="a right arrow" /></a>
                </div>
            </header>
            <div class="py-[1.25rem]">
                <h3 class="text-xl font-semibold text-[#DBDBDB] py-[1rem]">${project.name}</h3>
                <p class="text-sm leading-6 text-[#999999]">
                    ${project.description}
                </p>
            </div>
            <footer>
                <p class="text-xs text-[#999999]">
                    ${project.tags.join(", ")}
                </p>
            </footer>
        `
        cardsContainer.appendChild(articleElement);
    });
}
