import z from "zod";

export const swapperForm = z.object({
  amount: z
    .number("Amount is required")
    .min(1, "Amount must be equal or greater than 1"),
  fromCurrency: z.preprocess(
    (val) => (val === undefined ? 0 : val),
    z.number().refine((val) => val !== 0, {
      message: "Select from currency",
    })
  ),
  toCurrency: z.preprocess(
    (val) => (val === undefined ? 0 : val),
    z.number().refine((val) => val !== 0, {
      message: "Select to currency",
    })
  ),
});

export type SwapperFormInput = z.input<typeof swapperForm>;
export type SwapperFormValues = z.infer<typeof swapperForm>;
