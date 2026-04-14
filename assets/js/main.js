// Smooth scrolling handled by CSS scroll-behavior;  
// kleines Skript für mobile Nav und Fade-In-Effekte

// Text-to-Speech Konfiguration
const synth = window.speechSynthesis;
let isSpeaking = false;
let currentUtterance = null;

function getAllTextContent() {
  // Sammelt alle wichtigen Texte von der Seite
  const texts = [];
  
  // Hero-Bereich
  const heroTitle = document.querySelector('.hero-title')?.textContent || '';
  const heroSubtitle = document.querySelector('.hero-subtitle')?.textContent || '';
  const heroDesc = document.querySelector('.hero-description')?.textContent || '';
  
  if (heroTitle) texts.push(heroTitle);
  if (heroSubtitle) texts.push(heroSubtitle);
  if (heroDesc) texts.push(heroDesc);
  
  // About-Bereich
  const aboutHeading = document.querySelector('#about h2')?.textContent || '';
  const aboutText = document.querySelector('.about-text')?.textContent || '';
  if (aboutHeading) texts.push(aboutHeading);
  if (aboutText) texts.push(aboutText);
  
  // Cards-Bereich
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const title = card.querySelector('h3')?.textContent || '';
    const description = card.querySelector('p:first-of-type')?.textContent || '';
    if (title) texts.push(title);
    if (description) texts.push(description);
  });
  
  return texts.join(' ');
}

function toggleSpeech() {
  const button = document.getElementById('speakToggle');
  
  if (isSpeaking) {
    synth.cancel();
    isSpeaking = false;
    button.classList.remove('active');
    button.textContent = '🔊';
    return;
  }
  
  const textContent = getAllTextContent();
  
  if (!textContent.trim()) {
    console.log('Kein Text verfügbar');
    return;
  }
  
  isSpeaking = true;
  button.classList.add('active');
  button.textContent = '⏸️';
  
  currentUtterance = new SpeechSynthesisUtterance(textContent);
  currentUtterance.lang = 'de-DE';
  currentUtterance.rate = 1;
  currentUtterance.pitch = 1;
  currentUtterance.volume = 1;
  
  currentUtterance.onend = () => {
    isSpeaking = false;
    button.classList.remove('active');
    button.textContent = '🔊';
  };
  
  currentUtterance.onerror = (event) => {
    console.error('Fehler bei der Vorlesung:', event.error);
    isSpeaking = false;
    button.classList.remove('active');
    button.textContent = '🔊';
  };
  
  synth.speak(currentUtterance);
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const speakButton = document.getElementById('speakToggle');

  // Mobile Navigation Toggle
  toggle?.addEventListener('click', () => {
    links.classList.toggle('show');
  });

  // Vorlesefunktion
  speakButton?.addEventListener('click', toggleSpeech);

  // Fade-in beim Scrollen
  const observers = document.querySelectorAll('.fade-in');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  observers.forEach(el => io.observe(el));

  // Gallery Modal
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalClose = document.querySelector('.modal-close');
  const galleryImages = document.querySelectorAll('.gallery-item img');

  galleryImages.forEach(img => {
    img.addEventListener('click', (e) => {
      modal.classList.add('active');
      modalImage.src = e.target.src;
      modalImage.alt = e.target.alt;
    });
  });

  modalClose?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // AirPlay / Cast button for Safari on Apple devices
  const castButton = document.getElementById('castButton');
  if (castButton && 'webkitShowPlaybackTargetPicker' in window) {
    // show button when API available
    castButton.style.display = 'inline-block';
    castButton.addEventListener('click', () => {
      window.webkitShowPlaybackTargetPicker();
    });
    // optional: listen for availability events to enable/disable
    window.addEventListener('webkitplaybacktargetavailabilitychanged', (event) => {
      if (event.availability === 'available') {
        castButton.disabled = false;
      } else {
        castButton.disabled = true;
      }
    });
  }

  // make cards expandable on click (useful for touch devices)
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // close others first
      cards.forEach(c => {
        if (c !== card) {
          c.classList.remove('expanded');
          const d = c.querySelector('.card-details');
          if (d) {
            d.style.maxHeight = null;
            d.style.opacity = '0';
          }
        }
      });

      // toggle clicked
      card.classList.toggle('expanded');
      const details = card.querySelector('.card-details');
      if (details) {
        if (card.classList.contains('expanded')) {
          details.style.maxHeight = details.scrollHeight + 'px';
          details.style.opacity = '1';
        } else {
          details.style.maxHeight = null;
          details.style.opacity = '0';
        }
      }
    });
  });
});