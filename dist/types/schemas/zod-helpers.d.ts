import { z } from "zod";
export declare function formatZodError(error: z.ZodError): string;
export declare function parseOrThrow<T>(schema: z.ZodType<T>, value: unknown, label: string): T;
//# sourceMappingURL=zod-helpers.d.ts.map