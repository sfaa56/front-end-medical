import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { RxCross2 } from "react-icons/rx";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  reason: z.string().min(5, {
    message: "Reason is required but the content too short.",
  }),
});

function RejectForm({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      //   const response = await fetch(
      //     `${process.env.NEXT_PUBLIC_URL_SERVER}/api/admins/${propertyId}/properties/reject`,
      //     {
      //       method: "PUT",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(values),
      //     }
      //   );

      //   if (response.ok) {
      //     toast(
      //       "property rejected successfully",
      //     );
      //     setOpen(false);
      //   }

      toast("Provider rejected successfully");
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          onClick={(e) => e.stopPropagation()}
          className=" hover:cursor-pointer flex items-center gap-1 text-red-500"
        >
          <RxCross2 /> Reject
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] h-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
          <DialogDescription>
            Enter the reason for rejection here..
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* English Name Field */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="min-h-[300px]"
                      placeholder="Enter reason..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="bg-secondary/90 hover:bg-secondary text-white text-sm w-full"
              size="sm"
              type="submit"
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default RejectForm;
