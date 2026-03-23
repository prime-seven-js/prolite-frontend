import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";

/**
 * VerifyEmailPage — hiển thị sau khi đăng ký thành công.
 * Thông báo user kiểm tra email để xác minh tài khoản.
 * Có nút "Resend" để gửi lại email xác minh.
 */
const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string })?.email || "";
  const [isResending, setIsResending] = useState(false);

  /** Gửi lại email xác minh qua Supabase */
  const handleResend = async () => {
    if (!email) {
      toast.error("No email found. Please sign up again.");
      return;
    }
    try {
      setIsResending(true);
      await authService.resendVerificationEmail(email);
      toast.success("Verification email sent! Check your inbox.");
    } catch {
      toast.error("Failed to resend email. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-blue dark">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Image */}
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/signup-image.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover brightness-[0.75]"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col items-center gap-6 text-center">
                  {/* Logo */}
                  <img
                    src="/prolite-logo.svg"
                    alt="Prolite Logo"
                    className="mx-auto w-12 h-auto"
                  />

                  {/* Icon */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>

                  {/* Header */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Check your email</h1>
                    <p className="text-muted-foreground text-balance">
                      We've sent a verification link to
                    </p>
                    {email && (
                      <p className="font-semibold text-primary">{email}</p>
                    )}
                    <p className="text-sm text-muted-foreground text-balance mt-2">
                      Click the link in your email to verify your account. If
                      you don't see it, check your spam folder.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={handleResend}
                      disabled={isResending}
                      className="w-full"
                    >
                      <RefreshCw
                        className={`mr-2 h-4 w-4 ${isResending ? "animate-spin" : ""}`}
                      />
                      {isResending
                        ? "Sending..."
                        : "Resend verification email"}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => navigate("/signin")}
                      className="w-full"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-xs text-balance px-6 text-center text-muted-foreground">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={handleResend}
              className="underline underline-offset-4 hover:text-primary"
            >
              resend it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
