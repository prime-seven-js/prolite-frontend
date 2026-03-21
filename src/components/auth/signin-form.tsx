import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/authService";

/** 
 * Giao diện SigninPage lấy từ Shadcn.
 * Zod: Dùng để validate form.
 * Global State:
 * - useAuthStore → Lưu trữ state liên quan đến Auth.
*/

// Khai báo Schema để Zod validate form.
const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type SigninFormValues = z.infer<typeof signinSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Gán Schema của Zod vào useForm() để validate.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  });

  // Gọi các phương thức của useAuthStore() và useNavigate().
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  // Hàm event khi user submit form
  const onSubmit = async (data: SigninFormValues) => {
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    try {
      const users = await authService.fetchUsers();
      const userExists = users.some(
        (user) => user.email.toLowerCase() === email,
      );
      
      // Mail không tồn tại trên DB.
      if (!userExists) {
        setError("email", {
          message: "This email does not exist.",
        });
        return;
      }

      await signIn(email, password);
      navigate("/");
    } catch (err: unknown) {
      const axiosError = err as {
        response?: {
          status?: number;
        };
      };

      // Đúng mail nhưng sai mật khẩu
      if (axiosError.response?.status === 401) {
        setError("password", {
          message: "Incorrect password.",
        });
        return;
      }
      
      // Lỗi server
      setError("root", {
        message: "Unable to sign in right now. Please try again.",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Image */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="/signin-image.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.75]"
            />
          </div>
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
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Prolite account
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
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="text-center text-sm mt-4  text-muted-foreground">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </a>
            </div>
          </form>
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
