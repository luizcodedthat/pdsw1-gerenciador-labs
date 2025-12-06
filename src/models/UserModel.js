export const USER_ROLES = {
  STUDENT: 'student',
  PROFESSOR: 'professor',
  ADMIN: 'admin'
};

export class User {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.userId = data.userId ?? null;
    this.name = data.name ?? '';
    this.email = data.email ?? '';
    this.picture = data.picture ?? '',
    this.accountType = data.accountType ?? USER_ROLES.STUDENT;
  }

  isValid() {
    if (!this.userId) return false;
    if (!this.name.trim()) return false;
    if (!this.email.trim()) return false;
    return true;
  }

  toJSON() {
    return {
      uid: this.userId,
      name: this.name,
      email: this.email,
      picture: this.picture,
      accountType: this.accountType
    };
  }
};
