'use server'

import { getSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) {
    return redirect('/login?error=email_required')
  }

  // Strictly enforce allowed emails at the action level
  const isAllowed = email.endsWith('@priyoshop.com') || email.toLowerCase() === 'fotoflo@gmail.com';
  if (!isAllowed) {
    return redirect('/login?error=unauthorized')
  }

  const supabase = await getSupabaseServer()
  const headersList = await headers()
  
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const origin = `${protocol}://${host}`

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/login?error=${encodeURIComponent('Failed to send magic link: ' + error.message)}`)
  }

  return redirect('/login?message=Check your email for the login link')
}
