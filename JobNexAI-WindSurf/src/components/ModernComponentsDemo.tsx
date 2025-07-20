import { useState } from 'react';
import { JobCard } from './ui/job-card';
import { CVCard } from './ui/cv-card';
import { ThemeToggle } from './ui/theme-toggle';

export const ModernComponentsDemo = () => {
  const [favoriteJobs, setFavoriteJobs] = useState<Set<string>>(new Set());

  const sampleJobs = [
    {
      id: '1',
      title: 'Développeur Full Stack Senior',
      company: 'TechCorp',
      logoUrl: 'https://ui-avatars.com/api/?name=TechCorp&background=6366f1&color=fff&size=48',
      location: 'Paris',
      isRemote: true,
      salary: '65k - 85k €',
      matchScore: 92,
      tags: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupXYZ',
      logoUrl: 'https://ui-avatars.com/api/?name=StartupXYZ&background=10b981&color=fff&size=48',
      location: 'Lyon',
      isRemote: false,
      salary: '55k - 70k €',
      matchScore: 78,
      tags: ['Product Strategy', 'Agile', 'Analytics', 'UX'],
    },
    {
      id: '3',
      title: 'Designer UI/UX',
      company: 'CreativeStudio',
      logoUrl: 'https://ui-avatars.com/api/?name=CreativeStudio&background=f59e0b&color=fff&size=48',
      location: 'Marseille',
      isRemote: true,
      salary: '45k - 60k €',
      matchScore: 85,
      tags: ['Figma', 'Design System', 'Prototyping', 'User Research'],
    },
  ];

  const sampleCV = {
    name: 'Jean Dupont',
    title: 'Développeur Full Stack',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jean+Dupont&background=6366f1&color=fff&size=64',
    completion: 87,
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'],
    lastUpdated: 'il y a 2 jours',
  };

  const toggleFavorite = (jobId: string) => {
    const newFavorites = new Set(favoriteJobs);
    if (newFavorites.has(jobId)) {
      newFavorites.delete(jobId);
    } else {
      newFavorites.add(jobId);
    }
    setFavoriteJobs(newFavorites);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
              Composants Modernes JobNexAI
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Démonstration des nouveaux composants avec dark mode
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Section JobCards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-6">
            Cartes d'Offres d'Emploi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleJobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                logoUrl={job.logoUrl}
                location={job.location}
                isRemote={job.isRemote}
                salary={job.salary}
                matchScore={job.matchScore}
                tags={job.tags}
                favorited={favoriteJobs.has(job.id)}
                onFavorite={() => toggleFavorite(job.id)}
                onClick={() => console.log('Clicked job:', job.title)}
              />
            ))}
          </div>
        </section>

        {/* Section CVCard */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-6">
            Carte CV
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CVCard
              name={sampleCV.name}
              title={sampleCV.title}
              avatarUrl={sampleCV.avatarUrl}
              completion={sampleCV.completion}
              skills={sampleCV.skills}
              lastUpdated={sampleCV.lastUpdated}
              onEdit={() => console.log('Edit CV')}
              onDownload={() => console.log('Download CV')}
              onPreview={() => console.log('Preview CV')}
            />
            
            {/* Variantes avec différents scores */}
            <CVCard
              name="Marie Martin"
              title="Designer UX/UI"
              completion={65}
              skills={['Figma', 'Sketch', 'Prototyping']}
              lastUpdated="il y a 1 semaine"
              onEdit={() => console.log('Edit CV')}
              onDownload={() => console.log('Download CV')}
              onPreview={() => console.log('Preview CV')}
            />
            
            <CVCard
              name="Pierre Durand"
              title="Data Scientist"
              completion={45}
              skills={['Python', 'Machine Learning', 'SQL']}
              lastUpdated="il y a 3 jours"
              onEdit={() => console.log('Edit CV')}
              onDownload={() => console.log('Download CV')}
            />
            
            <CVCard
              name="Sophie Leroy"
              title="Product Manager"
              completion={92}
              skills={['Strategy', 'Analytics', 'Agile', 'Leadership']}
              lastUpdated="hier"
              onEdit={() => console.log('Edit CV')}
              onDownload={() => console.log('Download CV')}
              onPreview={() => console.log('Preview CV')}
            />
          </div>
        </section>

        {/* Section Features */}
        <section>
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-6">
            Fonctionnalités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
                🎨 Design Moderne
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Composants avec glassmorphism, animations fluides et design responsive
              </p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
                🌙 Dark Mode
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Support natif du mode sombre avec transition fluide
              </p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
                ⚡ Animations
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Micro-interactions avec Framer Motion pour une UX premium
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
