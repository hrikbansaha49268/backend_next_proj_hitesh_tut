import { z } from "zod";

export const AcceptMsg = z.object({
    acceptMessages: z.boolean(),
});