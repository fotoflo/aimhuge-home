import { login } from './actions'
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import GoogleLoginButton from './components/GoogleLoginButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 grain relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-card/60 backdrop-blur-xl border border-card-border p-8 rounded-2xl shadow-2xl relative z-10 animate-scale-in">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground animate-fade-up">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-muted animate-fade-up delay-1">
            Enter your email to sign in to your dashboard.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 animate-fade-up delay-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>
              {error === 'unauthorized' || error === 'unauthorized_domain'
                ? 'Access denied. The email address provided is not authorized.'
                : error === 'email_required'
                ? 'Please enter an email address.'
                : decodeURIComponent(error)}
            </p>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-500 border border-emerald-500/20 animate-fade-up delay-2">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p>{decodeURIComponent(message)}</p>
          </div>
        )}

        <form className="mt-8 space-y-6 animate-fade-up delay-3" action={login}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Work Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-muted" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@company.com"
                  className="block w-full rounded-lg border border-card-border bg-surface/50 py-3 pl-11 pr-4 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(124,92,252,0.3)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            <span className="flex items-center gap-2">
              Send Magic Link
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </form>

        <div className="mt-6 flex items-center animate-fade-up delay-4">
          <div className="flex-grow border-t border-card-border"></div>
          <span className="mx-4 text-xs uppercase tracking-wider text-muted">Or</span>
          <div className="flex-grow border-t border-card-border"></div>
        </div>

        <div className="mt-6 animate-fade-up delay-5">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  )
}
