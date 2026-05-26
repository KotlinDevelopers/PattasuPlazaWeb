'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/lib/store'
import { useAppConfig } from '@/hooks/useFirestore'
import SplashScreen     from '@/components/shared/SplashScreen'
import LoginScreen      from '@/components/shared/LoginScreen'
import MaintenanceScreen from '@/components/shared/MaintenanceScreen'

type Phase = 'splash' | 'login' | 'app'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [phase,   setPhase]   = useState<Phase>('splash')
  const { setUser, setLoading } = useAuthStore()
  const { config }              = useAppConfig()

  // Listen to Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        setUser({ uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [setUser, setLoading])

  const handleSplashComplete = () => {
    const user = auth.currentUser
    setPhase(user ? 'app' : 'login')
  }

  const handleLoginSuccess = () => setPhase('app')

  // Show maintenance if enabled
  if (phase === 'app' && config?.maintenanceMode) {
    return <MaintenanceScreen message={config.maintenanceMessage}/>
  }

  return (
    <>
      {phase === 'splash' && <SplashScreen onComplete={handleSplashComplete}/>}
      {phase === 'login'  && <LoginScreen  onSuccess={handleLoginSuccess}/>}
      {phase === 'app'    && <>{children}</>}
    </>
  )
}
