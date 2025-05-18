import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../stores/auth'
import SimpleLogo from '../assets/images/simple_logo.svg?react';

// Navigation pour les utilisateurs non connectés
const publicNavigation = [
  { name: 'Fonctionnalités', href: '/features' },
  { name: 'Comment ça marche', href: '/how-it-works' },
  { name: 'Tarifs', href: '/pricing' },
  { name: 'Témoignages', href: '/testimonials' },
]

// Navigation pour les utilisateurs connectés
const privateNavigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Job Search', href: '/jobs' },
  { name: 'Applications', href: '/applications' },
  { name: 'CV Builder', href: '/cv-builder' },
]

export function Header() {
  console.log('[Header] FUNCTION EXECUTION STARTED'); // <--- NOUVEAU LOG AJOUTÉ ICI
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { user, subscription } = useAuth()
  console.log('[Header] User from useAuth in Header:', user);
  const location = useLocation()

  // Utiliser la navigation publique pour les utilisateurs non connectés
  // et la navigation privée pour les utilisateurs connectés
  const navigation = user ? privateNavigation : publicNavigation;
  const debugSimplifiedHeader = false; // Mettez à false pour afficher le header original

  if (debugSimplifiedHeader) {
    // Simplified return for debugging
    return (
      <div style={{ padding: '20px', backgroundColor: 'lightcoral', color: 'white', textAlign: 'center' }}>
        Test Header Content. Admin link should appear here if logic is correct: 
        {user && user.is_admin && <a href="/admin" style={{ color: 'yellow', marginLeft: '10px' }}>ADMIN LINK TEST</a>}
      </div>
    );
  } else {
    // Original return content (previously commented out)
    return (
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-sm border-b border-white/10">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          {((): boolean => true)() && // Re-enable Logo section's parent div
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center"> {/* Removed h-10 w-auto */}
              <span className="sr-only">JobNexAI</span>
              <SimpleLogo width={40} height={40} /> {/* Added width and height props */}
              {/* Link Text Test */}
            </Link>
          </div>
          }
          {((): boolean => false)() && // Disable mobile menu button
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          }
          {((): boolean => false)() && // KEEP desktop navigation links disabled
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          }
          {((): boolean => false)() && // KEEP user section disabled
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center gap-x-4">
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className="text-sm font-semibold leading-6 text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-sm font-semibold text-white">
                  {user.full_name || user.email}
                </span>
                {subscription && (
                  <span className="text-sm px-3 py-1 rounded-md bg-primary-500 text-white">
                    {t(`plans.${subscription.plan}`, subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1))}
                  </span>
                )}
                {/* Optionnel: Lien vers la page de profil/facturation */}
                {/* <Link to="/profile" className="text-sm font-semibold text-white hover:text-primary-400">Profil</Link> */}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-semibold px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  {t('auth.login')}
                </Link>
                <Link 
                  to="/pricing"
                  className="text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 transition-colors"
                >
                  {t('auth.startTrial')}
                </Link>
              </>
            )}
          </div>
          }
        </nav>
        {((): boolean => false)() && // Conditionally render Mobile Menu Dialog for debugging
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">JobNexAI</span>
                <SimpleLogo />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <div className="mb-4">
                    <LanguageSwitcher />
                  </div>
                  {user ? (
                    <div className="py-6">
                      {user.is_admin && (
                        <Link
                          to="/admin"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-yellow-400 hover:bg-white/10"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                      <span className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white">
                        {user.full_name || user.email}
                      </span>
                      {subscription && (
                        <span className="-mx-3 block rounded-lg px-3 py-1 text-sm bg-primary-500 text-white w-fit">
                          {t(`plans.${subscription.plan}`, subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1))}
                        </span>
                      )}
                      {/* Optionnel: Lien vers la page de profil/facturation pour mobile */}
                      {/* <Link to="/profile" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>Profil</Link> */}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Link
                        to="/login"
                        className="block text-center text-sm font-semibold px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                      >
                        {t('auth.login')}
                      </Link>
                      <Link
                        to="/pricing"
                        className="block text-center text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 transition-colors"
                      >
                        {t('auth.startTrial')}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
        }
      </header>
    );
  }
}