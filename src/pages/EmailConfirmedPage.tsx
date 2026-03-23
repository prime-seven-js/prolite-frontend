import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { authService } from "@/services/authService";

/**
 * EmailConfirmedPage — trang callback khi user click link xác minh email.
 * Supabase redirect user về đây sau khi xác minh thành công.
 *
 * Flow:
 * 1. Đọc pending_signup từ localStorage (lưu từ lúc đăng ký).
 * 2. Gọi backend /register để tạo tài khoản trong DB.
 * 3. Xóa pending_signup khỏi localStorage.
 * 4. Hiển thị thành công và tự redirect về /signin sau 5 giây.
 * 5. Nếu không có pending_signup → hiển thị lỗi yêu cầu đăng ký lại.
 */
const EmailConfirmedPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const hasRun = useRef(false);

  /** Tạo tài khoản trong DB khi trang load */
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const createAccount = async () => {
      try {
        const pendingData = localStorage.getItem("pending_signup");
        if (!pendingData) {
          setStatus("error");
          setErrorMessage(
            "No signup data found. Please sign up again from the original device.",
          );
          return;
        }

        const { email, username, password } = JSON.parse(pendingData);

        // Gọi backend /register để tạo tài khoản trong DB
        await authService.signUp(email, username, password);

        // Xóa pending data sau khi tạo thành công
        localStorage.removeItem("pending_signup");
        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMessage(
          "Failed to create your account. Please try signing up again.",
        );
        // Xóa pending data nếu thất bại để tránh retry lỗi
        localStorage.removeItem("pending_signup");
      }
    };

    createAccount();
  }, []);

  /** Auto-redirect về /signin sau countdown (chỉ khi success) */
  useEffect(() => {
    if (status !== "success") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/signin", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, navigate]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-blue dark">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col items-center gap-6 text-center">
                  {/* Logo */}
                  <img
                    src="/prolite-logo.svg"
                    alt="Prolite Logo"
                    className="mx-auto w-12 h-auto"
                  />

                  {/* Loading State */}
                  {status === "loading" && (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">
                          Setting up your account...
                        </h1>
                        <p className="text-muted-foreground text-balance">
                          Please wait while we finalize your registration.
                        </p>
                      </div>
                    </>
                  )}

                  {/* Success State */}
                  {status === "success" && (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">Email Verified!</h1>
                        <p className="text-muted-foreground text-balance">
                          Your email has been successfully verified and your
                          account has been created. You can now sign in.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>
                          Redirecting to sign in in {countdown}s...
                        </span>
                      </div>
                      <Button
                        onClick={() =>
                          navigate("/signin", { replace: true })
                        }
                        className="w-full"
                      >
                        Sign In Now
                      </Button>
                    </>
                  )}

                  {/* Error State */}
                  {status === "error" && (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">
                          Something went wrong
                        </h1>
                        <p className="text-muted-foreground text-balance">
                          {errorMessage}
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <Button
                          onClick={() => navigate("/signup")}
                          className="w-full"
                        >
                          Sign Up Again
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => navigate("/signin")}
                          className="w-full"
                        >
                          Back to Sign In
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

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
          <div className="text-xs text-balance px-6 text-center text-muted-foreground">
            Having trouble?{" "}
            <a
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Try signing up again
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmedPage;
