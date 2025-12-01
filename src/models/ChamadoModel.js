export class Chamado {
  constructor(data = {}) {
    this.authorId = data.authorId || null;
    this.labId = data.labId || null;          // laboratório relacionado
    this.titulo = data.titulo || "";
    this.descricao = data.descricao || "";
    this.status = data.status || "aberto";    // aberto | em_andamento | fechado
    this.createdAt = data.createdAt || Date.now();
  }

  isValid() {
    if (!this.titulo.trim()) return false;
    if (!this.descricao.trim()) return false;
    if (!this.labId) return false;
    return true;
  }

  matchesSearch(searchTerm) {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();

    const fields = [
      this.titulo.toLowerCase(),
      this.descricao.toLowerCase(),
      this.status.toLowerCase()
    ];

    return fields.some(field => field.includes(term));
  }

  toJSON() {
    return {
      authorId: this.authorId,
      labId: this.labId,
      titulo: this.titulo,
      descricao: this.descricao,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}
