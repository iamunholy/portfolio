const revealElements = document.querySelectorAll("[data-reveal]");
const sections = [...document.querySelectorAll("[data-chapter]")];
const navLinks = [...document.querySelectorAll(".site-nav a")];
const mapNodes = [...document.querySelectorAll(".map-node")];
const storyProgress = document.getElementById("story-progress");
const activeChapter = document.getElementById("active-chapter");
const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("theme-toggle");
const soundToggle = document.getElementById("sound-toggle");
const brand = document.querySelector(".brand");
const mobileButtons = [...document.querySelectorAll(".mobile-pad button")];

const skillDetails = {
  HTML: {
    level: "Advanced",
    projects: "Portfolio UI, document system, research dashboard",
    experience: "Used for structure, accessible markup, and content-heavy interfaces.",
  },
  CSS: {
    level: "Advanced",
    projects: "Retro portfolio, dashboards, responsive layouts",
    experience: "Used for visual systems, animation, and responsive interface design.",
  },
  JavaScript: {
    level: "Advanced",
    projects: "Portfolio interactions, project tools, workflow apps",
    experience: "Used for DOM logic, local state, and product behavior.",
  },
  TypeScript: {
    level: "Intermediate",
    projects: "Speed Typing Test Web Application",
    experience: "Used with React for typed frontend workflows and statistics.",
  },
  React: {
    level: "Intermediate",
    projects: "Speed Typing Test Web Application",
    experience: "Used to build responsive application UI and live statistics interactions.",
  },
  "ASP.NET Core": {
    level: "Intermediate",
    projects: "CEU HR Ecosystem",
    experience: "Used for Web API backend modules and service integration.",
  },
  "Node.js": {
    level: "Intermediate",
    projects: "Document & Quotation Management System",
    experience: "Used for workflow features, file handling, and operational tools.",
  },
  APIs: {
    level: "Intermediate",
    projects: "Dashboard integrations and backend services",
    experience: "Used for data handling and system communication.",
  },
  Authentication: {
    level: "Intermediate",
    projects: "CEU HR Ecosystem, document system",
    experience: "Used in access control and role-based workflows.",
  },
  Bootstrap: {
    level: "Intermediate",
    projects: "CEU HR Ecosystem",
    experience: "Used for responsive styling and UI components.",
  },
  Python: {
    level: "Familiar",
    projects: "Academic coursework and script automation",
    experience: "Used for scripting, data manipulation, and basic logic.",
  },
  Git: {
    level: "Intermediate",
    projects: "All development projects",
    experience: "Used for version control, branching, and repository management.",
  },
  PostgreSQL: {
    level: "Intermediate",
    projects: "Speed Typing Test Web Application",
    experience: "Used for persistence in full-stack application work.",
  },
  "SQL Server": {
    level: "Intermediate",
    projects: "CEU HR Ecosystem",
    experience: "Used for business modules and relational records.",
  },
  SQL: {
    level: "Intermediate",
    projects: "CEU HR Ecosystem, relational databases",
    experience: "Used for complex queries, joins, and data manipulation.",
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
    experience: "Used as part of deployment planning and cloud delivery.",
  },
  Networking: {
    level: "Practical internship experience",
    projects: "Switch configuration, FDAS, CCTV, troubleshooting",
    experience: "Used in technical support, office setup, and systems operations.",
  },
  "C++": {
    level: "Intermediate",
    projects: "Hardware automation and Arduino",
    experience: "Used extensively in embedded systems and microcontrollers.",
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
    summary: "An ongoing full-stack HR management platform built around institutional HR workflows.",
    points: [
      "Includes applicant tracking, job posting management, authentication, payroll, leave management, and performance monitoring modules.",
      "Uses C# ASP.NET Core Web API, EF Core, HTML, CSS, JavaScript, Bootstrap, and SQL Server Express.",
      "Designed responsive user interfaces and integrated backend services for role management and data handling.",
    ],
  },
  ceu_intern: {
    title: "Computer Engineer Intern | Centro Escolar University",
    summary: "Provided technical administrative support and optimized laboratory operations.",
    points: [
      "Optimized laboratory operations and technical administrative support for BSIT-related activities.",
      "Prepared and updated laboratory manuals, documentation, and instructional materials.",
      "Organized digital learning resources and technical files for faculty and student use.",
      "Provided basic troubleshooting and technical support for laboratory systems and equipment.",
      "Supported academic technology initiatives and documentation workflows."
    ],
  },
  volleyball: {
    title: "Volleyball Coach & Program Developer | Passion Sports",
    summary: "Leadership role focused on structured athletic development and performance.",
    points: [
      "Designed structured volleyball training programs focused on athlete development and performance improvement.",
      "Demonstrates leadership, communication, and the ability to coach players toward consistent process adoption."
    ],
  },
  legal_admin: {
    title: "Legal Administrative Coordinator | Iguidez-Onida Law",
    summary: "Managed confidential documents and coordinated firm operations.",
    points: [
      "Managed confidential legal documents and client information with close attention to organization and security.",
      "Coordinated schedules, client communications, and case-file organization using digital management practices."
    ],
  },
};

const pokedexEntries = {
  Reactmon: {
    type: "Frontend",
    level: 90,
    description: "A powerful library used for building modern user interfaces and reusable component systems.",
  },
  Nodechu: {
    type: "Backend",
    level: 85,
    description: "Known for handling APIs, servers, and workflow logic efficiently.",
  },
  Postgreon: {
    type: "Database",
    level: 82,
    description: "A dependable relational engine for app data, analytics, and persistence.",
  },
  Rfidra: {
    type: "Hardware",
    level: 88,
    description: "An embedded systems specialist that excels at RFID scanning and physical automation.",
  },
  Awsaur: {
    type: "Deployment",
    level: 76,
    description: "A cloud partner that helps launch services and support scalable delivery.",
  },
  Tailspin: {
    type: "Remote Access",
    level: 72,
    description: "A stealthy network helper used for secure remote connectivity and deployment setup.",
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
      if (!entry.isIntersecting) {
        return;
      }

      const chapter = entry.target.dataset.chapter;
      const id = entry.target.id;

      if (activeChapter) {
        activeChapter.textContent = `Current location: ${chapter}`;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });

      mapNodes.forEach((node) => {
        node.classList.toggle("is-active", node.getAttribute("href") === `#${id}`);
      });

      const index = Math.max(0, sections.findIndex((section) => section.id === id));
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
  if (storyProgress) {
    storyProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
}

function playTone() {
  if (!soundEnabled) {
    return;
  }

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
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function openModal(title, summary, points) {
  if (!modalContent || !modal) {
    return;
  }

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

    if (!detail) {
      return;
    }

    openModal(name, `Proficiency: ${detail.level}`, [
      `Projects using this skill: ${detail.projects}`,
      detail.experience,
    ]);
  });
});

document.querySelectorAll("[data-quest]").forEach((button) => {
  button.addEventListener("click", () => {
    const detail = questDetails[button.dataset.quest];
    if (detail) {
      openModal(detail.title, detail.summary, detail.points);
    }
  });
});

document.querySelectorAll("[data-achievement]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`Badge unlocked: ${button.dataset.achievement}`);
    playTone();
  });
});

document.querySelectorAll("[data-entry]").forEach((button) => {
  button.addEventListener("click", () => {
    const entry = pokedexEntries[button.dataset.entry];
    if (!entry) {
      return;
    }

    openModal(button.dataset.entry, `${entry.type} type | Level ${entry.level}`, [entry.description, "Collected in Fernando's tech Pokédex."]);
  });
});

document.querySelectorAll("a, button").forEach((element) => {
  element.addEventListener("click", () => {
    if (!element.matches("[data-skill], [data-quest], [data-achievement], [data-entry]")) {
      playTone();
    }
  });
});

modalClose?.addEventListener("click", () => {
  modal?.close();
});

modal?.addEventListener("click", (event) => {
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

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("day-mode");
  const isDay = document.body.classList.contains("day-mode");
  themeToggle.setAttribute("aria-label", isDay ? "Toggle night mode" : "Toggle day mode");
  showToast(isDay ? "Day mode activated" : "Night mode activated");
});

soundToggle?.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.classList.toggle("is-active", soundEnabled);
  soundToggle.setAttribute(
    "aria-label",
    soundEnabled ? "Turn interface sound off" : "Turn interface sound on"
  );
  showToast(soundEnabled ? "Interface sound enabled" : "Interface sound muted");
  playTone();
});

brand?.addEventListener("click", () => {
  brandClicks += 1;

  if (brandClicks === 5) {
    showToast("Secret achievement unlocked: Persistent Builder");
    if (storyProgress) {
      storyProgress.style.width = "100%";
    }
    playTone();
  }
});

function scrollByViewport(direction) {
  const amount = Math.round(window.innerHeight * 0.72);
  const horizontal = Math.round(window.innerWidth * 0.5);

  switch (direction) {
    case "up":
      window.scrollBy({ top: -amount, behavior: "smooth" });
      break;
    case "down":
      window.scrollBy({ top: amount, behavior: "smooth" });
      break;
    case "left":
      window.scrollBy({ left: -horizontal, behavior: "smooth" });
      break;
    case "right":
      window.scrollBy({ left: horizontal, behavior: "smooth" });
      break;
    default:
      break;
  }

  showToast(`Moved ${direction}`);
  playTone();
}

mobileButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scrollByViewport(button.dataset.direction);
  });
});

window.addEventListener("keydown", (event) => {
  if (event.altKey || event.metaKey || event.ctrlKey) {
    return;
  }

  const key = event.key.toLowerCase();

  if (["arrowup", "w"].includes(key)) {
    scrollByViewport("up");
  } else if (["arrowdown", "s"].includes(key)) {
    scrollByViewport("down");
  } else if (["arrowleft", "a"].includes(key)) {
    scrollByViewport("left");
  } else if (["arrowright", "d"].includes(key)) {
    scrollByViewport("right");
  }
});

window.addEventListener("scroll", updateStoryProgress, { passive: true });
window.addEventListener("resize", updateStoryProgress);
updateStoryProgress();

const currentYear = document.getElementById("current-year");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}