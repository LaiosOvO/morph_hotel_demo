"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";


import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


import { bookingAbi, bookingAddress } from "@/constants";


interface InvestModalProps {
    children: React.ReactNode;
}

const AddRoomModal = ({ children }: InvestModalProps) => {

    const {
        data: hash,
        error,
        isPending,
        writeContractAsync,
      } = useWriteContract();
    


    const formSchema = z.object({
        category: z.any(),
        price: z.any(),
      });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          category: 0,
          price: 0,
        },
      });

      
    const AddRoom = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        try {
        const addRoomTx = await writeContractAsync({
            address: bookingAddress,
            abi: bookingAbi,

            functionName: "addRoom",
            args: [data.category, data.price],
        });

        console.log("room transaction hash:", addRoomTx);
        } catch (err: any) {
        toast.error("Transaction Failed: " + err.message);
        console.log("Transaction Failed: " + err.message);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <div className="flex items-center gap-6 justify-center">
                            <AlertDialogCancel className="border-none">
                                <MoveLeft size={24} />
                            </AlertDialogCancel>
                            <h1>Add a room</h1>
                        </div>
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <div>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(AddRoom)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                    <h1 className="text-[#32393A]">Room Category(0-2)</h1>
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        className="rounded-full"
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            /> 

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">
                                    <h1 className="text-[#32393A]">Price per night</h1>
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        className="rounded-full"
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <Button
                                className="bg-[#007A86] self-center my-8 rounded-full w-full"
                                size="lg"
                                disabled={isPending}
                                type="submit"
                            >
                                {isPending ? "Loading" : "Submit"}
                            </Button>
                        </form>
                    </Form>
                </div>

                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AddRoomModal;