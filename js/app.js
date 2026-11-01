import { architecture, architectureStats, glossary } from './architecture.js';
import { getStep, steps } from './steps.js';
import { cancelScheduledPackets, playPacketsForStep, runTrafficFlow, setFailureState, stopAllPackets } from './animations.js';

const body = document.body;
const stage = document.querySelector('#architectureDiagram');
const stepNav = document.querySelector('#stepNav');
const progressText = document.querySelector('#progressText');
const progressBar = document.querySelector('#progressBar');
const stageTitle = document.querySelector('#stageTitle');
const stageSubtitle = document.querySelector('#stageSubtitle');
const diagramStepLabel = document.querySelector('#diagramStepLabel');
const diagramContextText = document.querySelector('#diagramContextText');
const captionText = document.querySelector('#captionText');
const explanationNumber = document.querySelector('#explanationNumber');
const explanationStep = document.querySelector('#explanationStep');
const explanationTag = document.querySelector('#explanationTag');
const explanationTitle = document.querySelector('#explanationTitle');
const analogyBadge = document.querySelector('#analogyBadge');
const plainText = document.querySelector('#plainText');
const technicalText = document.querySelector('#technicalText');
const watchText = document.querySelector('#watchText');
const modeNote = document.querySelector('#modeNote');
const pauseButton = document.querySelector('#pauseButton');
const resetButton = document.querySelector('#resetButton');
const trafficButton = document.querySelector('#trafficButton');
const failureButton = document.querySelector('#failureButton');
const failureNote = document.querySelector('#failureNote');
const themeToggle = document.querySelector('#themeToggle');
const glossaryModal = document.querySelector('#glossaryModal');
const glossaryOpen = document.querySelector('#glossaryOpen');
const glossaryClose = document.querySelector('#glossaryClose');
const glossarySearch = document.querySelector('#glossarySearch');
const glossaryList = document.querySelector('#glossaryList');
const toast = document.querySelector('#toast');

const state = {
  step: 1,
  mode: 'beginner',
  theme: 'dark',
  autoplay: true,
  failure: false,
  flowStop: null,
  autoplayTimer: null,
  toastTimer: null
};

function padStep(value) {
  return String(value).padStart(2, '0');
}

function renderStepNav() {
  stepNav.innerHTML = steps.map((step) => `
    <button class="step-button${step.id === state.step ? ' is-active' : ''}" type="button" data-step="${step.id}" aria-current="${step.id === state.step ? 'step' : 'false'}">
      <span class="step-number">${padStep(step.id)}</span>
      <span class="step-copy"><span class="step-title">${step.title}</span><span class="step-description">${step.subtitle}</span></span>
    </button>
  `).join('');
  stepNav.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => setStep(Number(button.dataset.step)));
  });
}

function updateRevealState() {
  stage.dataset.step = String(state.step);
  stage.querySelectorAll('[data-reveal]').forEach((group) => {
    const revealAt = Number(group.dataset.reveal);
    group.classList.toggle('is-visible', revealAt <= state.step);
  });
}

function updateExplanation(step) {
  const technicalMode = state.mode === 'technical';
  explanationNumber.textContent = padStep(step.id);
  explanationStep.textContent = padStep(step.id);
  explanationTag.textContent = technicalMode ? `${step.tag} lens` : step.tag;
  explanationTitle.textContent = step.title;
  analogyBadge.textContent = step.analogy;
  plainText.textContent = technicalMode ? step.reveal : step.plain;
  technicalText.textContent = step.technical;
  watchText.textContent = technicalMode ? step.technicalWatch : step.watch;
  modeNote.textContent = technicalMode ? 'Technical terminology on' : 'Plain-language mode';
}

function updateHeader(step) {
  stageTitle.textContent = step.id === 1 ? 'A city, a campus, and a request on the move.' : step.title;
  stageSubtitle.textContent = state.failure && state.step >= 2
    ? 'AZ 1a is degraded; healthy resources in AZ 1b remain available where configured.'
    : step.subtitle;
  diagramStepLabel.textContent = `Step ${step.id} of ${steps.length}`;
  diagramContextText.textContent = step.title;
  captionText.textContent = state.failure ? 'Failure mode dims AZ 1a; follow the healthy path in AZ 1b.' : step.caption;
}

function updateProgress() {
  progressText.textContent = `${state.step} / ${steps.length}`;
  progressBar.style.width = `${(state.step / steps.length) * 100}%`;
}

function setStep(nextStep, { fromAutoplay = false } = {}) {
  const step = getStep(nextStep);
  state.flowStop?.();
  state.flowStop = null;
  state.step = step.id;
  renderStepNav();
  updateRevealState();
  updateExplanation(step);
  updateHeader(step);
  updateProgress();
  playPacketsForStep(stage, step);
  if (!fromAutoplay) restartAutoplay();
}

function restartAutoplay() {
  window.clearInterval(state.autoplayTimer);
  if (!state.autoplay) return;
  state.autoplayTimer = window.setInterval(() => {
    const next = state.step >= steps.length ? 1 : state.step + 1;
    setStep(next, { fromAutoplay: true });
  }, 5000);
}

function setAutoplay(enabled) {
  state.autoplay = enabled;
  pauseButton.setAttribute('aria-pressed', String(!enabled));
  pauseButton.title = enabled ? 'Pause autoplay' : 'Resume autoplay';
  pauseButton.querySelector('span:not(.sr-only)').textContent = enabled ? 'Ⅱ' : '▶';
  if (enabled) restartAutoplay();
  else {
    window.clearInterval(state.autoplayTimer);
    cancelScheduledPackets(stage);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function toggleFailure() {
  state.failure = !state.failure;
  if (state.failure && state.step < 8) setStep(8);
  setFailureState(stage, state.failure);
  failureButton.innerHTML = state.failure
    ? '<span aria-hidden="true">✓</span> Restore AZ 1a'
    : '<span aria-hidden="true">⚠</span> Simulate AZ 1a failure';
  failureNote.textContent = state.failure
    ? 'Conceptual simulation active: health checks keep the AZ 1b path highlighted; AWS failover depends on each resource.'
    : 'Conceptual simulation: health checks highlight the surviving path; actual failover depends on each AWS resource.';
  updateHeader(getStep(state.step));
  showToast(state.failure ? 'AZ 1a is degraded. Watch healthy AZ 1b continue where configured.' : 'AZ 1a restored. Both buildings are healthy again.');
}

function updateTheme() {
  body.dataset.theme = state.theme;
  themeToggle.setAttribute('aria-label', state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.title = state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  themeToggle.querySelector('span').textContent = state.theme === 'dark' ? '◐' : '◑';
}

function openGlossary() {
  glossaryModal.hidden = false;
  glossarySearch.value = '';
  renderGlossary('');
  window.setTimeout(() => glossarySearch.focus(), 0);
}

function closeGlossary() {
  glossaryModal.hidden = true;
  glossaryOpen.focus();
}

function renderGlossary(query = '') {
  const normalized = query.trim().toLowerCase();
  const matches = glossary.filter((item) => `${item.term} ${item.definition} ${item.analogy} ${item.role} ${item.tags}`.toLowerCase().includes(normalized));
  if (!matches.length) {
    glossaryList.innerHTML = '<p class="empty-state">No terms match that search. Try “subnet”, “reader”, or “security”.</p>';
    return;
  }
  glossaryList.innerHTML = matches.map((item) => `
    <article class="glossary-item">
      <header><h3>${item.term}</h3><span class="role">${item.role}</span></header>
      <p><strong>Definition:</strong> ${item.definition}</p>
      <p><strong>Analogy:</strong> ${item.analogy}</p>
    </article>
  `).join('');
}

function bindEvents() {
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      body.dataset.mode = state.mode;
      document.querySelectorAll('.mode-button').forEach((modeButton) => modeButton.classList.toggle('is-active', modeButton === button));
      updateExplanation(getStep(state.step));
      showToast(state.mode === 'technical' ? 'Technical labels and caveats are now foregrounded.' : 'Plain-language analogies are now foregrounded.');
    });
  });

  pauseButton.addEventListener('click', () => setAutoplay(!state.autoplay));
  resetButton.addEventListener('click', () => {
    state.failure = false;
    setFailureState(stage, false);
    failureButton.innerHTML = '<span aria-hidden="true">⚠</span> Simulate AZ 1a failure';
    failureNote.textContent = 'Conceptual simulation: health checks highlight the surviving path; actual failover depends on each AWS resource.';
    setStep(1);
    setAutoplay(true);
    showToast('Lesson reset to the Region and VPC foundation.');
  });
  failureButton.addEventListener('click', toggleFailure);
  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    updateTheme();
  });
  trafficButton.addEventListener('click', () => {
    state.flowStop?.();
    state.flowStop = runTrafficFlow(stage, () => showToast('Traffic flow complete: response returned from the data tier.'));
    showToast('Following the request from the internet to RDS and back.');
  });
  glossaryOpen.addEventListener('click', openGlossary);
  glossaryClose.addEventListener('click', closeGlossary);
  glossarySearch.addEventListener('input', (event) => renderGlossary(event.target.value));
  glossaryModal.addEventListener('click', (event) => {
    if (event.target === glossaryModal) closeGlossary();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !glossaryModal.hidden) closeGlossary();
  });
}

function init() {
  // Keep the canonical data available to the educational surface even when a future module extends it.
  document.documentElement.dataset.azCount = String(architectureStats().availabilityZones);
  document.documentElement.dataset.vpcCidr = architecture.vpc.cidr;
  renderStepNav();
  bindEvents();
  updateTheme();
  setStep(1, { fromAutoplay: true });
  setAutoplay(true);
}

init();
