import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { BriefcaseIcon, CurrencyEuroIcon, MapPinIcon, ClockIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { ProjectProposalModal } from './ProjectProposalModal';
import { useTranslation } from 'react-i18next';

interface Project {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  skills_required: string[];
  created_at: string;
  client_id: string;
  status: string;
  location: string;
  remote: boolean;
  duration_weeks?: number;
  client_info?: { company_name: string };
  proposals_count?: number;
}

interface DurationOption {
  value: string;
  label: string;
}

const getTranslatedDurations = (t: (key: string) => string): DurationOption[] => [
  { value: '1_week', label: t('freelance.projects.durations.oneWeek') },
  { value: '2_weeks', label: t('freelance.projects.durations.twoWeeks') },
  { value: '1_month', label: t('freelance.projects.durations.oneMonth') },
  { value: '2_months', label: t('freelance.projects.durations.twoMonths') },
  { value: '3_months', label: t('freelance.projects.durations.threeMonthsPlus') },
];

const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return '';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

function FreelanceProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState<number | ''>('');
  const [budgetMax, setBudgetMax] = useState<number | ''>('');
  const [remote, setRemote] = useState<boolean | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);

  const skillsKeyMap: { [key: string]: string } = {
    'Développement Web': 'freelance.projects.skills.webDevelopment',
    'Design UX/UI': 'freelance.projects.skills.uxUiDesign',
    'Rédaction': 'freelance.projects.skills.copywriting',
    'Traduction': 'freelance.projects.skills.translation',
    'Marketing Digital': 'freelance.projects.skills.digitalMarketing',
    'SEO': 'freelance.projects.skills.seo',
    'Gestion de Projet': 'freelance.projects.skills.projectManagement',
    'Développement Mobile': 'freelance.projects.skills.mobileDevelopment',
    'DevOps': 'freelance.projects.skills.devOps',
    'Data Science': 'freelance.projects.skills.dataScience',
    'Illustration': 'freelance.projects.skills.illustration',
    'Montage Vidéo': 'freelance.projects.skills.videoEditing'
  };

  // Original skills list used for filtering logic, if skills are stored as raw strings in DB
  const rawSkillsList = [
    'Développement Web', 'Design UX/UI', 'Rédaction', 'Traduction',
    'Marketing Digital', 'SEO', 'Gestion de Projet', 'Développement Mobile',
    'DevOps', 'Data Science', 'Illustration', 'Montage Vidéo'
  ];

  const { t } = useTranslation();
  const durations = getTranslatedDurations(t);

  useEffect(() => {
    loadProjects();
    loadSavedProjects();
  }, [search, selectedSkills, budgetMin, budgetMax, remote, duration]);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('jobs') 
        .select('*, proposals_count:project_proposals(count), client_info:profiles(company_name)') 
        .eq('status', 'open');

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }
      if (selectedSkills.length > 0) {
        query = query.overlaps('skills_required', selectedSkills);
      }
      if (budgetMin !== '') {
        query = query.gte('budget_min', budgetMin);
      }
      if (budgetMax !== '') {
        query = query.lte('budget_max', budgetMax);
      }
      if (remote !== null) {
        query = query.eq('remote', remote);
      }
      if (duration) {
        switch (duration) {
          case '1_week':
            query = query.lte('duration_weeks', 1);
            break;
          case '2_weeks':
            query = query.lte('duration_weeks', 2).gte('duration_weeks', 1);
            break;
          case '1_month':
            query = query.lte('duration_weeks', 4).gte('duration_weeks', 2);
            break;
          case '2_months':
            query = query.lte('duration_weeks', 8).gte('duration_weeks', 4);
            break;
          case '3_months':
            query = query.gte('duration_weeks', 12);
            break;
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      if (data) {
        setProjects(data as Project[]);
      }
    } catch (error) {
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  }, [search, selectedSkills, budgetMin, budgetMax, remote, duration]);

  const loadSavedProjects = async () => {
    // Simplified: In a real app, this would come from user data
    const saved = localStorage.getItem('savedFreelanceProjects');
    if (saved) {
      setSavedProjects(JSON.parse(saved));
    }
  };

  const toggleSaveProject = (projectId: string) => {
    let updatedSavedProjects;
    if (savedProjects.includes(projectId)) {
      updatedSavedProjects = savedProjects.filter(id => id !== projectId);
    } else {
      updatedSavedProjects = [...savedProjects, projectId];
    }
    setSavedProjects(updatedSavedProjects);
    localStorage.setItem('savedFreelanceProjects', JSON.stringify(updatedSavedProjects));
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleApplyToProject = (project: Project) => {
    setSelectedProject(project);
    setIsProposalModalOpen(true);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedSkills([]);
    setBudgetMin('');
    setBudgetMax('');
    setRemote(null);
    setDuration(null);
    setShowFilters(false);
  };

  const handleSubmitProposal = async (projectId: string, proposalData: { bidAmount: number; deliveryTime: string; coverLetter: string }) => {
    setLoading(true); 
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated to submit a proposal.');
        // Idéalement, rediriger vers la connexion ou afficher un message plus clair.
      }

      const newProposal = {
        project_id: projectId,
        freelancer_id: user.id,
        bid_amount: proposalData.bidAmount,
        delivery_time: proposalData.deliveryTime,
        cover_letter: proposalData.coverLetter,
        status: 'pending', 
        // created_at est généralement géré par Supabase
      };

      const { error } = await supabase
        .from('project_proposals') 
        .insert([newProposal]);

      if (error) {
        console.error('Error submitting proposal to Supabase:', error);
        // Utiliser un système de notification plus robuste à l'avenir
        alert(`Erreur lors de l'envoi de la proposition: ${error.message}`);
        setLoading(false);
        return;
      }

      // Mettre à jour l'UI si nécessaire, par exemple, rafraîchir la liste des projets ou des propositions
      // Pour l'instant, juste un message de succès et fermeture du modal
      alert(t('freelance.projects.proposalSubmittedSuccess')); 
      setIsProposalModalOpen(false);

      // Optionnel: Mettre à jour le compteur de propositions sur le projet si l'information est disponible et affichée
      // Cela nécessiterait de re-fetcher les projets ou de mettre à jour l'état local des projets.
      // Exemple: updateProjectProposalsCount(projectId);

    } catch (error: any) {
      console.error('Unexpected error during proposal submission:', error);
      alert(`Une erreur inattendue est survenue: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && projects.length === 0) {
    return <div className="text-center py-10 text-white">{t('freelance.projects.loadingProjects')}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t('freelance.projects.title')}</h1>
        <p className="text-gray-400 mt-1">
          {t('freelance.projects.findProjectsDescription')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('freelance.projects.searchPlaceholder')}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center gap-2"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          {t('freelance.projects.advancedFiltersButton')}
        </button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/5 p-6 rounded-lg mb-6 overflow-hidden"
        >
          <form
            onSubmit={(e) => { e.preventDefault(); loadProjects(); }}
            className="mt-6 space-y-6"
          >
            <div>
              <h3 className="text-sm font-medium text-white mb-2">{t('profile.skills')}</h3>
              <div className="flex flex-wrap gap-2">
                {rawSkillsList.map((skillValue) => (
                  <button
                    key={skillValue}
                    type="button"
                    onClick={() => handleSkillToggle(skillValue)} 
                    className={`px-3 py-1.5 text-xs rounded-full transition-colors
                      ${selectedSkills.includes(skillValue) 
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                  >
                    {t(skillsKeyMap[skillValue])} 
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-white mb-2">{t('freelance.projects.budgetFilterTitle')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value ? Number(e.target.value) : '')}
                      placeholder={t('freelance.projects.budgetPlaceholderMin')}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value ? Number(e.target.value) : '')}
                      placeholder={t('freelance.projects.budgetPlaceholderMax')}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-2">{t('freelance.projects.durationFilterTitle')}</h3>
                <select
                  value={duration || ''}
                  onChange={(e) => setDuration(e.target.value || null)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{t('freelance.projects.allDurationsOption')}</option>
                  {durations.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-2">{t('search.jobType')}</h3>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRemote(null)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors
                    ${remote === null
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                  {t('freelance.projects.jobTypeAll')}
                </button>
                <button
                  type="button"
                  onClick={() => setRemote(true)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors
                    ${remote === true
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                  {t('freelance.projects.jobTypeRemote')}
                </button>
                <button
                  type="button"
                  onClick={() => setRemote(false)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors
                    ${remote === false
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                  {t('freelance.projects.jobTypeOnSite')}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="btn-ghost"
              >
                {t('freelance.projects.cancelButton')}
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="btn-secondary"
              >
                {t('freelance.projects.resetFiltersButton')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading && projects.length > 0 && <div className="text-center py-10 text-white">{t('freelance.projects.updatingProjects')}</div>}
      {!loading && projects.length === 0 && (
        <div className="text-center py-12">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-2 text-xl font-medium text-white">{t('freelance.projects.noProjectsFoundTitle')}</h3>
          <p className="mt-1 text-gray-400">{t('freelance.projects.noProjectsFound')}</p>
          <div className="mt-6">
            <button onClick={resetFilters} className="btn-primary">
              {t('freelance.projects.clearFiltersButton')}
            </button>
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white/5 shadow-lg rounded-xl p-6 text-white transform hover:scale-[1.01] transition-transform duration-300 ease-out">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                    <a href={`/freelance/projects/${project.id}`}>{project.title}</a>
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {t('freelance.projects.publishedByXDaysAgo', { clientName: project.client_info?.company_name || t('freelance.projects.anonymousClient'), days: differenceInDays(new Date(), new Date(project.created_at)), count: differenceInDays(new Date(), new Date(project.created_at)) })}
                  </p>
                </div>
                <button onClick={() => toggleSaveProject(project.id)} className="text-gray-400 hover:text-primary-400 transition-colors p-1">
                  {savedProjects.includes(project.id) ? 
                    <BookmarkIconSolid className="h-6 w-6 text-primary-500" /> : 
                    <BriefcaseIcon className="h-6 w-6" />
                  }
                </button>
              </div>

              <p className="mt-4 text-gray-300 text-sm leading-relaxed line-clamp-3">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.skills_required.map(skill => (
                  <span key={skill} className="px-3 py-1 text-xs bg-primary-500/20 text-primary-300 rounded-full">
                    {t(skillsKeyMap[skill])}
                  </span>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
                  <div className="flex items-center text-gray-300">
                    <CurrencyEuroIcon className="h-5 w-5 mr-2 text-primary-400" />
                    {t('freelance.projects.budgetRange', { minPrice: formatPrice(project.budget_min), maxPrice: formatPrice(project.budget_max) })}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <ClockIcon className="h-5 w-5 mr-2 text-primary-400" />
                    {project.duration_weeks 
                      ? t('freelance.projects.durationValue', { weeks: project.duration_weeks }) 
                      : t('freelance.projects.durationNotApplicable')}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPinIcon className="h-5 w-5 mr-2 text-primary-400" />
                    {project.location} {project.remote && <span className="ml-1">{t('freelance.projects.remoteTag')}</span>}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <BriefcaseIcon className="h-5 w-5 mr-2 text-primary-400" />
                    {t('freelance.projects.proposalsCount', { count: project.proposals_count || 0 })}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleApplyToProject(project)}
                    className="btn-primary"
                  >
                    {t('freelance.projects.applyButton')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProject && (
        <ProjectProposalModal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          project={selectedProject}
          onSubmit={handleSubmitProposal}
        />
      )}
    </div>
  );
}

export default FreelanceProjects;