export class Reservation {
  constructor(data = {}) {
    this.id = data.id || null;
    this.labId = data.labId || null;
    this.authorId = data.authorId || null;
    this.authorName = data.authorName || '';

    this.approved = data.approved || false;
    this.intervals = data.intervals || [];        // lista de horários reservados
    this.date = data.date || null;              // YYYY-MM-DD
    this.description = data.description || '';

    this.createdAt = data.createdAt || null;
  }

  /**
   * Valida se os dados obrigatórios existem
   */
  isValid() {
    if (!this.labId) return false;
    if (!this.authorId) return false;
    if (!this.date) return false;

    if (!Array.isArray(this.intervals) || this.intervals.length < 1 || this.intervals.length >  16) {
      return false;
    }

    return true;
  }

  /**
   * Busca textual por nome do autor ou descrição
   */
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
