import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  ChartPieIcon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  BriefcaseIcon,
  RectangleGroupIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../utils/cn'
import { useAuth } from '../stores/auth'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NotificationCenter } from './NotificationCenter'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const location = useLocation()
  const [navigation, setNavigation] = useState<any[]>([])

  useEffect(() => {
    // Définir la navigation en fonction du type d'utilisateur
    if (user?.user_type === 'freelancer') {
      setNavigation([
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Projets disponibles', href: '/freelance/projects', icon: RectangleGroupIcon },
        { name: 'Mon profil freelance', href: '/freelance/profile', icon: UserIcon },
        { name: 'CV Builder', href: '/cv-builder', icon: DocumentTextIcon },
        { name: 'Réseau', href: '/network', icon: UsersIcon },
        { name: 'Analyse du marché', href: '/market-analysis', icon: ChartPieIcon },
        { name: 'Facturation', href: '/billing', icon: CreditCardIcon },
      ])
    } else if (user?.user_type === 'recruiter') {
      setNavigation([
        { name: 'Dashboard', href: '/recruiter/dashboard', icon: HomeIcon },
        { name: 'Recherche de candidats', href: '/recruiter/candidates', icon: MagnifyingGlassIcon },
        { name: 'Mes offres d\'emploi', href: '/recruiter/job-postings', icon: ClipboardDocumentListIcon },
        { name: 'Créer une offre', href: '/recruiter/create-job', icon: PlusCircleIcon },
        { name: 'Réseau', href: '/network', icon: UsersIcon },
        { name: 'Profil', href: '/profile', icon: UserIcon },
        { name: 'Facturation', href: '/billing', icon: CreditCardIcon },
      ])
    } else {
      // Navigation par défaut pour les candidats
      setNavigation([
        { name: 'navigation.dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'navigation.jobSearch', href: '/jobs', icon: FolderIcon },
        { name: 'navigation.applications', href: '/applications', icon: ClipboardDocumentListIcon },
        { name: 'navigation.cvBuilder', href: '/cv-builder', icon: DocumentTextIcon },
        { name: 'navigation.network', href: '/network', icon: UsersIcon },
        { name: 'navigation.marketAnalysis', href: '/market-analysis', icon: ChartPieIcon },
        { name: 'navigation.profile', href: '/profile', icon: UserIcon },
        { name: 'Facturation', href: '/billing', icon: CreditCardIcon },
      ])
    }
  }, [user?.user_type, t])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                      JobNexAI
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={cn(
                                  'text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                  location.pathname === item.href && 'bg-gray-800 text-white'
                                )}
                              >
                                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                {typeof item.name === 'string' && item.name.startsWith('navigation.') 
                                  ? t(item.name) 
                                  : item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4 border-r border-white/10">
          <div className="flex h-16 shrink-0 items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
              JobNexAI
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          'text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                          location.pathname === item.href && 'bg-gray-800 text-white'
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {typeof item.name === 'string' && item.name.startsWith('navigation.') 
                          ? t(item.name) 
                          : item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-white lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <LanguageSwitcher />
              <NotificationCenter />

              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold">
                    {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      <Link
                        to="/profile"
                        className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                      >
                        {t('navigation.profile')}
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        to="/billing"
                        className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                      >
                        Facturation
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50 w-full text-left"
                        onClick={handleSignOut}
                      >
                        {t('auth.logout')}
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}