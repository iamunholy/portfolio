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

document.getElementById("current-year").textContent = new Date().getFullYear();
