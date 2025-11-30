import DAOService from "@/services/DAOService";
import { Comment } from "@/models/Comment";

export class CommentService {
  constructor() {
    this.dao = new DAOService("comments");
  }

  async create(comment) {
    if (!(comment instanceof Comment)) {
      throw new Error("CommentService.create espera uma instância de Comment");
    }

    if (!comment.isValid()) throw new Error("Objeto Comment inválido");

    const id = await this.dao.insert(comment.toObject());
    return new Comment({ id, ...comment.toObject() });
  }

  async getAll() {
    const items = await this.dao.getAll();
    return items.map(data => new Comment(data));
  }

  async getByLab(labId) {
    const items = await this.dao.search("labId", labId);
    return items.map(data => new Comment(data));
  }

  async update(id, fields) {
    await this.dao.update(id, fields);
  }

  async delete(id) {
    await this.dao.delete(id);
  }
}
