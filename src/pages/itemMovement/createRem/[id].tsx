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
import { toast } from "~/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const itemMovementFormSchema = z.object({
  quantity: z.string().min(1),
  isBoxes: z.boolean().default(false),
  departmentId: z.string().min(1),
});

export default function ItemMovementForm() {
  const form = useForm<z.infer<typeof itemMovementFormSchema>>({
    resolver: zodResolver(itemMovementFormSchema),
    defaultValues: {
      isBoxes: false,
    },
  });

  const departments = api.department.getAll.useQuery();
  const createItemMovement = api.itemMovement.create.useMutation();
  const router = useRouter();
  const itemTypeId = router.query.id as string;

  async function onSubmit(values: z.infer<typeof itemMovementFormSchema>) {
    try {
      await createItemMovement.mutateAsync({
        ...values,
        departmentId: Number(values.departmentId),
        quantity: Number(values.quantity),
        itemMovementTypeId: 1, //Remover é sempre 1
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
          <p className="text-muted-foreground">
            Retirar material do stock e entregar a departamento
          </p>
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
                      Quantidade a ser retirada ao stock
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
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar um departamento..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.data
                          ?.filter((department) => department.id !== 1)
                          .sort((a, b) => {
                            const nameA = a.name.toUpperCase();
                            const nameB = b.name.toUpperCase();
                            if (nameA < nameB) {
                              return -1;
                            }
                            if (nameA > nameB) {
                              return 1;
                            }
                            return 0;
                          })
                          .map((department) => (
                            <SelectItem
                              key={department.id}
                              value={department.id.toString()}
                              id={department.id.toString()}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      O departamento a quem será entregue o material.
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
