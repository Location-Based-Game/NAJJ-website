import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import getRoom from "@/firebase-actions/getRoom";

const FormSchema = z.object({
  code: z.string(),
});

interface JoinCodeInput {
  children: React.ReactNode;
  codeInput: string;
  setCodeInput: React.Dispatch<React.SetStateAction<string>>;
  setEnableButtons: React.Dispatch<React.SetStateAction<boolean>>;
  callback: () => void;
}

export default function JoinCodeInput({
  children,
  codeInput,
  setCodeInput,
  setEnableButtons,
  callback,
}: JoinCodeInput) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = async () => {
    setEnableButtons(false);

    try {
      await getRoom({ gameId: codeInput });
      callback();
    } catch (error) {
      form.setError("code", { message: "Invalid Code!" });
    }

    setEnableButtons(true);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full grow flex-col items-center"
      >
        <div className="relative flex grow flex-col items-center justify-center gap-4 pb-4">
          <FormField
            control={form.control}
            name="code"
            render={() => (
              <FormItem className="pb-5">
                <FormLabel className="block text-center" htmlFor="join-code">
                  Enter Join Code
                </FormLabel>
                <InputOTP
                  id="join-code"
                  maxLength={4}
                  value={codeInput}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  inputMode="text"
                  autoCapitalize="none"
                  spellCheck="false"
                  onChange={(value) => {
                    setCodeInput(value);
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
                <ErrorMessage
                  errors={form.formState.errors}
                  name={"code"}
                  render={({ message }) => (
                    <div className="absolute w-full text-center text-destructive">
                      {message}
                    </div>
                  )}
                />
              </FormItem>
            )}
          />
        </div>
        {children}
      </form>
    </Form>
  );
}
