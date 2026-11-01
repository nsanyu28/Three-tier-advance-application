const PACKET_SELECTOR = '.packet[data-packet]';
const scheduledPackets = new WeakMap();

export function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function packetElement(stage, name) {
  return stage.querySelector(`.packet[data-packet="${name}"]`);
}

function motionElement(packet) {
  return packet?.querySelector('animateMotion');
}

function clearScheduledPackets(stage) {
  const timers = scheduledPackets.get(stage) || [];
  timers.forEach(window.clearTimeout);
  scheduledPackets.set(stage, []);
}

function schedulePacket(stage, callback, delay) {
  const timers = scheduledPackets.get(stage) || [];
  const timer = window.setTimeout(callback, delay);
  timers.push(timer);
  scheduledPackets.set(stage, timers);
  return timer;
}

export function cancelScheduledPackets(stage) {
  clearScheduledPackets(stage);
}

export function stopPacket(stage, name) {
  const packet = packetElement(stage, name);
  packet?.classList.remove('is-moving', 'static-active');
  try { motionElement(packet)?.endElement(); } catch { /* SVG implementations vary */ }
}

export function stopAllPackets(stage) {
  clearScheduledPackets(stage);
  stage.querySelectorAll(PACKET_SELECTOR).forEach((packet) => {
    packet.classList.remove('is-moving', 'static-active');
    try { motionElement(packet)?.endElement(); } catch { /* SVG implementations vary */ }
  });
  stage.classList.remove('flow-mode');
}

export function playPacket(stage, name, { loop = false } = {}) {
  const packet = packetElement(stage, name);
  if (!packet) return;
  packet.classList.add('is-moving');
  if (prefersReducedMotion()) {
    packet.classList.add('static-active');
    return;
  }
  const motion = motionElement(packet);
  if (!motion) return;
  if (loop) motion.setAttribute('repeatCount', 'indefinite');
  try {
    motion.beginElement();
  } catch {
    packet.classList.add('static-active');
  }
}

export function playPacketsForStep(stage, step) {
  stopAllPackets(stage);
  if (step.id < 4) return;
  if (step.id === 4) playPacket(stage, 'request');
  if (step.id === 5) {
    playPacket(stage, 'request');
    schedulePacket(stage, () => playPacket(stage, 'web'), 650);
    schedulePacket(stage, () => playPacket(stage, 'web-b'), 850);
  }
  if (step.id === 6) {
    schedulePacket(stage, () => playPacket(stage, 'app'), 220);
    schedulePacket(stage, () => playPacket(stage, 'db'), 850);
    schedulePacket(stage, () => playPacket(stage, 'response'), 1500);
    schedulePacket(stage, () => playPacket(stage, 'repl', { loop: true }), 900);
  }
  if (step.id === 7) schedulePacket(stage, () => playPacket(stage, 'update'), 250);
  if (step.id === 8) schedulePacket(stage, () => playPacket(stage, 'intruder'), 350);
  if (step.id === 9) {
    schedulePacket(stage, () => playPacket(stage, 'vpn', { loop: true }), 180);
    schedulePacket(stage, () => playPacket(stage, 'peer', { loop: true }), 650);
  }
}

export function runTrafficFlow(stage, onComplete = () => {}) {
  stopAllPackets(stage);
  stage.classList.add('flow-mode');
  if (prefersReducedMotion()) {
    ['request', 'web', 'web-b', 'app', 'db', 'response'].forEach((name) => playPacket(stage, name));
    onComplete();
    return () => stopAllPackets(stage);
  }
  const sequence = [
    ['request', 0], ['web', 900], ['web-b', 1_100], ['app', 2_000], ['db', 2_700], ['response', 4_100]
  ];
  const timers = sequence.map(([name, delay]) => window.setTimeout(() => playPacket(stage, name), delay));
  timers.push(window.setTimeout(() => {
    stage.classList.remove('flow-mode');
    onComplete();
  }, 6_200));
  return () => {
    timers.forEach(window.clearTimeout);
    stopAllPackets(stage);
  };
}

export function setFailureState(stage, enabled) {
  clearScheduledPackets(stage);
  stage.classList.toggle('is-failure', enabled);
  stage.setAttribute('data-failure', String(enabled));
  stage.querySelector('#statusA')?.replaceChildren(document.createTextNode(enabled ? 'degraded' : 'healthy'));
  stage.querySelector('#statusB')?.replaceChildren(document.createTextNode('healthy'));
  ['#webServerA', '#appServerA', '#rdsWriter', '#natA'].forEach((selector) => stage.querySelector(selector)?.classList.toggle('failure-dimmed', enabled));
  if (enabled) {
    stopPacket(stage, 'intruder');
    schedulePacket(stage, () => playPacket(stage, 'intruder'), 100);
  }
}
