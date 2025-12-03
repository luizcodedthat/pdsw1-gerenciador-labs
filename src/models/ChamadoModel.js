export class Chamado {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.authorId = data.authorId ?? null;
    this.labId = data.labId ?? null;
    this.titulo = data.titulo ?? "";
    this.descricao = data.descricao ?? "";
    this.status = data.status ?? "aberto";
    this.createdAt = data.createdAt ?? Date.now();
    this.comentario = data.comentario ?? "";

  }

  isValid() {
    if (!this.titulo?.trim()) return false;
    if (!this.descricao?.trim()) return false;
    if (!this.labId) return false;
    return true;
  }

  matchesSearch(searchTerm) {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const fields = [
      this.titulo || "",
      this.descricao || "",
      this.status || ""
    ].map(v => v.toString().toLowerCase());
    return fields.some(field => field.includes(term));
  }


  toJSON() {
    return {
      authorId: this.authorId,
      labId: this.labId,
      titulo: this.titulo,
      descricao: this.descricao,
      status: this.status,
      createdAt: this.createdAt,
      comentario: this.comentario
    };
  }
}
