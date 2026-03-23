import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/authService";

/**
 * Giao diện SignupPage lấy từ Shadcn.
 * Zod: Dùng để validate form.
 *
 * Flow đăng ký:
 * 1. Kiểm tra email/username đã tồn tại trong DB chưa.
 * 2. Gọi Supabase Auth để tạo tài khoản chờ xác minh email.
 * 3. Lưu pending signup info vào localStorage.
 * 4. Navigate sang /verify-email.
 * 5. Sau khi user verify email → EmailConfirmedPage sẽ gọi /register tạo DB account.
 */

// Khai báo Schema để Zod validate form.
const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});
type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Gán Schema của Zod vào useForm() để validate.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();

  // Hàm event khi user submit form.
  const onSubmit = async (data: SignupFormValues) => {
    const email = data.email.trim().toLowerCase();
    const username = data.username.trim();
    const password = data.password;

    try {
      // Kiểm tra email/username đã tồn tại trong DB chưa
      const users = await authService.fetchUsers();
      const emailExists = users.some(
        (user) => user.email.toLowerCase() === email,
      );
      const usernameExists = users.some(
        (user) => user.username.toLowerCase() === username.toLowerCase(),
      );

      if (emailExists) {
        setError("email", {
          message: "This email is already registered.",
        });
        return;
      }

      if (usernameExists) {
        setError("username", {
          message: "This username is already taken.",
        });
        return;
      }

      // Chỉ đăng ký trên Supabase Auth (chưa tạo account trong DB)
      await authService.signUpWithSupabase(email, password);

      // Lưu thông tin đăng ký vào localStorage để EmailConfirmedPage dùng
      localStorage.setItem(
        "pending_signup",
        JSON.stringify({ email, username, password }),
      );

      navigate("/verify-email", { state: { email } });
    } catch (err: unknown) {
      const supabaseError = err as { message?: string };
      const errorMessage = supabaseError.message?.toLowerCase() ?? "";

      if (errorMessage.includes("already registered") || errorMessage.includes("already been registered")) {
        setError("email", {
          message: "This email is already registered.",
        });
        return;
      }

      // Lỗi server
      setError("root", {
        message: "Unable to create your account right now. Please try again.",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              {/* Header - Logo */}
              <div className="flex flex-col gap-2 justify-center text-center">
                <img
                  src="/prolite-logo.svg"
                  alt="Prolite Logo"
                  className="mx-auto w-12 h-auto"
                />
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your email below to create your account
                </p>
              </div>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm">
                  Email<sup className="text-red-400">*</sup>
                </Label>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="block text-sm">
                  Username<sup className="text-red-400">*</sup>
                </Label>
                <Input
                  id="username"
                  placeholder="Username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm">
                  Password<sup className="text-red-400">*</sup>
                </Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {errors.root && (
                <p className="text-sm text-red-500">{errors.root.message}</p>
              )}
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
  );
}
