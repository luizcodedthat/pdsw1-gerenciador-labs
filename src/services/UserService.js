import DAOService from './DAOService';
import { User } from '../models/UserModel';

class UserService {
  constructor() {
    this.dao = new DAOService('users');
  }

  async getAllUsers() {
    const docs = await this.dao.getAll();
    return docs.map(doc => new User(doc));
  }

  async getUserById(id) {
    const doc = await this.dao.get(id);
    return new User(doc);
  }

  async getUserByUid(uid) {
    const docs = await this.dao.search("userId", uid);
    if (docs.length === 0) return null;
    return new User(docs[0]);
  }

  async getUserByEmail(email) {
    const docs = await this.dao.search("email", email);
    if (docs.length === 0) return null;
    return new User(docs[0]);
  }

  async createUser(userData) {
    const user = new User(userData);

    if (!user.isValid()) {
      throw new Error("Dados do usuário são inválidos");
    }

    const id = await this.dao.insert(user.toJSON());
    return { id, ...user };
  }

  async updateUser(id, updates) {
    const existing = await this.getUserById(id);
    const updated = new User({ ...existing, ...updates });

    if (!updated.isValid()) {
      throw new Error("Dados atualizados são inválidos");
    }

    await this.dao.update(id, updated.toJSON());
    return updated;
  }

  async deleteUser(id) {
    await this.dao.delete(id);
    return true;
  }
}

export default new UserService();
