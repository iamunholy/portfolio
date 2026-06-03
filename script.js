const revealElements = document.querySelectorAll("[data-reveal]");
const sections = [...document.querySelectorAll("[data-chapter]")];
const navLinks = [...document.querySelectorAll(".site-nav a")];
const mapNodes = [...document.querySelectorAll(".map-node")];
const storyProgress = document.getElementById("story-progress");
const xpFill = document.getElementById("xp-fill");
const activeChapter = document.getElementById("active-chapter");
const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("theme-toggle");
const soundToggle = document.getElementById("sound-toggle");
const brand = document.querySelector(".brand");

const skillDetails = {
  HTML: {
    level: "Advanced",
    projects: "Document & Quotation System, RFID dashboard, portfolio interfaces",
    experience: "Used across frontend builds and technical documentation workflows.",
  },
  CSS: {
    level: "Advanced",
    projects: "Responsive web interfaces, dashboard UI, portfolio experience",
    experience: "Applied for layouts, responsive design, animation, and visual polish.",
  },
  JavaScript: {
    level: "Advanced",
    projects: "Document system, RFID web app, interactive portfolio",
    experience: "Used for interface logic, local storage, tracking flows, and UI behavior.",
  },
  TypeScript: {
    level: "Intermediate",
    projects: "Speed Typing Test Web Application",
    experience: "Used with React for typed frontend workflows and performance tracking.",
  },
  React: {
    level: "Intermediate",
    projects: "Speed Typing Test Web Application",
    experience: "Used to build responsive application UI and live statistics interactions.",
  },
  Bootstrap: {
    level: "Intermediate",
    projects: "CEU HR Ecosystem",
    experience: "Used for structured, responsive business application screens.",
  },
  "Node.js": {
    level: "Intermediate",
    projects: "Document & Quotation Management System",
    experience: "Used for workflow features, file management, and operational tracking.",
  },
  "ASP.NET Core": {
    level: "Intermediate",
    projects: "CEU HR Ecosystem",
    experience: "Used for Web API backend modules and service integration.",
  },
  APIs: {
    level: "Intermediate",
    projects: "CEU HR Ecosystem, RFID dashboard",
    experience: "Used for data handling, dashboard integration, and role-based workflows.",
  },
  Authentication: {
    level: "Intermediate",
    projects: "CEU HR Ecosystem, Document system",
    experience: "Applied in role management and protected workflow modules.",
  },
  "EF Core": {
    level: "Learning by building",
    projects: "CEU HR Ecosystem",
    experience: "Used with ASP.NET Core and SQL Server Express for platform data access.",
  },
  "SQL Server": {
    level: "Intermediate",
    projects: "CEU HR Ecosystem",
    experience: "Used for business modules, relational records, and application data.",
  },
  PostgreSQL: {
    level: "Intermediate",
    projects: "Speed Typing Test Web Application",
    experience: "Used for app data persistence in a React and TypeScript project.",
  },
  MongoDB: {
    level: "Familiar",
    projects: "Database path and project planning",
    experience: "Part of Fernando's broader database toolkit.",
  },
  "Local Storage APIs": {
    level: "Intermediate",
    projects: "Document & Quotation Management System",
    experience: "Used for browser-side persistence and workflow state.",
  },
  Arduino: {
    level: "Intermediate",
    projects: "RFID robot, automatic delivery robot, IoT builds",
    experience: "Used for embedded prototyping, sensors, and hardware control.",
  },
  "RFID Systems": {
    level: "Advanced project experience",
    projects: "Autonomous RFID-Equipped Robot for Inventory Management",
    experience: "Used for inventory scanning, asset identification, and research prototyping.",
  },
  AWS: {
    level: "Familiar",
    projects: "RFID inventory web application deployment",
    experience: "Used as part of deployment planning for inventory monitoring systems.",
  },
  Tailscale: {
    level: "Practical internship experience",
    projects: "JREMD remote access and deployment setup",
    experience: "Configured remote access environments for office and development workflows.",
  },
  Networking: {
    level: "Practical internship experience",
    projects: "Switch configuration, FDAS, CCTV, troubleshooting",
    experience: "Used in technical support, office setup, and systems operations.",
  },
};

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.colors = ["#38bdf8", "#8b5cf6", "#22d3ee"];

    this.init();
    this.animate();

    window.addEventListener("resize", () => {
      this.resize();
      this.initParticles();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    const particleCount = Math.min((window.innerWidth * window.innerHeight) / 12000, 100);

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * (this.canvas.width - size * 2) + size;
      const y = Math.random() * (this.canvas.height - size * 2) + size;
      const velocityX = (Math.random() - 0.5) * 0.5;
      const velocityY = (Math.random() - 0.5) * 0.5;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];

      this.particles.push({
        x, y, size, velocityX, velocityY, color, baseSize: size
      });
    }
  }

  init() {
    this.resize();
    this.initParticles();
  }

  drawParticle(p) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fillStyle = p.color;
    this.ctx.globalAlpha = 0.6;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }

  updateParticle(p) {
    p.x += p.velocityX;
    p.y += p.velocityY;

    if (p.x + p.size > this.canvas.width || p.x - p.size < 0) {
      p.velocityX = -p.velocityX;
    }
    if (p.y + p.size > this.canvas.height || p.y - p.size < 0) {
      p.velocityY = -p.velocityY;
    }

    // Interactivity
    if (this.mouse.x != null && this.mouse.y != null) {
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.mouse.radius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        const maxDistance = 3;

        p.x -= forceDirectionX * force * maxDistance;
        p.y -= forceDirectionY * force * maxDistance;
      }
    }
  }

  connectParticles() {
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x;
        const dy = this.particles[a].y - this.particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = 1 - distance / 120;
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.2})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
          this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      this.updateParticle(this.particles[i]);
      this.drawParticle(this.particles[i]);
    }
    this.connectParticles();
  }
}

// Initialize on load if reduced motion is not preferred
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  new ParticleSystem("canvas-bg");
}

const questDetails = {
  rfid: {
    title: "Autonomous RFID-Equipped Robot for Inventory Management",
    summary:
      "A research and award-winning project that combines RFID hardware, robot movement, sensors, a web dashboard, database management, and deployment planning.",
    points: [
      "Built an autonomous RFID-based inventory solution for real-time monitoring and control.",
      "Designed automation workflows for inventory tracking and data management.",
      "Used Arduino, RFID, sensors, ESP32, HTML, CSS, JavaScript, database management, and AWS deployment planning.",
      "Recognized through research competition awards and publication.",
    ],
  },
  document: {
    title: "Document & Quotation Management System",
    summary:
      "A full-stack internship project for internal business operations at JREMD Technologies, Inc.",
    points: [
      "Designed responsive interfaces for quotation tracking, file organization, approval workflows, and document version management.",
      "Implemented file-management functionality, workflow automation, and operational tracking with JavaScript and Node.js.",
      "Configured remote system access and deployment environments using Tailscale.",
      "Performed end-to-end testing, debugging, optimization, and deployment independently.",
    ],
  },
  hr: {
    title: "CEU HR Ecosystem",
    summary:
      "An ongoing full-stack HR management platform built around institutional HR workflows.",
    points: [
      "Includes applicant tracking, job posting management, authentication, payroll, leave management, and performance monitoring modules.",
      "Uses C# ASP.NET Core Web API, EF Core, HTML, CSS, JavaScript, Bootstrap, and SQL Server Express.",
      "Designed responsive user interfaces and integrated backend services for role management and data handling.",
    ],
  },
};

let soundEnabled = false;
let audioContext = null;
let brandClicks = 0;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const chapter = entry.target.dataset.chapter;
      const id = entry.target.id;
      activeChapter.textContent = `Current location: ${chapter}`;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });

      mapNodes.forEach((node) => {
        node.classList.toggle("is-active", node.getAttribute("href") === `#${id}`);
      });

      const index = Math.max(0, sections.findIndex((section) => section.id === id));
      const progress = Math.round(((index + 1) / sections.length) * 100);
      xpFill.style.width = `${Math.max(12, progress)}%`;
    });
  },
  {
    threshold: 0.42,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

function updateStoryProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (scrollTop / height) * 100 : 0;
  storyProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function playTone() {
  if (!soundEnabled) return;

  audioContext ||= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 620;
  gain.gain.setValueAtTime(0.025, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function openModal(title, summary, points) {
  modalContent.innerHTML = `
    <h3>${title}</h3>
    <p>${summary}</p>
    <ul>${points.map((point) => `<li>${point}</li>`).join("")}</ul>
  `;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }

  playTone();
}

document.querySelectorAll("[data-skill]").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.skill;
    const detail = skillDetails[name];
    openModal(name, `Proficiency: ${detail.level}`, [
      `Projects using this skill: ${detail.projects}`,
      detail.experience,
    ]);
  });
});

document.querySelectorAll("[data-quest]").forEach((button) => {
  button.addEventListener("click", () => {
    const detail = questDetails[button.dataset.quest];
    openModal(detail.title, detail.summary, detail.points);
  });
});

document.querySelectorAll("[data-achievement]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`Badge unlocked: ${button.dataset.achievement}`);
    playTone();
  });
});

document.querySelectorAll("a, button").forEach((element) => {
  element.addEventListener("click", () => {
    if (!element.matches("[data-skill], [data-quest], [data-achievement]")) {
      playTone();
    }
  });
});

modalClose.addEventListener("click", () => {
  modal.close();
});

modal.addEventListener("click", (event) => {
  const modalBox = modal.getBoundingClientRect();
  const isOutside =
    event.clientX < modalBox.left ||
    event.clientX > modalBox.right ||
    event.clientY < modalBox.top ||
    event.clientY > modalBox.bottom;

  if (isOutside) {
    modal.close();
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("day-mode");
  const isDay = document.body.classList.contains("day-mode");
  themeToggle.querySelector("span").textContent = isDay ? "N" : "D";
  themeToggle.setAttribute("aria-label", isDay ? "Toggle night mode" : "Toggle day mode");
  showToast(isDay ? "Day mode activated" : "Night mode activated");
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.classList.toggle("is-active", soundEnabled);
  soundToggle.querySelector("span").textContent = soundEnabled ? "On" : "S";
  soundToggle.setAttribute(
    "aria-label",
    soundEnabled ? "Turn interface sound off" : "Turn interface sound on"
  );
  showToast(soundEnabled ? "Interface sound enabled" : "Interface sound muted");
  playTone();
});

brand.addEventListener("click", () => {
  brandClicks += 1;

  if (brandClicks === 5) {
    showToast("Secret achievement unlocked: Persistent Builder");
    xpFill.style.width = "100%";
    playTone();
  }
});

window.addEventListener("scroll", updateStoryProgress, { passive: true });
window.addEventListener("resize", updateStoryProgress);
updateStoryProgress();

// Typing Animation
const typingText = "The Journey of Fernando Banal";
const typingContainer = document.querySelector(".typing-container");
let charIndex = 0;

function typeText() {
  if (typingContainer && charIndex < typingText.length) {
    typingContainer.textContent += typingText.charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 60 + Math.random() * 40); // Natural typing speed
  } else {
    document.querySelector('.typing-cursor').style.animation = 'blink 1s step-end infinite';
  }
}

// 3D Tilt Effect for Quest Cards
const cards = document.querySelectorAll(".quest-card, .timeline-card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    setTimeout(() => {
      card.style.transform = ""; // Reset to CSS hover state
    }, 300);
  });
});

// Initialize
if (typingContainer) {
  setTimeout(typeText, 500);
}

document.getElementById("current-year").textContent = new Date().getFullYear();
