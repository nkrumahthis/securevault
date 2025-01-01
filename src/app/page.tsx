'use client'

import { useState } from 'react'
import { AnimatedBackground } from '@/components/background/animated-background'
import { TopNavigation } from '@/components/navigation/top-navigation'
import { HeroSection } from '@/components/pages/landing-page/hero-section'
import { SecureVaultForm } from '@/components/pages/landing-page/secure-vault-form'
import { TrustBadges } from '@/components/pages/landing-page/trust-badges'
import { ViewMessage } from '@/components/pages/landing-page/view-message'
import { BottomNavigation } from '@/components/navigation/bottom-navigation'

export default function Home() {
  const [link, setLink] = useState('')

  return (
    <main className="min-h-screen relative font-sans tracking-tighter mb-24">
      <AnimatedBackground />
      <div className="relative z-10">
        <TopNavigation />
        <div className="container mx-auto md:py-2 px-4">
          <>
            <HeroSection />
            <SecureVaultForm setLink={setLink}/>
            <TrustBadges />
          </>
        </div>
        <BottomNavigation />
      </div>
    </main>
  )
}

