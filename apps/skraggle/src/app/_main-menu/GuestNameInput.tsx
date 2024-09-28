import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setGuestName } from "@/state/GuestNameSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";

export const FormSchema = z.object({
  guestName: z.string().min(1),
});

interface GuestNameInput {
  children: React.ReactNode;
  handleSubmit: (values: z.TypeOf<typeof FormSchema>) => Promise<void>;
}

export default function GuestNameInput({
  children,
  handleSubmit,
}: GuestNameInput) {
  const guestName = useSelector((state: RootState) => state.guestName);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      guestName: guestName.name,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-4 flex w-full grow flex-col gap-4"
        onChange={() => {
          dispatch(setGuestName(form.getValues().guestName));
        }}
      >
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-center">
                Enter as Guest
              </FormLabel>
              <Input
                placeholder="name"
                maxLength={20}
                {...field}
                value={guestName.name}
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
