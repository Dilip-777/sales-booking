import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign In to your account</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">User Name</Label>
              <Input id="username" placeholder="Enter User Name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmpassword">Confirm Password</Label>
              <Input
                id="confirmpassword"
                type="password"
                placeholder="Confirm password"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Button disabled={isLoading} className="w-full">
                {isLoading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 animate-spin"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                )}
                Create Account
              </Button>
              <p className="px-8 py-3 text-center text-sm text-muted-foreground">
                Already have an Account?{" "}
                <Link
                  href="/signin"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  SignIn
                </Link>{" "}
              </p>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
