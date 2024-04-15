import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect } from "react";

const itemTypeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome tem de ter no mínimo dois caracteres.",
  }),
  unitPrice: z.number().min(0),
  boxQuantity: z.number().min(1),
  alertMin: z.number().min(1),
  supplierId: z.string().min(1),
});

export default function ItemTypeForm() {
  const router = useRouter();
  const itemId = router.query.id as string;
  const itemInfo = api.itemType.getById.useQuery({ id: Number(itemId) });
  const updateItem = api.itemType.update.useMutation();
  const suppliers = api.supplier.getAll.useQuery();

  const form = useForm<z.infer<typeof itemTypeFormSchema>>({
    resolver: zodResolver(itemTypeFormSchema),
  });

  useEffect(() => {
    if (itemInfo.data) {
      const { name, unitPrice, boxQuantity, alertMin, supplierId } =
        itemInfo.data;
      form.reset({
        name: name ?? "",
        unitPrice: unitPrice,
        boxQuantity: boxQuantity,
        alertMin: alertMin,
        supplierId: supplierId.toString(),
      });
    }
  }, [itemInfo.data]);

  async function onSubmit(values: z.infer<typeof itemTypeFormSchema>) {
    try {
      await updateItem.mutateAsync({
        ...values,
        supplierId: Number(values.supplierId),
        id: Number(itemId),
      });
      await router.push("/items");
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        toast({
          title: "Erro",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{err.message}</code>
            </pre>
          ),
        });
      } else {
        console.error("Unknow error occurred:", err);
      }
    }
  }

  if (itemInfo.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Item</h2>
          <p className="text-muted-foreground">
            Actualizar informações referentes a este item.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="flex-1">
            <div className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className=" space-y-8"
                >
                  <div className="grid grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Exame X" {...field} />
                          </FormControl>
                          <FormDescription>
                            Este será o nome do item, não são permitidos items
                            com nomes iguais.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="boxQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade numa caixa</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="XXX"
                              {...field}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Esta será a quantidade de unidades presente numa
                            caixa.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unitPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço por unidade</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="XXX"
                              {...field}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Este será o preço de cada unidade. Por favor
                            introduzir o preço unitário e não o preço de cada
                            caixa.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="alertMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Mínimo de Alerta</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="XXX"
                              {...field}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Valor a partir do qual será lançado um alerta para
                            se reforçar o stock.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="supplierId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fornecedor</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar uma fornecedor..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {suppliers.data?.map((supplier) => (
                                <SelectItem
                                  key={supplier.id}
                                  value={supplier.id.toString()}
                                  id={supplier.id.toString()}
                                >
                                  {supplier.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            O fornecedor deste item.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">Actualizar Item</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
