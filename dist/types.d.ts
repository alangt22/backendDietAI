import { z } from "zod";
export declare const DietPlanRequestSchema: z.ZodObject<{
    nome: z.ZodString;
    idade: z.ZodNumber;
    altura_cm: z.ZodNumber;
    peso_kg: z.ZodNumber;
    sexo: z.ZodEnum<{
        masculino: "masculino";
        feminino: "feminino";
    }>;
    nivel_atividade: z.ZodEnum<{
        sedentario: "sedentario";
        "2x_semana": "2x_semana";
        "4x_semana": "4x_semana";
    }>;
    objetivo: z.ZodEnum<{
        perda_de_peso: "perda_de_peso";
        hipertrofia: "hipertrofia";
        manter_massa_muscular: "manter_massa_muscular";
    }>;
}, z.core.$strip>;
export type DietPlanRequest = z.infer<typeof DietPlanRequestSchema>;
//# sourceMappingURL=types.d.ts.map