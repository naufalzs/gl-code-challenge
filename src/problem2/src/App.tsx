import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  swapperForm,
  type SwapperFormInput,
  type SwapperFormValues,
} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { Spinner } from "./components/ui/spinner";

interface CurrencyRawData {
  currency: string;
  price: number;
}

interface CurrencyOptions {
  label: string;
  value: number;
  thumbnail: string;
}

function App() {
  // Init State
  const [currencyOptions, setCurrencyOptions] = React.useState<
    CurrencyOptions[] | []
  >([]);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [resultPrice, setResultPrice] = React.useState<number | undefined>(
    undefined
  );
  const resetResult = () => setResultPrice(undefined);

  // Load Data Logic
  const loadData = async () => {
    try {
      const { data } = await axios<CurrencyRawData[]>(
        "https://interview.switcheo.com/prices.json"
      );

      const seen = new Set();
      const res = data
        .filter((item) => {
          if (seen.has(item.currency) || item.price < 0.05) return false;
          seen.add(item.currency);
          return true;
        })
        .map((item) => ({
          label: item.currency,
          value: item.price,
          thumbnail: `${item.currency}.svg`,
        }));
      setCurrencyOptions(res);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  // Action  Logic
  const loadingTimeinms = 1000;
  const processSwap = ({
    amount,
    fromCurrency,
    toCurrency,
  }: {
    amount: number;
    fromCurrency: number;
    toCurrency: number;
  }) => {
    setLoading(true);
    const calc = (amount * fromCurrency) / toCurrency;
    setTimeout(() => {
      toast("Currency has been processed:", {
        position: "top-center",
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });
      setResultPrice(Number(calc.toFixed(5)));
      setLoading(false);
    }, loadingTimeinms);
  };

  // Form Logic
  const { control, handleSubmit, reset } = useForm<
    SwapperFormInput,
    unknown,
    SwapperFormValues
  >({
    resolver: zodResolver(swapperForm),
    defaultValues: {
      amount: undefined,
      fromCurrency: 0,
      toCurrency: 0,
    },
  });

  return (
    <div className="min-h-[100vh]">
      {currencyOptions?.length > 0 ? (
        <Card className="mt-20 max-w-sm mx-auto">
          <CardHeader>
            <CardTitle className="animate-in fade-in slide-in-from-top duration-750 delay-300">
              Currency Swapper
            </CardTitle>
            <CardDescription className="animate-in fade-in slide-in-from-top duration-750 delay-300">
              Swap your currency now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="flex items-start gap-2 animate-in fade-in slide-in-from-top duration-700 delay-250">
                <Controller
                  name="amount"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field className="">
                      <FieldLabel htmlFor="field-amount">Amount</FieldLabel>
                      <Input
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(
                            v === "" || isNaN(Number(v)) ? 0 : Number(v)
                          );
                        }}
                        id="field-amount"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter amount"
                        autoComplete="off"
                        disabled={loading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="fromCurrency"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive">
                      <FieldLabel htmlFor="field-from-currency">
                        From Currency
                      </FieldLabel>
                      <div className="flex gap-2">
                        <Select
                          name={field.name}
                          value={String(field.value)}
                          onValueChange={(val) => {
                            resetResult();
                            field.onChange(Number(val));
                          }}
                          disabled={loading}
                        >
                          <SelectTrigger
                            id="field-from-currency"
                            aria-invalid={fieldState.invalid}
                            className="w-[120px]"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            <SelectItem value={String(0)}>Select</SelectItem>
                            <SelectSeparator />
                            {currencyOptions.map((c) => (
                              <SelectItem
                                key={`${c.label}:${c.value}`}
                                value={String(c.value)}
                              >
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="w-9 h-9 rounded-full border overflow-hidden">
                          <img
                            src={`token/${field.value ? currencyOptions.find((item) => item.value === field.value)?.label : "ATOM"}.svg`}
                            className="w-full h-full object-cover"
                            alt="from currency icon"
                          />
                        </div>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="flex items-start gap-2 animate-in fade-in slide-in-from-top duration-700 delay-300">
                <Field>
                  <FieldLabel
                    htmlFor="field-result"
                    className="text-emerald-800 font-semibold"
                  >
                    Result
                  </FieldLabel>
                  <Input
                    value={resultPrice ?? 0}
                    id="field-result"
                    placeholder="Process First!"
                    autoComplete="off"
                    readOnly
                  />
                  <FieldDescription className="text-xs">
                    This field is read-only
                  </FieldDescription>
                </Field>
                <Controller
                  name="toCurrency"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field orientation="responsive">
                      <FieldLabel htmlFor="field-to-currency">
                        To Currency
                      </FieldLabel>
                      <div className="flex gap-2">
                        <Select
                          name={field.name}
                          value={String(field.value)}
                          onValueChange={(val) => {
                            resetResult();
                            field.onChange(Number(val));
                          }}
                          disabled={loading}
                        >
                          <SelectTrigger
                            id="field-to-currency"
                            aria-invalid={fieldState.invalid}
                            className="w-[120px]"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            <SelectItem value={String(0)}>Select</SelectItem>
                            <SelectSeparator />
                            {currencyOptions.map((c) => (
                              <SelectItem
                                key={`${c.label}:${c.value}`}
                                value={String(c.value)}
                              >
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="w-9 h-9 rounded-full border overflow-hidden">
                          <img
                            src={`token/${field.value ? currencyOptions.find((item) => item.value === field.value)?.label : "ATOM"}.svg`}
                            className="w-full h-full object-cover"
                            alt="to currency icon"
                          />
                        </div>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Field
              orientation="horizontal"
              className="animate-in fade-in slide-in-from-top duration-700 delay-350 "
            >
              <Button
                disabled={loading}
                type="button"
                variant="outline"
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button
                disabled={loading}
                type="submit"
                onClick={handleSubmit(processSwap)}
                className="w-32"
              >
                Submit
                {loading && <Spinner className="size-4 text-white" />}
              </Button>
            </Field>
          </CardFooter>
        </Card>
      ) : (
        <div className="h-[100vh] flex items-center">
          <Spinner className="mx-auto size-20 self-center" />
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default App;
