import { SigninForm } from "@/components/signin-form"

export default function SignInPage() {
    return (
        <div className="relative flex min-h-svh w-full items-center justify-center overflow-y-auto bg-gradient-blue px-4 py-6 sm:px-6 md:px-10 dark">
            <div className="w-full max-w-sm md:max-w-4xl">
                <SigninForm />
            </div>
        </div>
    )
}
