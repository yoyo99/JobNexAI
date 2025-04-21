"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobPosting = CreateJobPosting;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const auth_1 = require("../../stores/auth");
const outline_1 = require("@heroicons/react/24/outline");
function CreateJobPosting() {
    const { user } = (0, auth_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [saving, setSaving] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    // Récupérer l'ID de l'offre à modifier depuis les paramètres d'URL
    const searchParams = new URLSearchParams(location.search);
    const editJobId = searchParams.get('edit');
    const [jobPosting, setJobPosting] = (0, react_1.useState)({
        title: '',
        company: '',
        location: '',
        job_type: 'FULL_TIME',
        salary_min: '',
        salary_max: '',
        remote_type: 'hybrid',
        experience_level: 'mid',
        description: '',
        requirements: [''],
        status: 'draft'
    });
    (0, react_1.useEffect)(() => {
        if (editJobId) {
            loadJobPosting(editJobId);
        }
    }, [editJobId]);
    const loadJobPosting = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Simuler un appel API pour récupérer l'offre d'emploi
            // Dans une vraie application, cela serait remplacé par un appel à Supabase
            const mockJobPosting = {
                id: 'job1',
                title: 'Développeur React Senior',
                company: 'TechInnovate',
                location: 'Paris',
                job_type: 'FULL_TIME',
                salary_min: 55000,
                salary_max: 70000,
                remote_type: 'hybrid',
                experience_level: 'senior',
                description: 'Nous recherchons un développeur React expérimenté pour rejoindre notre équipe...',
                requirements: [
                    '5+ ans d\'expérience en React',
                    'Maîtrise de TypeScript',
                    'Expérience avec les API GraphQL'
                ],
                status: 'active'
            };
            setJobPosting(mockJobPosting);
        }
        catch (error) {
            console.error('Error loading job posting:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        // Validation de base
        if (!jobPosting.title || !jobPosting.description || !jobPosting.location) {
            setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
            return;
        }
        try {
            setSaving(true);
            setMessage(null);
            // Simuler un délai pour l'enregistrement
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Dans une vraie application, on sauvegarderait l'offre dans Supabase
            console.log('Saving job posting:', jobPosting);
            setMessage({ type: 'success', text: 'Offre d\'emploi enregistrée avec succès' });
            // Rediriger vers la liste des offres après un court délai
            setTimeout(() => {
                navigate('/recruiter/job-postings');
            }, 1500);
        }
        catch (error) {
            console.error('Error saving job posting:', error);
            setMessage({ type: 'error', text: error.message || 'Une erreur est survenue' });
        }
        finally {
            setSaving(false);
        }
    });
    const addRequirement = () => {
        setJobPosting(Object.assign(Object.assign({}, jobPosting), { requirements: [...jobPosting.requirements, ''] }));
    };
    const updateRequirement = (index, value) => {
        const updatedRequirements = [...jobPosting.requirements];
        updatedRequirements[index] = value;
        setJobPosting(Object.assign(Object.assign({}, jobPosting), { requirements: updatedRequirements }));
    };
    const removeRequirement = (index) => {
        const updatedRequirements = [...jobPosting.requirements];
        updatedRequirements.splice(index, 1);
        setJobPosting(Object.assign(Object.assign({}, jobPosting), { requirements: updatedRequirements }));
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-8", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/recruiter/job-postings'), className: "p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5", children: (0, jsx_runtime_1.jsx)(outline_1.ArrowLeftIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: editJobId ? 'Modifier l\'offre d\'emploi' : 'Créer une offre d\'emploi' })] }), message && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: `mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`, children: message.text })), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "card", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-white mb-4", children: "Informations de base" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Titre du poste *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: jobPosting.title, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { title: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Entreprise *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: jobPosting.company, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { company: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Localisation *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: jobPosting.location, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { location: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Type de contrat *" }), (0, jsx_runtime_1.jsxs)("select", { value: jobPosting.job_type, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { job_type: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true, children: [(0, jsx_runtime_1.jsx)("option", { value: "FULL_TIME", children: "Temps plein" }), (0, jsx_runtime_1.jsx)("option", { value: "PART_TIME", children: "Temps partiel" }), (0, jsx_runtime_1.jsx)("option", { value: "CONTRACT", children: "CDD" }), (0, jsx_runtime_1.jsx)("option", { value: "FREELANCE", children: "Freelance" }), (0, jsx_runtime_1.jsx)("option", { value: "INTERNSHIP", children: "Stage" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Salaire minimum" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: jobPosting.salary_min, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { salary_min: e.target.value ? Number(e.target.value) : '' })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Ex: 45000" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Salaire maximum" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: jobPosting.salary_max, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { salary_max: e.target.value ? Number(e.target.value) : '' })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Ex: 60000" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Type de travail *" }), (0, jsx_runtime_1.jsxs)("select", { value: jobPosting.remote_type, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { remote_type: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true, children: [(0, jsx_runtime_1.jsx)("option", { value: "remote", children: "\u00C0 distance" }), (0, jsx_runtime_1.jsx)("option", { value: "hybrid", children: "Hybride" }), (0, jsx_runtime_1.jsx)("option", { value: "onsite", children: "Sur site" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Niveau d'exp\u00E9rience *" }), (0, jsx_runtime_1.jsxs)("select", { value: jobPosting.experience_level, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { experience_level: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true, children: [(0, jsx_runtime_1.jsx)("option", { value: "junior", children: "Junior (0-2 ans)" }), (0, jsx_runtime_1.jsx)("option", { value: "mid", children: "Confirm\u00E9 (3-5 ans)" }), (0, jsx_runtime_1.jsx)("option", { value: "senior", children: "Senior (5+ ans)" })] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "card", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-white mb-4", children: "Description et pr\u00E9requis" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Description du poste *" }), (0, jsx_runtime_1.jsx)("textarea", { value: jobPosting.description, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { description: e.target.value })), rows: 6, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400", children: "Pr\u00E9requis *" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: addRequirement, className: "text-primary-400 hover:text-primary-300", children: (0, jsx_runtime_1.jsx)(outline_1.PlusIcon, { className: "h-5 w-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: jobPosting.requirements.map((requirement, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: requirement, onChange: (e) => updateRequirement(index, e.target.value), className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Ex: 3+ ans d'exp\u00E9rience en d\u00E9veloppement React" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => removeRequirement(index), className: "text-gray-400 hover:text-red-400", disabled: jobPosting.requirements.length <= 1, children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-5 w-5" }) })] }, index))) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "card", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-white mb-4", children: "Publication" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Statut de l'offre" }), (0, jsx_runtime_1.jsxs)("select", { value: jobPosting.status, onChange: (e) => setJobPosting(Object.assign(Object.assign({}, jobPosting), { status: e.target.value })), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "draft", children: "Brouillon" }), (0, jsx_runtime_1.jsx)("option", { value: "active", children: "Publier imm\u00E9diatement" }), (0, jsx_runtime_1.jsx)("option", { value: "paused", children: "Enregistrer mais ne pas publier" })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-4", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => navigate('/recruiter/job-postings'), className: "btn-secondary", children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: saving, className: "btn-primary", children: saving ? 'Enregistrement...' : editJobId ? 'Mettre à jour l\'offre' : 'Créer l\'offre' })] })] })] }));
}
