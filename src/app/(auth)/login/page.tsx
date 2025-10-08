'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('')
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/chat')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Geometric floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute opacity-20 animate-drift ${
              i % 3 === 0 ? 'w-4 h-4 bg-white rounded-full' :
              i % 3 === 1 ? 'w-6 h-1 bg-indigo-300 rounded-full' :
              'w-2 h-2 bg-pink-300 rounded-full'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main login card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-500 ease-out relative overflow-hidden">
          {/* Glassmorphism overlay with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5 rounded-3xl"></div>
          
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
          
          <div className="relative z-10">
            {/* Header with animated text */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent animate-fade-in">
                Welcome Back
              </h1>
              <p className="text-white/70 text-lg animate-fade-in animation-delay-300">
                Sign in to continue your journey
              </p>
            </div>

            {/* Login form */}
            <div className="space-y-6">
              {/* Email field */}
              <div className="relative group">
                <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  focusedField === 'email' || email ? 'text-xs text-indigo-300 -top-2 bg-gradient-to-r from-indigo-900/80 to-transparent px-2 rounded' : 'text-white/70 top-4'
                }`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Password field */}
              <div className="relative group">
                <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  focusedField === 'password' || password ? 'text-xs text-indigo-300 -top-2 bg-gradient-to-r from-indigo-900/80 to-transparent px-2 rounded' : 'text-white/70 top-4'
                }`}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <button className="text-indigo-300 hover:text-indigo-200 text-sm font-medium transition-colors duration-300 hover:underline">
                  Forgot Password?
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-shake">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 px-4">
                  {/*<span className="text-white/60 text-sm">or</span>*/}
                </div>
              </div>

              {/* Social login button */}
              {/*<button className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm group relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>*/}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/60">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/signup')}
                  className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors duration-300 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-50 animate-bounce animation-delay-1500"></div>
        <div className="absolute top-1/4 -right-8 w-6 h-6 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-full opacity-60 animate-pulse animation-delay-3000"></div>
      </div>

      <style jsx>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(20px) rotate(90deg); }
          50% { transform: translateY(-10px) translateX(-20px) rotate(180deg); }
          75% { transform: translateY(-20px) translateX(10px) rotate(270deg); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        
        .animate-drift { animation: drift 20s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-shake { animation: shake 0.6s ease-in-out; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}