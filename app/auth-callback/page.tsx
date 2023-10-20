"use client";

import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { PiSpinnerBold as Loader } from "react-icons/pi";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  useEffect(() => {
    const getData = async () => {
      const body = JSON.stringify({
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
        avatarImage: user?.imageUrl,
      });

      try {
        const res = await fetch("/api/v1/user/auth", {
          method: "POST",
          body,
        });

        const data = await res.json();
        if (data?.success) {
          router.push(origin ? `/${origin}` : "/");

          toast({
            title: "Login Successful",
          });
        } else {
          router.push("/login");
          toast({
            title: data?.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.log(error);
        toast({
          title: error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    };

    if (user) getData();
  }, [user]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
