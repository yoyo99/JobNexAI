import { motion } from 'framer-motion'

import { useTranslation } from 'react-i18next';

const stepsKeys = [
  {
    title: 'howItWorks.steps.0.title',
    description: 'howItWorks.steps.0.description',
    icon: '1',
  },
  {
    title: 'howItWorks.steps.1.title',
    description: 'howItWorks.steps.1.description',
    icon: '2',
  },
  {
    title: 'howItWorks.steps.2.title',
    description: 'howItWorks.steps.2.description',
    icon: '3',
  },
];

export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <div className="bg-white/5 py-24 sm:py-32" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-400">{t('howItWorks.title')}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t('howItWorks.subtitle')}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {t('howItWorks.description')}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {stepsKeys.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="relative"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white text-xl font-bold">
                  {t('howItWorks.stepNumber', { number: step.icon })}
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8 text-white">{t(step.title)}</h3>
                <p className="mt-2 text-base leading-7 text-gray-400">{t(step.description)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}