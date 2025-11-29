export const RECURRENCY_TYPE = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly'
}

export class Recurrence {

  constructor(data = {}) {
    this.id = data.id || null;

    this.labId = data.labId || null;
    this.authorId = data.authorId || null;

    this.intervals = data.intervals || []; 
    // Exemplo:
    // [
    //   { startSlot: 3, endSlot: 5 },
    //   { startSlot: 7, endSlot: 8 }
    // ]

    this.type = data.type || RECURRENCY_TYPE.WEEKLY; 


    this.fromDate = data.from || null;
    this.untilDate = data.until || null;

    this.daysOfWeek = data.daysOfWeek || [];  
    // [1,3,5] para seg/qua/sex  (1 = Monday)

    this.createdAt = data.createdAt || new Date();
  }

  isValid() {
    if (!this.labId) return false;
    if (!this.authorId) return false;

    if (!this.from || !this.until) return false;

    if (!Array.isArray(this.intervals) || this.intervals.length === 0) return false;

    const intervalsValid = this.intervals.every(
      i => i.startSlot != null && i.endSlot != null && i.startSlot <= i.endSlot
    );
    if (!intervalsValid) return false;

    if (this.type === RECURRENCY_TYPE.WEEKLY && (!this.daysOfWeek || this.daysOfWeek.length === 0)) {
        return false
    }

    return true;
  }

  includesDate(dateString) {
    const date = new Date(dateString);
    const start = new Date(this.from);
    const end = new Date(this.until);

    if (date < start || date > end) return false;

    if (this.type === RECURRENCY_TYPE.DAILY) return true;

    if (this.type === RECURRENCY_TYPE.WEEKLY) {
      const weekday = date.getDay(); // 0 = domingo
      const normalized = weekday === 0 ? 7 : weekday; // 1–7
      return this.daysOfWeek.includes(normalized);
    }

    if (this.type === RECURRENCY_TYPE.MONTHLY) {
      return date.getDate() === new Date(this.from).getDate();
    }

    return false;
  }

  toJSON() {
    return {
      labId: this.labId,
      authorId: this.authorId,
      intervals: this.intervals,
      type: this.type,
      from: this.from,
      until: this.until,
      daysOfWeek: this.daysOfWeek,
      createdAt: this.createdAt
    };
  }
}
