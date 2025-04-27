import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../stores/auth'
import { Hero } from './Hero'
import { Features } from './Features'
import { HowItWorks } from './HowItWorks'
import { Testimonials } from './Testimonials'
import { Footer } from './Footer'

// Navigation pour les utilisateurs non connectés
const publicNavigation = [
  { name: 'Fonctionnalités', href: '/features' },
  { name: 'Comment ça marche', href: '/how-it-works' },
  { name: 'Tarifs', href: '/pricing' },
  { name: 'Témoignages', href: '/testimonials' },
  { name: 'CGU', href: '/cgu.html' },
]

// Ce composant est obsolète. Utilisez JobNexAILanding à la place.
// // Ce composant est obsolète. Utilisez JobNexAILanding à la place.
// export function LandingPage() {
// (corps supprimé)