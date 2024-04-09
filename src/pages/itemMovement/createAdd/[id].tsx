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
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { toast } from "~/components/ui/use-toast";

const itemMovementFormSchema = z.object({
  quantity: z.string().min(1),
  isBoxes: z.boolean().default(false),
  expireDate: z.date().optional(),
});

export default function ItemMovementForm() {
  const form = useForm<z.infer<typeof itemMovementFormSchema>>({
    resolver: zodResolver(itemMovementFormSchema),
    defaultValues: {
      isBoxes: false,
    },
  });
  const createItemMovement = api.itemMovement.create.useMutation();
  const router = useRouter();
  const itemTypeId = router.query.id as string;

  async function onSubmit(values: z.infer<typeof itemMovementFormSchema>) {
    try {
      await createItemMovement.mutateAsync({
        ...values,
        departmentId: 1, //Adicionar é sempre ao stock (1)
        quantity: Number(values.quantity),
        itemMovementTypeId: 2, //Adicionar é sempre (2)
        itemTypeId: Number(itemTypeId),
      });
      await router.push("/items/");
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
      }
    }
  }

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Movimentação de Stock
          </h2>
          <p className="text-muted-foreground">Adicionar ao stock.</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-8"
            >
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input placeholder="XX" {...field} />
                    </FormControl>
                    <FormDescription>
                      Quantidade a ser adicionada ao stock
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isBoxes"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Quantidades apresentadas são caixas</FormLabel>
                      <FormDescription>
                        Caso a quantidade indicada seja representativa do número
                        de caixas, selecionar esta opção.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expireDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de validade</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Escolher uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Esta data será utlizada para emitir alertas. Campo não
                      obrigatório.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submeter</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
