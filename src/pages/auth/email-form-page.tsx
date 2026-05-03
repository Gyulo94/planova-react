import EmailForm from "../../features/auth/components/email-form";

export default function EmailFormPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 md:px-10">
      <div className="flex w-full justify-center max-w-sm flex-col gap-6">
        <EmailForm />
      </div>
    </main>
  );
}
