export function initContactForm() {
    const form = document.querySelector("#contact form");
    if (!form) return;
    emailjs.init("qO-3fxqgb_AkEJMbo");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            await emailjs.sendForm("service_ucpst4n", "template_4b3ahvp", form);
            form.reset();
            console.log("Message sent successfully.");
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    });
}
