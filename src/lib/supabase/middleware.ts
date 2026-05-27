import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  canAccessRoute,
  isProtectedAppPath,
} from '@/lib/permissions'
import { getUserProfile } from '@/services/users'

function isProtectedRoute(pathname: string) {
  return isProtectedAppPath(pathname)
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const profile = user ? await getUserProfile(supabase, user.id) : null

  if (!user && isProtectedRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = profile ? '/dashboard' : '/unauthorized'
    if (!profile) url.searchParams.set('reason', 'no_profile')
    return NextResponse.redirect(url)
  }

  if (pathname === '/') {
    const url = request.nextUrl.clone()
    if (!user) {
      url.pathname = '/login'
    } else if (!profile) {
      url.pathname = '/unauthorized'
      url.searchParams.set('reason', 'no_profile')
    } else {
      url.pathname = '/dashboard'
    }
    return NextResponse.redirect(url)
  }

  if (pathname === '/unauthorized') {
    return supabaseResponse
  }

  if (user && isProtectedRoute(pathname)) {
    if (!profile) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      url.searchParams.set('reason', 'no_profile')
      return NextResponse.redirect(url)
    }

    if (!canAccessRoute(profile.role, pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
  }

  if (!user && pathname === '/unauthorized') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
