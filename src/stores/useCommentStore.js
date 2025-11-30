import { defineStore } from "pinia";
import CommentService from "@/services/CommentService";

export const useCommentStore = defineStore("comments", {
    state: () => ({
        commentsByLab: {},    // { labId: [] }
        lastFetched: {},      // { labId: timestamp }

        loading: false,
    }),

    actions: {
        async loadComments(labId) {
            const FIVE_MIN = 5 * 60 * 1000;
            const now = Date.now();

            if (
                this.lastFetched[labId] &&
                now - this.lastFetched[labId] < FIVE_MIN
            ) {
                return;
            }

            this.loading = true;
            const comments = await CommentService.getByLab(labId);

            this.commentsByLab[labId] = comments;
            this.lastFetched[labId] = now;
            this.loading = false;
        },

        async addComment(comment) {
            const created = await CommentService.create(comment);

            if (!this.commentsByLab[comment.labId
            ]) {
                this.commentsByLab[comment.labId] = [];
            }

            this.commentsByLab[comment.labId].push(created);
        }
    }
});
