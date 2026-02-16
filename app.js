// Tyler Mullins Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {

// ============================================
// GAMING EASTER EGGS SYSTEM
// ============================================

// 1. KONAMI CODE EASTER EGG
// Classic: ↑ ↑ ↓ ↓ ← → ← → B A
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];
let konamiIndex = 0;
let konamiActivated = false;

document.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    
    if (key === konamiCode[konamiIndex] || e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            activateKonamiMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateKonamiMode() {
    if (konamiActivated) {
        deactivateKonamiMode();
        return;
    }
    
    konamiActivated = true;
    
    // Visual celebration
    createConfetti();
    
    // Play achievement sound (visual feedback instead)
    showKonamiNotification();
    
    // Apply gaming theme
    document.body.classList.add('konami-mode');
    
    // Add matrix-style background effect
    createMatrixEffect();
    
    // Apply rainbow animation to header
    applyRainbowEffect();
    
    // Award achievement
    unlockAchievement('konami', '🎮 Konami Master', 'You found the legendary code!');
}

function deactivateKonamiMode() {
    konamiActivated = false;
    document.body.classList.remove('konami-mode');
    
    const matrix = document.getElementById('matrix-canvas');
    if (matrix) matrix.remove();
    
    const header = document.querySelector('.header');
    if (header) header.style.animation = '';
    
    showNotification('🎮 Konami Mode Deactivated', 'Press the code again to reactivate!');
}

function showKonamiNotification() {
    const notification = document.createElement('div');
    notification.className = 'konami-notification';
    notification.innerHTML = `
        <div class="konami-notification__content">
            <div class="konami-notification__icon">🎮</div>
            <div class="konami-notification__text">
                <strong>KONAMI CODE ACTIVATED!</strong>
                <p>Gaming mode enabled</p>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

function createConfetti() {
    const colors = ['#21808d', '#32b8c6', '#f54559', '#e68161', '#3b82f6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = '0s';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

function createMatrixEffect() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function drawMatrix() {
        if (!konamiActivated) return;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#32b8c6';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        requestAnimationFrame(drawMatrix);
    }
    
    drawMatrix();
}

function applyRainbowEffect() {
    const header = document.querySelector('.header');
    if (header) {
        header.style.animation = 'rainbow-bg 3s linear infinite';
    }
}

// 2. ACHIEVEMENT SYSTEM
const achievements = {
    explorer: { id: 'explorer', icon: '🗺️', title: 'Explorer', description: 'Visited all sections', unlocked: false },
    konami: { id: 'konami', icon: '🎮', title: 'Konami Master', description: 'Found the secret code', unlocked: false },
    speedrunner: { id: 'speedrunner', icon: '⚡', title: 'Speed Runner', description: 'Viewed site in under 30 seconds', unlocked: false },
    dedicated: { id: 'dedicated', icon: '⏰', title: 'Dedicated Visitor', description: 'Spent 5+ minutes on site', unlocked: false },
    formMaster: { id: 'formMaster', icon: '📧', title: 'Connected', description: 'Sent a message', unlocked: false }
};

// Load saved achievements from localStorage if available
try {
    const saved = localStorage.getItem('portfolio_achievements');
    if (saved) {
        const savedAchievements = JSON.parse(saved);
        Object.keys(savedAchievements).forEach(key => {
            if (achievements[key]) {
                achievements[key].unlocked = savedAchievements[key].unlocked;
            }
        });
    }
} catch (e) {
    console.log('Could not load achievements (localStorage not available)');
}

// Track visited sections
const visitedSections = new Set();
const sections = ['about', 'experience', 'skills', 'certifications', 'education', 'contact'];

function checkSectionVisits() {
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
            
            if (isVisible && !visitedSections.has(sectionId)) {
                visitedSections.add(sectionId);
                
                if (visitedSections.size === sections.length && !achievements.explorer.unlocked) {
                    unlockAchievement('explorer', '🗺️ Explorer', 'You\'ve explored every section!');
                }
            }
        }
    });
}

// Time-based achievements
let timeOnSite = 0;
let speedrunChecked = false;

setInterval(() => {
    timeOnSite++;
    
    if (timeOnSite === 30 && !speedrunChecked) {
        speedrunChecked = true;
        if (visitedSections.size >= 3 && !achievements.speedrunner.unlocked) {
            unlockAchievement('speedrunner', '⚡ Speed Runner', 'Checked out the site in record time!');
        }
    }
    
    if (timeOnSite === 300 && !achievements.dedicated.unlocked) {
        unlockAchievement('dedicated', '⏰ Dedicated Visitor', 'Thanks for spending time here!');
    }
}, 1000);

function unlockAchievement(id, title, description) {
    if (achievements[id] && !achievements[id].unlocked) {
        achievements[id].unlocked = true;
        
        // Save to localStorage
        try {
            localStorage.setItem('portfolio_achievements', JSON.stringify(achievements));
        } catch (e) {
            console.log('Could not save achievement');
        }
        
        // Show notification
        showAchievementNotification(achievements[id]);
        
        // Update achievement display if visible
        updateAchievementDisplay();
    }
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification__icon">${achievement.icon}</div>
        <div class="achievement-notification__content">
            <div class="achievement-notification__title">Achievement Unlocked!</div>
            <div class="achievement-notification__name">${achievement.title}</div>
            <div class="achievement-notification__desc">${achievement.description}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

function updateAchievementDisplay() {
    const achievementPanel = document.getElementById('achievement-panel');
    if (achievementPanel) {
        const unlockedCount = Object.values(achievements).filter(a => a.unlocked).length;
        const totalCount = Object.keys(achievements).length;
        
        achievementPanel.innerHTML = `
            <div class="achievement-panel__header">
                <span>🏆 Achievements: ${unlockedCount}/${totalCount}</span>
            </div>
            <div class="achievement-panel__list">
                ${Object.values(achievements).map(a => `
                    <div class="achievement-item ${a.unlocked ? 'unlocked' : 'locked'}">
                        <span class="achievement-item__icon">${a.unlocked ? a.icon : '🔒'}</span>
                        <div class="achievement-item__info">
                            <div class="achievement-item__title">${a.unlocked ? a.title : '???'}</div>
                            <div class="achievement-item__desc">${a.unlocked ? a.description : 'Locked'}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Create achievement panel
function createAchievementPanel() {
    const panel = document.createElement('div');
    panel.id = 'achievement-panel';
    panel.className = 'achievement-panel';
    document.body.appendChild(panel);
    updateAchievementDisplay();
    
    // Toggle visibility
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'achievement-toggle';
    toggleBtn.innerHTML = '🏆';
    toggleBtn.title = 'View Achievements';
    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('visible');
    });
    document.body.appendChild(toggleBtn);
}

// 3. RETRO CURSOR TRAIL
let cursorTrailEnabled = false;
const trailParticles = [];
const maxTrailParticles = 15;

function createCursorTrail(e) {
    if (!cursorTrailEnabled) return;
    
    const particle = document.createElement('div');
    particle.className = 'cursor-trail';
    particle.style.left = e.pageX + 'px';
    particle.style.top = e.pageY + 'px';
    
    // Random pixel colors (retro gaming palette)
    const colors = ['#21808d', '#32b8c6', '#f54559', '#e68161'];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(particle);
    trailParticles.push(particle);
    
    if (trailParticles.length > maxTrailParticles) {
        const oldParticle = trailParticles.shift();
        oldParticle.remove();
    }
    
    setTimeout(() => {
        particle.remove();
        const index = trailParticles.indexOf(particle);
        if (index > -1) trailParticles.splice(index, 1);
    }, 500);
}

// Enable cursor trail in Konami mode or on hover over specific areas
document.addEventListener('mousemove', createCursorTrail);

// Auto-enable cursor trail in Konami mode
setInterval(() => {
    cursorTrailEnabled = konamiActivated;
}, 100);

// Add toggle for cursor trail
const trailToggle = document.createElement('button');
trailToggle.className = 'trail-toggle';
trailToggle.innerHTML = '✨';
trailToggle.title = 'Toggle Cursor Trail';
trailToggle.addEventListener('click', () => {
    cursorTrailEnabled = !cursorTrailEnabled;
    trailToggle.classList.toggle('active', cursorTrailEnabled);
    showNotification(
        cursorTrailEnabled ? '✨ Cursor Trail Enabled' : '✨ Cursor Trail Disabled',
        ''
    );
});
document.body.appendChild(trailToggle);

// Initialize achievement system
createAchievementPanel();

// Track section visits on scroll
window.addEventListener('scroll', checkSectionVisits);
checkSectionVisits(); // Initial check

// Notification helper
function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification__title">${title}</div>
        ${message ? `<div class="notification__message">${message}</div>` : ''}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add CSS for all Easter eggs
const style = document.createElement('style');
style.textContent = `
/* Konami Mode Effects */
.konami-mode {
    animation: hue-rotate 10s linear infinite;
}

@keyframes hue-rotate {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

@keyframes rainbow-bg {
    0% { background: linear-gradient(90deg, #ff0000, #ff7f00); }
    16% { background: linear-gradient(90deg, #ff7f00, #ffff00); }
    33% { background: linear-gradient(90deg, #ffff00, #00ff00); }
    50% { background: linear-gradient(90deg, #00ff00, #0000ff); }
    66% { background: linear-gradient(90deg, #0000ff, #4b0082); }
    83% { background: linear-gradient(90deg, #4b0082, #9400d3); }
    100% { background: linear-gradient(90deg, #9400d3, #ff0000); }
}

/* Confetti */
.confetti {
    position: fixed;
    width: 10px;
    height: 10px;
    top: -10px;
    z-index: 9999;
    animation: confetti-fall linear forwards;
}

@keyframes confetti-fall {
    to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

/* Konami Notification */
.konami-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #21808d, #32b8c6);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.konami-notification.show {
    transform: translateX(0);
}

.konami-notification__content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.konami-notification__icon {
    font-size: 48px;
    animation: bounce 1s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.konami-notification__text strong {
    display: block;
    font-size: 18px;
    margin-bottom: 5px;
}

.konami-notification__text p {
    margin: 0;
    opacity: 0.9;
}

/* Achievement System */
.achievement-panel {
    position: fixed;
    top: 80px;
    right: -350px;
    width: 320px;
    max-height: 500px;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 9998;
    transition: right 0.3s ease;
    overflow: hidden;
}

.achievement-panel.visible {
    right: 20px;
}

.achievement-panel__header {
    background: var(--color-primary);
    color: var(--color-btn-primary-text);
    padding: 12px 16px;
    font-weight: 600;
    font-size: 16px;
}

.achievement-panel__list {
    padding: 12px;
    max-height: 400px;
    overflow-y: auto;
}

.achievement-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    margin-bottom: 8px;
    background: var(--color-secondary);
    border-radius: 8px;
    transition: all 0.2s;
}

.achievement-item.unlocked {
    background: rgba(var(--color-success-rgb), 0.1);
    border: 1px solid rgba(var(--color-success-rgb), 0.3);
}

.achievement-item.locked {
    opacity: 0.5;
}

.achievement-item__icon {
    font-size: 32px;
    line-height: 1;
}

.achievement-item__title {
    font-weight: 600;
    color: var(--color-text);
    font-size: 14px;
}

.achievement-item__desc {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-top: 2px;
}

.achievement-toggle {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: var(--color-primary);
    color: white;
    font-size: 28px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 9997;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.achievement-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0,0,0,0.3);
}

.achievement-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #21808d, #32b8c6);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10001;
    min-width: 320px;
    transform: translateY(200px);
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.achievement-notification.show {
    transform: translateY(0);
    opacity: 1;
}

.achievement-notification__icon {
    font-size: 64px;
    text-align: center;
    margin-bottom: 10px;
    animation: celebration 0.6s ease;
}

@keyframes celebration {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.2) rotate(-10deg); }
    75% { transform: scale(1.2) rotate(10deg); }
}

.achievement-notification__content {
    text-align: center;
}

.achievement-notification__title {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.9;
    margin-bottom: 8px;
}

.achievement-notification__name {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 5px;
}

.achievement-notification__desc {
    font-size: 14px;
    opacity: 0.9;
}

/* Cursor Trail */
.cursor-trail {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    pointer-events: none;
    z-index: 9999;
    animation: trail-fade 0.5s ease-out forwards;
    box-shadow: 0 0 4px rgba(255,255,255,0.5);
}

@keyframes trail-fade {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(0.5);
        opacity: 0;
    }
}

.trail-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: var(--color-secondary);
    color: var(--color-text);
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9996;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.trail-toggle.active {
    background: var(--color-primary);
    color: var(--color-btn-primary-text);
}

.trail-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
}

/* General Notification */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    z-index: 10002;
    min-width: 280px;
    transform: translateX(400px);
    transition: transform 0.3s ease;
}

.notification.show {
    transform: translateX(0);
}

.notification__title {
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 4px;
}

.notification__message {
    font-size: 14px;
    color: var(--color-text-secondary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .achievement-panel {
        width: calc(100% - 40px);
        right: -100%;
    }
    
    .achievement-panel.visible {
        right: 20px;
    }
    
    .achievement-toggle,
    .trail-toggle {
        width: 48px;
        height: 48px;
        font-size: 24px;
    }
    
    .achievement-toggle {
        bottom: 80px;
    }
    
    .konami-notification,
    .achievement-notification,
    .notification {
        width: calc(100% - 40px);
        right: 20px;
        min-width: auto;
    }
}
`;
document.head.appendChild(style);

// ============================================
// ORIGINAL PORTFOLIO CODE (PRESERVED)
// ============================================

// Mobile Navigation Toggle
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');
const navbarLinks = document.querySelectorAll('.navbar__link');

navbarToggle.addEventListener('click', function() {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navbarLinks.forEach(link => {
    link.addEventListener('click', function() {
        navbarToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideNav = navbarMenu.contains(event.target) || navbarToggle.contains(event.target);
    if (!isClickInsideNav && navbarMenu.classList.contains('active')) {
        navbarToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
navbarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingNavLink = document.querySelector(`.navbar__link[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navbarLinks.forEach(link => link.classList.remove('active'));
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }
        }
    });
}

// Add CSS for active nav link
const navStyle = document.createElement('style');
navStyle.textContent = `
.navbar__link.active {
    color: var(--color-primary);
    position: relative;
}
.navbar__link.active::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-primary);
    border-radius: 1px;
}
`;
document.head.appendChild(navStyle);

// Update active link on scroll
window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink(); // Initial call

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.timeline__item, .skill__item, .certification__item, .highlight');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-on-scroll');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Initial call

// Contact form handling with Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                
                // Unlock achievement
                unlockAchievement('formMaster', '📧 Connected', 'You sent a message!');
            } else {
                const data = await response.json();
                if (data.errors) {
                    showFormMessage('There was an error with your submission. Please check your form and try again.', 'error');
                } else {
                    showFormMessage('Oops! There was a problem submitting your form. Please try again.', 'error');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('There was a problem sending your message. Please try again later.', 'error');
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

// Form message display function
function showFormMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message status status--${type}`;
    messageDiv.textContent = message;
    
    contactForm.parentNode.insertBefore(messageDiv, contactForm);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Form validation styling
const formInputs = document.querySelectorAll('.form-control');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.checkValidity()) {
            this.classList.remove('invalid');
            this.classList.add('valid');
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');
        }
    });
    
    input.addEventListener('input', function() {
        this.classList.remove('invalid', 'valid');
    });
});

// Add validation styles
const validationStyles = document.createElement('style');
validationStyles.textContent = `
.form-control.valid {
    border-color: var(--color-success);
}
.form-control.invalid {
    border-color: var(--color-error);
}
.form-message {
    margin-bottom: var(--space-16);
    padding: var(--space-12) var(--space-16);
    border-radius: var(--radius-base);
}
`;
document.head.appendChild(validationStyles);

// Parallax effect for hero section
function parallaxEffect() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }
}

window.addEventListener('scroll', parallaxEffect);

// Add typing animation to hero subtitle
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing animation after a short delay
setTimeout(() => {
    const heroSubtitle = document.querySelector('.hero__subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        typeWriter(heroSubtitle, originalText, 75);
    }
}, 500);

// Add smooth reveal animation for timeline items
const timelineObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${entry.target.dataset.delay || 0}ms`;
                entry.target.classList.add('animate-on-scroll');
            }
        });
    },
    { threshold: 0.1 }
);

// Observe timeline items with staggered delays
document.querySelectorAll('.timeline__item').forEach((item, index) => {
    item.dataset.delay = index * 100;
    timelineObserver.observe(item);
});

// Add hover effect for skill items
document.querySelectorAll('.skill__item').forEach(skill => {
    skill.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    skill.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Navbar background opacity on scroll
function handleNavbarScroll() {
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 50) {
        header.style.backgroundColor = 'var(--color-surface)';
        header.style.boxShadow = 'var(--shadow-sm)';
    } else {
        header.style.backgroundColor = 'var(--color-surface)';
        header.style.boxShadow = 'none';
    }
}

window.addEventListener('scroll', handleNavbarScroll);
handleNavbarScroll(); // Initial call

// Add loading animation
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in-out';

window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

console.log('Tyler Mullins Portfolio loaded successfully!');
console.log('🎮 Easter Eggs Available:');
console.log('   - Try the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A');
console.log('   - Explore all sections to unlock achievements');
console.log('   - Toggle cursor trail with the ✨ button');

});
