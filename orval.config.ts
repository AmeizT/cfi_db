import { defineConfig } from "orval"

export default defineConfig({
    api: {
        input: "http://localhost:8000/api/v1/auth/schema/",
        output: {
            target: "./src/dal/types/index.ts",
            client: "fetch",
            mode: "tags",
        },
    },
    types: {
        input: "http://localhost:8000/api/v1/auth/schema/",
        output: {
            target: "./src/dal/schemas/index.ts",
            client: "zod", 
            mode: "tags",
        },
    },
});