import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  guestName: z.string().min(1),
});

export type GuestNameType = z.infer<typeof FormSchema>

interface GuestNameInput {
  children: React.ReactNode;
  handleSubmit: (values: GuestNameType) => Promise<void>;
  setNameInput: React.Dispatch<React.SetStateAction<string>>
  nameInput: string;
}

export default function GuestNameInput({
  children,
  handleSubmit,
  setNameInput,
  nameInput
}: GuestNameInput) {
  const form = useForm<GuestNameType>({
    resolver: zodResolver(FormSchema)
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-4 flex w-full grow flex-col gap-4"
        onChange={() => {
          setNameInput(form.getValues().guestName);
        }}
      >
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-center" htmlFor="guestName">
                Enter as Guest
              </FormLabel>
              <Input
                id="guestName"
                placeholder="name"
                maxLength={20}
                {...field}
                value={nameInput}
                className="text-center"
              />
            </FormItem>
          )}
        ></FormField>
        {children}
      </form>
    </Form>
  );
}
