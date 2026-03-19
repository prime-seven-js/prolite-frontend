// From shadcn
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
// React-router Hook & Global state
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router"

// Use zod to validate sign up form
const signupSchema = z.object({
  email: z.email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
})
type SignupFormValues = z.infer<typeof signupSchema>


export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  // Zod variables
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  // Use React-router Hook & Global state
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  // Navigate to SignInPage when registering successfully
  const onSubmit = async (data: SignupFormValues) => {
    const { email, username, password } = data;
    await signUp(email, username, password);

    navigate("/signin");
    console.log(data);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Header - Logo */}
              <div className="flex flex-col gap-2 justify-center text-center">
                <img src="/prolite-logo.svg" alt="Prolite Logo" className="mx-auto w-12 h-auto" />
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">Enter your email below to create your account</p>
              </div>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm">Email<sup className="text-red-400">*</sup></Label>
                <Input id="email" placeholder="Email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="block text-sm">Username<sup className="text-red-400">*</sup></Label>
                <Input id="username" placeholder="Username" {...register("username")} />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm">Password<sup className="text-red-400">*</sup></Label>
                <Input id="password" placeholder="Password" type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </div>
            {/* Sign in if already having an account */}
            <div className="text-center text-sm mt-4 text-muted-foreground">
              Already have an account?{" "}
              <a
                href="/signin"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign in
              </a>
            </div>
          </form>
          {/* Image */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="/signup-image.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.75]"
            />
          </div>
        </CardContent>
      </Card>
      {/* Footer */}
      <div className="text-xs text-muted-foregroundtext-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offetset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
