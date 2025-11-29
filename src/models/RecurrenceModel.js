export class Recurrence {

  constructor(data = {}) {
    this.id = data.id || null;

    // Essencial
    this.labId = data.labId || null;
    this.authorId = data.authorId || null;

    // Intervalos (mesma estrutura das reservas)
    this.intervals = data.intervals || []; 
    // Exemplo:
    // [
    //   { startSlot: 3, endSlot: 5 },
    //   { startSlot: 7, endSlot: 8 }
    // ]

    // Tipo da recorrência
    this.type = data.type || 'weekly'; 
    // daily | weekly | monthly

    // Datas de início e fim
    this.from = data.from || null;   // "2025-02-01"
    this.until = data.until || null; // "2025-06-30"

    // Para recorrências semanais
    this.daysOfWeek = data.daysOfWeek || [];  
    // [1,3,5] para seg/qua/sex  (1 = Monday)

    this.createdAt = data.createdAt || new Date();
  }

  /**
   * Valida a estrutura da recorrência
   */
  isValid() {
    if (!this.labId) return false;
    if (!this.authorId) return false;

    if (!this.from || !this.until) return false;

    if (!Array.isArray(this.intervals) || this.intervals.length === 0) return false;

    // Validação dos intervalos
    const intervalsValid = this.intervals.every(
      i => i.startSlot != null && i.endSlot != null && i.startSlot <= i.endSlot
    );
    if (!intervalsValid) return false;

    if (this.type === 'weekly' && (!this.daysOfWeek || this.daysOfWeek.length === 0)) {
        return false
    }

    return true;
  }

  /**
   * Verifica se contém uma data específica na recorrência
   */
  includesDate(dateString) {
    const date = new Date(dateString);
    const start = new Date(this.from);
    const end = new Date(this.until);

    if (date < start || date > end) return false;

    if (this.type === 'daily') return true;

    if (this.type === 'weekly') {
      const weekday = date.getDay(); // 0 = domingo
      const normalized = weekday === 0 ? 7 : weekday; // 1–7
      return this.daysOfWeek.includes(normalized);
    }

    if (this.type === 'monthly') {
      return date.getDate() === new Date(this.from).getDate();
    }

    return false;
  }

  /**
   * Estrutura para salvar na Firestore
   */
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
