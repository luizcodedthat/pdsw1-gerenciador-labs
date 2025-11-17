import { defineStore } from "pinia";
import { LabService } from "@/services/LabService";

export const useLabStore = defineStore("labs", {
    state: () => ({
        labs: [],
        loading: false
    }),

    actions: {
        async loadLabs() {
            this.loading = true;
            this.labs = await LabService.getAll();
            this.loading = false;
        },

        async addLab(lab) {
            const created = await LabService.create(lab);
            this.labs.push(created);
        }
    }
});
