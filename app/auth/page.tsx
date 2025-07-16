import { AuthForms } from "@/components/auth-forms"

export default function AuthPage() {
  return (
    <div className="container px-4 py-12 mx-auto flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <AuthForms />
      </div>
    </div>
  )
}
