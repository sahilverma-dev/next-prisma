"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../providers/auth-providers";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useClerk } from "@clerk/nextjs";

const Header = () => {
  const { user, setUser } = useAuth();
  const { signOut } = useClerk();

  return (
    <div className="w-full border-b p-4">
      <div className="flex w-full mx-auto max-w-3xl items-center justify-between">
        <Link href={"/"} className="text-2xl font-bold ">
          Next Prisma Demo
        </Link>
        <div className="flex items-center gap-2">
          {!user ? (
            <Link
              className={buttonVariants({ variant: "default" })}
              href={"/login"}
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                className={buttonVariants({ variant: "default" })}
                href={"/create"}
              >
                Create
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <Avatar>
                      <AvatarImage src={user.avatarImage} alt={user.name} />
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href={`/user/${user.id}`}
                      className={buttonVariants({
                        variant: "ghost",
                        className: "w-full mb-1",
                      })}
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Button
                      variant={"destructive"}
                      size={"sm"}
                      className="w-full"
                      onClick={() => {
                        signOut(() => {
                          setUser(null);
                          localStorage.removeItem("user");
                        });
                      }}
                    >
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
