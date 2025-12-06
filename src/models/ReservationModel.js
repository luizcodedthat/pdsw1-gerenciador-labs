export class Reservation {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.labId = data.labId ?? null;
    this.authorId = data.authorId ?? null;
    this.authorName = data.authorName ?? '';

    this.approved = data.approved ?? false;
    this.intervals = data.intervals ?? [];
    this.date = data.date ?? null;
    this.description = data.description ?? '';

    this.createdAt = data.createdAt ?? null;
  }

  isValid() {
    if (!this.labId) return false;
    if (!this.authorId) return false;
    if (!this.date) return false;

    if (!Array.isArray(this.intervals) || this.intervals.length < 1 || this.intervals.length > 16) {
      return false;
    }

    return true;
  }

  toJSON() {
    return {
      labId: this.labId,
      authorId: this.authorId,
      authorName: this.authorName,
      approved: this.approved,
      intervals: this.intervals,
      date: this.date,
      description: this.description,
      createdAt: this.createdAt
    };
  }


  matchesSearch(searchTerm) {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    const fields = [
      this.authorName.toLowerCase(),
      this.description.toLowerCase()
    ];

    return fields.some(field => field.includes(term));
  }
}
