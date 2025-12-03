export class Comment {

    constructor (data = {}) {
        this.id = data.id,
        this.labId = data.labId,
        this.authorId = data.authorId,
        this.authorName = data.authorName,
        this.content = data.content,
        this.upvotes = data.upvotes || []
        this.createdAt = data.createdAt || new Date()

    }

    isValid() {
        if (!this.labId) return false;
        if (!this.authorId) return false;
        if (!this.content.trim()) return false;

        return true;
    }

    userHasUpvoted(user) {
        if (this.upvotes.find((upvote) => user.id == upvote.authorId)) return true;

        return false
    }

    toJSON() {
        return {
            labId: this.labId,
            authorId: this.authorId,
            authorName: this.authorName,
            content: this.content,
            upvotes: this.upvotes
        }
    }

}

