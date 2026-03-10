import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "./ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router"
import { useAuthStore } from "@/stores/useAuthStore"

const signinSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})
type SigninFormValues = z.infer<typeof signinSchema>

export function SigninForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<SigninFormValues>({
        resolver: zodResolver(signinSchema),
    })

    const { signIn } = useAuthStore();
    const navigate = useNavigate();

    const onSubmit = async (data: SigninFormValues) => {
        const { email, password } = data;
        try {
            await signIn(email, password);
            navigate("/");
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError("password", {
                    message: "Your email or password is invalid !",
                })
            }
            console.log("Login failed");
        }
    }

    return (
        <div className={cn("flex w-full flex-col gap-5 sm:gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="/src/assets/signin-image.jpg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover brightness-[0.75]"
                        />
                    </div>
                    <form className="p-6 md:p-8" noValidate onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            {/* Header - Logo */}
                            <div className="flex flex-col gap-2 justify-center text-center">
                                <img src="/src/assets/prolite-logo.svg" alt="Prolite Logo" className="mx-auto w-12 h-auto" />
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-balance">Login to your Prolite account</p>
                            </div>
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="block text-sm">Email<sup className="text-red-400">*</sup></Label>
                                <Input id="email" placeholder="Email" type="email" {...register("email")} />
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>
                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="block text-sm">Password<sup className="text-red-400">*</sup></Label>
                                <Input id="password" placeholder="Password" type="password" {...register("password")} />
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                            </div>
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
            <div className="px-4 text-center text-xs text-balance text-muted-foreground sm:px-6 *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
