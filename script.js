// --- Audio Elements ---
const audioIntro = document.getElementById('audio-intro');
const audioBg = document.getElementById('audio-bg');
const audioClick = document.getElementById('audio-click');

// Helper to play click sound
function playClick() {
  audioClick.currentTime = 0;
  audioClick.volume = 0.5;
  audioClick.play().catch(e => console.log("Click audio blocked", e));
}

// --- DOM Elements ---
const scene1 = document.getElementById('scene-1');
const startOverlay = document.getElementById('start-overlay');
const bootVideo = document.getElementById('boot-video');
const introVideo = document.getElementById('intro-video');
const skipHint = document.getElementById('skip-hint');

const screenWipe = document.getElementById('screen-wipe');
const wipeBars = document.querySelectorAll('.wipe-bar');

const introContainer = document.getElementById('intro-container');
const mainMenuOverlay = document.getElementById('main-menu-overlay');
const contentContainer = document.getElementById('content-container');
const contentSections = document.querySelectorAll('.content-section');
const menuItems = document.querySelectorAll('.menu-item');
const btnBack = document.getElementById('btn-back');

// --- State ---
let currentState = 'START_OVERLAY'; // START_OVERLAY, BOOT, TITLE, MENU_DIALOGUE, MENU_CHOICE, CONTENT
let activeMenuIndex = 0;
let audioUnlocked = false;
let bootSkipAllowed = false;

// --- Dialogue State ---
let dialogueStep = 0;
const introDialogue = [
  "HELLO THERE! WELCOME TO MY WORLD! MY NAME IS FERNANDO.",
  "I AM A COMPUTER ENGINEERING GRADUATE WITH A PASSION FOR BRIDGING THE GAP BETWEEN HARDWARE AND SOFTWARE.",
  "NOW, WHAT DO YOU WANT TO KNOW ABOUT ME?"
];
const oakText = document.getElementById('oak-text');
const oakChoices = document.getElementById('oak-choices');
const oakNextArrow = document.getElementById('oak-next-arrow');
const musicToggle = document.getElementById('music-toggle');
let isMuted = false;

// --- Typewriter State ---
const sectionContentMap = {};
contentSections.forEach(sec => {
  const container = sec.querySelector('.typewriter-container');
  if (container) {
    sectionContentMap[sec.id] = container.innerHTML;
  }
});
let typingInterval = null;
let isTyping = false;
let currentTypingElement = null;
let currentTypingContent = '';
let currentTypingCallback = null;

function skipTyping() {
  if (isTyping && currentTypingElement) {
    isTyping = false;
    clearTimeout(typingInterval);
    currentTypingElement.innerHTML = currentTypingContent;
    if (currentTypingCallback) currentTypingCallback();
  }
}

function typeWriterHTML(element, htmlContent, speed, callback = null) {
  element.innerHTML = '';
  let i = 0;
  let isTag = false;
  let textBuffer = '';
  isTyping = true;
  currentTypingElement = element;
  currentTypingContent = htmlContent;
  currentTypingCallback = callback;
  clearTimeout(typingInterval);
  
  function type() {
    if (!isTyping) return;
    
    if (i < htmlContent.length) {
      const char = htmlContent.charAt(i);
      if (char === '<') isTag = true;
      
      textBuffer += char;
      i++;
      
      if (isTag) {
        if (char === '>') isTag = false;
        type(); // Process HTML tags instantly
      } else {
        element.innerHTML = textBuffer;
        typingInterval = setTimeout(type, speed);
      }
    } else {
      isTyping = false;
      if (currentTypingCallback) currentTypingCallback();
    }
  }
  type();
}

// Attempt to play intro music
function tryPlayIntro() {
  if (!audioUnlocked) {
    audioUnlocked = true;
  }
}

// --- Sequence Logic ---
startOverlay.addEventListener('click', () => {
  if (currentState === 'START_OVERLAY') {
    startOverlay.classList.add('hidden');
    startBootSequence();
  }
});

function startBootSequence() {
  currentState = 'BOOT';
  bootVideo.classList.remove('hidden');
  musicToggle.classList.remove('hidden');
  bootVideo.play().catch(e => console.log(e));
  
  // Allow skip after 3 seconds
  setTimeout(() => {
    if (currentState === 'BOOT') {
      bootSkipAllowed = true;
      skipHint.classList.remove('hidden');
    }
  }, 3000);
}

bootVideo.addEventListener('ended', () => {
  if (currentState === 'BOOT') {
    proceedToTitle();
  }
});

function proceedToTitle() {
  currentState = 'TITLE';
  skipHint.classList.add('hidden');
  bootVideo.classList.add('hidden');
  bootVideo.pause();
  
  introVideo.classList.remove('hidden');
  introVideo.play();
  
  audioIntro.volume = 0.5;
  audioIntro.play().catch(e => console.log(e));
}

function triggerWipeTransition(callback) {
  screenWipe.classList.remove('hidden');
  
  wipeBars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.transform = 'scaleX(1)';
    }, index * 100);
  });

  setTimeout(() => {
    callback();
    // Hide wipe
    wipeBars.forEach(bar => bar.style.transform = 'scaleX(0)');
    setTimeout(() => screenWipe.classList.add('hidden'), 500);
  }, 1000);
}

// --- Menu Logic ---
function playDialogueStep() {
  oakNextArrow.classList.add('hidden');
  typeWriterHTML(oakText, introDialogue[dialogueStep], 40, () => {
    if (dialogueStep < introDialogue.length - 1) {
      oakNextArrow.classList.remove('hidden');
    } else {
      oakChoices.classList.remove('hidden');
      currentState = 'MENU_CHOICE';
    }
  });
}

function advanceDialogue() {
  if (currentState === 'MENU_DIALOGUE' && dialogueStep < introDialogue.length - 1) {
    dialogueStep++;
    playClick();
    playDialogueStep();
  }
}

function updateMenu() {
  menuItems.forEach((item, index) => {
    if (index === activeMenuIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function openSection(targetId) {
  playClick();
  currentState = 'CONTENT';
  
  mainMenuOverlay.classList.add('hidden');
  contentSections.forEach(sec => sec.classList.add('hidden'));
  
  contentContainer.classList.remove('hidden');
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    // Start typing effect for section
    const container = targetSection.querySelector('.typewriter-container');
    if (container && sectionContentMap[targetId]) {
      typeWriterHTML(container, sectionContentMap[targetId], 35); // Slowed from 10 to 35
    }
  }
}

function backToMenu() {
  playClick();
  currentState = 'MENU_CHOICE';
  contentContainer.classList.add('hidden');
  mainMenuOverlay.classList.remove('hidden');
  
  // Stop ongoing typing
  isTyping = false;
  clearTimeout(typingInterval);
  
  // Show choices immediately
  oakText.innerHTML = introDialogue[introDialogue.length - 1];
  oakNextArrow.classList.add('hidden');
  oakChoices.classList.remove('hidden');
}

function proceedToMenu() {
  if (currentState === 'TITLE') {
    playClick();
    
    audioIntro.pause();
    audioBg.volume = 0.4;
    audioBg.play().catch(e => console.log(e));
    
    triggerWipeTransition(() => {
      introContainer.classList.add('hidden');
      mainMenuOverlay.classList.remove('hidden');
      currentState = 'MENU_DIALOGUE';
      dialogueStep = 0;
      updateMenu();
      
      playDialogueStep();
    });
  }
}

// --- Event Listeners ---

musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  isMuted = !isMuted;
  
  audioIntro.muted = isMuted;
  audioBg.muted = isMuted;
  
  if (isMuted) {
    musicToggle.innerText = '🔇 MUSIC OFF';
  } else {
    musicToggle.innerText = '🔊 MUSIC ON';
  }
  
  // optionally, we don't play click sound here if they are turning off audio
  if (!isMuted) playClick();
});

// Any click unlocks audio if not already unlocked
document.addEventListener('click', (e) => {
  if (!audioUnlocked) {
    tryPlayIntro();
  }
  // Click to skip typing
  if (isTyping) {
    skipTyping();
  }
});

scene1.addEventListener('click', (e) => {
  if (currentState === 'TITLE') {
    e.stopPropagation();
    proceedToMenu();
  }
});

window.addEventListener('keydown', (e) => {
  if (isTyping && (e.key === 'Enter' || e.key === ' ')) {
    skipTyping();
    return; // Don't trigger other Enter logic if we just skipped text
  }

  if (currentState === 'START_OVERLAY' && e.key === 'Enter') {
    startOverlay.click();
  } else if (currentState === 'BOOT' && e.key === 'Enter' && bootSkipAllowed) {
    proceedToTitle();
  } else if (currentState === 'TITLE' && e.key === 'Enter') {
    proceedToMenu();
  } else if (currentState === 'MENU_DIALOGUE' && (e.key === 'Enter' || e.key === ' ')) {
    advanceDialogue();
  }
  
  if (currentState === 'MENU_CHOICE') {
    if (e.key === 'ArrowDown') {
      activeMenuIndex = (activeMenuIndex + 1) % menuItems.length;
      updateMenu();
      playClick();
    } else if (e.key === 'ArrowUp') {
      activeMenuIndex = (activeMenuIndex - 1 + menuItems.length) % menuItems.length;
      updateMenu();
      playClick();
    } else if (e.key === 'Enter') {
      const target = menuItems[activeMenuIndex].getAttribute('data-target');
      openSection(target);
    }
  }
  
  if (currentState === 'CONTENT' && e.key === 'Backspace') {
    backToMenu();
  }
});


menuItems.forEach((item, index) => {
  item.addEventListener('mouseenter', () => {
    if (currentState === 'MENU' && activeMenuIndex !== index) {
      activeMenuIndex = index;
      updateMenu();
      playClick();
    }
  });
  
  item.addEventListener('click', (e) => {
    if (isTyping) {
      e.stopPropagation();
      return;
    }
    
    if (currentState === 'MENU_CHOICE') {
      const target = item.getAttribute('data-target');
      openSection(target);
    }
  });
});

btnBack.addEventListener('click', backToMenu);

// Do not automatically start sequence; wait for startOverlay click to satisfy browser audio requirements