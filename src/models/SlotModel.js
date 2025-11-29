export class Slot {
  constructor(data = {}) {
    this.index = data.index ?? null;
    this.start = data.start || null;  // "07:00"
    this.end = data.end || null;      // "07:50"
    this.duration = data.duration || this.calculateDuration();
  }

  calculateDuration() {
    if (!this.start || !this.end) return null;
    const [h1, m1] = this.start.split(':').map(Number);
    const [h2, m2] = this.end.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  }

  overlaps(other) {
    return !(this.end <= other.start || this.start >= other.end);
  }

  toJSON() {
    return {
      index: this.index,
      start: this.start,
      end: this.end,
      duration: this.duration
    };
  }
}
