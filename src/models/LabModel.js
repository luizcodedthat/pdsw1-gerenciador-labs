export class Lab {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.name = data.name ?? '';
    this.category = data.category ?? 'Laboratório de Informática';
    this.capacity = data.capacity ?? 0;
    this.local = data.local ?? '';
    this.available = data.available ?? true;
    this.createdAt = data.createdAt ?? null;
  }

  isValid() {
    if (!this.name.trim()) return false;
    if (!this.capacity || this.capacity <= 0) return false;
    return true;
  }

  canBeUsed() {
    return !this.available;
  }

  matchesSearch(searchTerm) {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    const fields = [
      this.name.toLowerCase(),
      this.category.toLowerCase()
    ]

    return fields.some(field => field.includes(term))
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      capacity: this.capacity,
      local: this.local,
      available: this.available,
      createdAt: this.createdAt
    }
  }
}
