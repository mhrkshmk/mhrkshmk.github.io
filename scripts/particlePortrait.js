function initParticlePortrait(canvas, options = {}) {
    if (!canvas) return () => {};

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    const state = {
        mouse: { x: -1000, y: -1000, active: false },
        lines: [],
        imageLoaded: false,
        startTime: performance.now(),
        size: 400,
        animationId: null,
    };

    const profileSrc = options.imageSrc || "/profile.png";
    const highlightColorHex = options.highlightColor || "#50C878";

    function hexToRgb(hex) {
        const value = String(hex || "").replace("#", "");
        if (value.length !== 6) return "168, 182, 178";

        const r = parseInt(value.slice(0, 2), 16);
        const g = parseInt(value.slice(2, 4), 16);
        const b = parseInt(value.slice(4, 6), 16);

        return `${r}, ${g}, ${b}`;
    }

    const highlightColor = hexToRgb(highlightColorHex);

    const img = new Image();
    img.crossOrigin = "anonymous";

    function getSize() {
        const width = window.innerWidth;

        if (width <= 480) return Math.max(220, Math.min(270, width - 28));
        if (width <= 768) return Math.max(270, Math.min(340, width - 44));
        return 470;
    }

    function buildParticles() {
        if (!state.imageLoaded) return;

        const size = state.size;
        const offscreen = document.createElement("canvas");
        const offCtx = offscreen.getContext("2d");
        if (!offCtx) return;

        offscreen.width = size;
        offscreen.height = size;

        const scale = 0.94;
        const imgAspect = img.width / img.height;

        let drawHeight = size * scale;
        let drawWidth = drawHeight * imgAspect;

        if (drawWidth > size * scale) {
            drawWidth = size * scale;
            drawHeight = drawWidth / imgAspect;
        }

        const offsetX = (size - drawWidth) / 2;
        const offsetY = (size - drawHeight) / 2;

        offCtx.clearRect(0, 0, size, size);
        offCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        const imageData = offCtx.getImageData(0, 0, size, size);
        const pixels = imageData.data;

        const lines = [];
        const rowGap = size <= 280 ? 5 : 6;

        for (let y = 0; y < size; y += rowGap) {
            let x = 0;

            while (x < size) {
                const i = (y * size + x) * 4;
                const a = pixels[i + 3];

                if (a > 128) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const brightness = (r + g + b) / (3 * 255);

                    const lineLength = Math.floor(3 + brightness * (size <= 280 ? 8 : 15));

                    const scatterX = (Math.random() - 0.5) * 300;
                    const scatterY = (Math.random() - 0.5) * 300;

                    lines.push({
                        x: x + scatterX,
                        y: y + scatterY,
                        targetX: x,
                        targetY: y,
                        vx: 0,
                        vy: 0,
                        length: lineLength,
                        baseAlpha: 0.5 + brightness * 0.5,
                        currentAlpha: 0,
                        delay: Math.random() * 0.3,
                        color: highlightColor,
                    });

                    x += lineLength + 3;
                } else {
                    x += 4;
                }
            }
        }

        if (lines.length) {
            let minX = Infinity;
            let maxX = -Infinity;
            let minY = Infinity;
            let maxY = -Infinity;

            lines.forEach((p) => {
                if (p.targetX < minX) minX = p.targetX;
                if (p.targetX > maxX) maxX = p.targetX;
                if (p.targetY < minY) minY = p.targetY;
                if (p.targetY > maxY) maxY = p.targetY;
            });

            const cloudCenterX = (minX + maxX) / 2;
            const cloudCenterY = (minY + maxY) / 2;
            const shiftX = size / 2 - cloudCenterX;
            const shiftY = size / 2 - cloudCenterY;

            lines.forEach((p) => {
                p.targetX += shiftX;
                p.targetY += shiftY;
                p.x += shiftX;
                p.y += shiftY;
            });
        }

        state.lines = lines;
        state.startTime = performance.now();
    }

    function resizeCanvas() {
        const nextSize = getSize();
        state.size = nextSize;

        canvas.width = nextSize;
        canvas.height = nextSize;
        canvas.style.width = `${nextSize}px`;
        canvas.style.height = `${nextSize}px`;

        buildParticles();
    }

    function draw() {
        state.animationId = requestAnimationFrame(draw);

        const size = state.size;
        ctx.clearRect(0, 0, size, size);

        if (!state.imageLoaded) return;

        const elapsed = (performance.now() - state.startTime) / 1000;
        const mouse = state.mouse;

        state.lines.forEach((p) => {
            const particleTime = elapsed - p.delay;
            if (particleTime < 0) return;

            const fadeProgress = Math.min(particleTime / 1.5, 1);
            const easedFade = 1 - (1 - fadeProgress) ** 2;
            p.currentAlpha = p.baseAlpha * easedFade;

            const moveProgress = Math.min(particleTime / 2.5, 1);
            const easedMove = 1 - (1 - moveProgress) ** 3;

            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 60;

                if (dist < maxDist && dist > 0) {
                    const force = (1 - dist / maxDist) * 2;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }
            }

            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;

            const pullStrength = 0.01 + easedMove * 0.07;
            p.vx += dx * pullStrength;
            p.vy += dy * pullStrength;

            p.vx *= 0.92;
            p.vy *= 0.92;

            p.x += p.vx;
            p.y += p.vy;

            ctx.strokeStyle = `rgba(${p.color}, ${p.currentAlpha})`;
            ctx.lineWidth = size <= 280 ? 1.5 : 2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.length, p.y);
            ctx.stroke();
        });
    }

    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        state.mouse.x = e.clientX - rect.left;
        state.mouse.y = e.clientY - rect.top;
        state.mouse.active = true;
    }

    function handleTouchMove(e) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        if (!touch) return;

        state.mouse.x = touch.clientX - rect.left;
        state.mouse.y = touch.clientY - rect.top;
        state.mouse.active = true;
    }

    function handleLeave() {
        state.mouse.active = false;
    }

    function cleanup() {
        cancelAnimationFrame(state.animationId);
        window.removeEventListener("resize", resizeCanvas);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleLeave);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleLeave);
    }

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleLeave);

    img.onload = () => {
        state.imageLoaded = true;
        buildParticles();
    };

    img.src = profileSrc;

    resizeCanvas();
    draw();

    return cleanup;
}

export default initParticlePortrait;
