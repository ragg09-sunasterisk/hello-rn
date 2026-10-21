// Deliberately freezes the JS thread. For demos only — never ship this.
export function blockJsThread(ms: number) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // busy-wait: no timers, no renders, no JS-driven animation frames
  }
}
