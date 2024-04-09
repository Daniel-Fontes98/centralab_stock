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

const suppliersFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email().optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  site: z.string().optional(),
});

export default function SuppliersForm() {
  const form = useForm<z.infer<typeof suppliersFormSchema>>({
    resolver: zodResolver(suppliersFormSchema),
  });
  const createSupplier = api.supplier.create.useMutation();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof suppliersFormSchema>) {
    try {
      await createSupplier.mutateAsync({
        ...values,
      });
      await router.push("/suppliers/");
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
          <h2 className="text-2xl font-bold tracking-tight">Fornecedor</h2>
          <p className="text-muted-foreground">
            Criar um novo fornecedor de material.
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
                            <Input placeholder="Centralab" {...field} />
                          </FormControl>
                          <FormDescription>
                            Este será o nome do fornecedor, não são permitidos
                            fornecedores com nomes iguais.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="fornecedor@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Este será o email de contacto do fornecedor. Campo
                            não obrigatório.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Morada</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua do XXX nº YY" {...field} />
                          </FormControl>
                          <FormDescription>
                            Morada da loja do fornecedor. Campo não obrigatório.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="9....." {...field} />
                          </FormControl>
                          <FormDescription>
                            Número de contacto do fornecedor. Campo não
                            obrigatório.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="site"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site</FormLabel>
                          <FormControl>
                            <Input placeholder="www.site.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Site do fornecedor. Campo não obrigatório.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">Criar fornecedor</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
