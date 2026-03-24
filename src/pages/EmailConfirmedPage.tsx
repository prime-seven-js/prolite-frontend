import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

/**
 * EmailConfirmedPage — trang callback khi user click link xác minh email.
 * Supabase redirect user về đây sau khi xác minh thành công.
 */
const EmailConfirmedPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  /** Auto-redirect về /signin sau countdown */
  useEffect(() => {
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
  }, [navigate]);

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

                  {/* Success Icon */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>

                  {/* Header */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Email Verified!</h1>
                    <p className="text-muted-foreground text-balance">
                      Your email has been successfully verified. You can now
                      sign in to your account.
                    </p>
                  </div>

                  {/* Countdown */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      Redirecting to sign in in {countdown}s...
                    </span>
                  </div>

                  {/* Sign In Button */}
                  <Button
                    onClick={() =>
                      navigate("/signin", { replace: true })
                    }
                    className="w-full"
                  >
                    Sign In Now
                  </Button>
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
