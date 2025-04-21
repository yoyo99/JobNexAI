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
exports.InterviewManager = InterviewManager;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const auth_1 = require("../../stores/auth");
const supabase_1 = require("../../lib/supabase");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const outline_1 = require("@heroicons/react/24/outline");
const LoadingSpinner_1 = require("../LoadingSpinner");
function InterviewManager() {
    const { user } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [interviews, setInterviews] = (0, react_1.useState)([]);
    const [applications, setApplications] = (0, react_1.useState)([]);
    const [showAddForm, setShowAddForm] = (0, react_1.useState)(false);
    const [selectedApplicationId, setSelectedApplicationId] = (0, react_1.useState)(null);
    const [interviewDate, setInterviewDate] = (0, react_1.useState)('');
    const [interviewTime, setInterviewTime] = (0, react_1.useState)('');
    const [interviewType, setInterviewType] = (0, react_1.useState)('phone');
    const [interviewLocation, setInterviewLocation] = (0, react_1.useState)('');
    const [contactName, setContactName] = (0, react_1.useState)('');
    const [contactEmail, setContactEmail] = (0, react_1.useState)('');
    const [notes, setNotes] = (0, react_1.useState)('');
    const [reminderSet, setReminderSet] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [success, setSuccess] = (0, react_1.useState)(null);
    const [editingInterview, setEditingInterview] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (user) {
            loadInterviews();
            loadApplications();
        }
    }, [user]);
    const loadInterviews = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Récupérer les entretiens de l'utilisateur
            const { data, error } = yield supabase_1.supabase
                .from('job_interviews')
                .select(`
          *,
          job_application:job_applications (
            job:jobs (
              title,
              company,
              location
            )
          )
        `)
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .order('date', { ascending: true });
            if (error)
                throw error;
            setInterviews(data || []);
        }
        catch (error) {
            console.error('Error loading interviews:', error);
            setError('Erreur lors du chargement des entretiens');
        }
        finally {
            setLoading(false);
        }
    });
    const loadApplications = () => __awaiter(this, void 0, void 0, function* () {
        try {
            // Récupérer les candidatures en cours d'entretien
            const { data, error } = yield supabase_1.supabase
                .from('job_applications')
                .select(`
          id,
          job:jobs (
            title,
            company,
            location
          )
        `)
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .in('status', ['applied', 'interviewing'])
                .order('updated_at', { ascending: false });
            if (error)
                throw error;
            setApplications(data || []);
        }
        catch (error) {
            console.error('Error loading applications:', error);
        }
    });
    const handleAddInterview = () => __awaiter(this, void 0, void 0, function* () {
        if (!selectedApplicationId) {
            setError('Veuillez sélectionner une candidature');
            return;
        }
        if (!interviewDate || !interviewTime) {
            setError('Veuillez spécifier la date et l\'heure de l\'entretien');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            // Combiner la date et l'heure
            const dateTime = `${interviewDate}T${interviewTime}:00`;
            // Créer l'entretien
            const { error } = yield supabase_1.supabase
                .from('job_interviews')
                .insert({
                user_id: user === null || user === void 0 ? void 0 : user.id,
                job_application_id: selectedApplicationId,
                date: dateTime,
                type: interviewType,
                location: interviewLocation || null,
                contact_name: contactName || null,
                contact_email: contactEmail || null,
                notes: notes || null,
                reminder_set: reminderSet
            });
            if (error)
                throw error;
            // Mettre à jour le statut de la candidature
            yield supabase_1.supabase
                .from('job_applications')
                .update({
                status: 'interviewing',
                next_step_date: dateTime,
                next_step_type: interviewType
            })
                .eq('id', selectedApplicationId);
            // Réinitialiser le formulaire
            setSelectedApplicationId(null);
            setInterviewDate('');
            setInterviewTime('');
            setInterviewType('phone');
            setInterviewLocation('');
            setContactName('');
            setContactEmail('');
            setNotes('');
            setReminderSet(true);
            setShowAddForm(false);
            // Afficher le message de succès
            setSuccess('Entretien ajouté avec succès');
            // Recharger les entretiens
            loadInterviews();
        }
        catch (error) {
            console.error('Error adding interview:', error);
            setError('Erreur lors de l\'ajout de l\'entretien');
        }
        finally {
            setLoading(false);
        }
    });
    const handleUpdateInterview = () => __awaiter(this, void 0, void 0, function* () {
        if (!editingInterview)
            return;
        try {
            setLoading(true);
            setError(null);
            // Combiner la date et l'heure
            const dateTime = `${interviewDate}T${interviewTime}:00`;
            // Mettre à jour l'entretien
            const { error } = yield supabase_1.supabase
                .from('job_interviews')
                .update({
                date: dateTime,
                type: interviewType,
                location: interviewLocation || null,
                contact_name: contactName || null,
                contact_email: contactEmail || null,
                notes: notes || null,
                reminder_set: reminderSet
            })
                .eq('id', editingInterview.id);
            if (error)
                throw error;
            // Mettre à jour le statut de la candidature
            yield supabase_1.supabase
                .from('job_applications')
                .update({
                next_step_date: dateTime,
                next_step_type: interviewType
            })
                .eq('id', editingInterview.job_application_id);
            // Réinitialiser le formulaire
            setEditingInterview(null);
            setInterviewDate('');
            setInterviewTime('');
            setInterviewType('phone');
            setInterviewLocation('');
            setContactName('');
            setContactEmail('');
            setNotes('');
            setReminderSet(true);
            // Afficher le message de succès
            setSuccess('Entretien mis à jour avec succès');
            // Recharger les entretiens
            loadInterviews();
        }
        catch (error) {
            console.error('Error updating interview:', error);
            setError('Erreur lors de la mise à jour de l\'entretien');
        }
        finally {
            setLoading(false);
        }
    });
    const handleDeleteInterview = (interviewId) => __awaiter(this, void 0, void 0, function* () {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet entretien ?')) {
            return;
        }
        try {
            setLoading(true);
            const { error } = yield supabase_1.supabase
                .from('job_interviews')
                .delete()
                .eq('id', interviewId);
            if (error)
                throw error;
            // Recharger les entretiens
            loadInterviews();
        }
        catch (error) {
            console.error('Error deleting interview:', error);
            setError('Erreur lors de la suppression de l\'entretien');
        }
        finally {
            setLoading(false);
        }
    });
    const handleEditInterview = (interview) => {
        setEditingInterview(interview);
        // Extraire la date et l'heure
        const date = new Date(interview.date);
        setInterviewDate((0, date_fns_1.format)(date, 'yyyy-MM-dd'));
        setInterviewTime((0, date_fns_1.format)(date, 'HH:mm'));
        setInterviewType(interview.type);
        setInterviewLocation(interview.location || '');
        setContactName(interview.contact_name || '');
        setContactEmail(interview.contact_email || '');
        setNotes(interview.notes || '');
        setReminderSet(interview.reminder_set);
    };
    const resetForm = () => {
        setEditingInterview(null);
        setSelectedApplicationId(null);
        setInterviewDate('');
        setInterviewTime('');
        setInterviewType('phone');
        setInterviewLocation('');
        setContactName('');
        setContactEmail('');
        setNotes('');
        setReminderSet(true);
        setShowAddForm(false);
    };
    const getInterviewTypeLabel = (type) => {
        switch (type) {
            case 'phone':
                return 'Téléphonique';
            case 'technical':
                return 'Technique';
            case 'hr':
                return 'RH';
            case 'final':
                return 'Final';
            case 'other':
                return 'Autre';
            default:
                return type;
        }
    };
    const getInterviewStatusClass = (date) => {
        const now = new Date();
        const interviewDate = (0, date_fns_1.parseISO)(date);
        if ((0, date_fns_1.isBefore)(interviewDate, now)) {
            return 'bg-gray-600 text-gray-100';
        }
        if ((0, date_fns_1.isBefore)(interviewDate, (0, date_fns_1.addDays)(now, 2))) {
            return 'bg-yellow-600 text-yellow-100';
        }
        return 'bg-green-600 text-green-100';
    };
    const getInterviewStatusLabel = (date) => {
        const now = new Date();
        const interviewDate = (0, date_fns_1.parseISO)(date);
        if ((0, date_fns_1.isBefore)(interviewDate, now)) {
            return 'Passé';
        }
        if ((0, date_fns_1.isBefore)(interviewDate, (0, date_fns_1.addDays)(now, 2))) {
            return 'Imminent';
        }
        return 'À venir';
    };
    if (loading && interviews.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "lg", text: "Chargement des entretiens..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: "Gestion des entretiens" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowAddForm(!showAddForm), className: "btn-primary flex items-center gap-2", children: showAddForm ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "Annuler" })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(outline_1.PlusIcon, { className: "h-5 w-5" }), "Ajouter un entretien"] })) })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), success && ((0, jsx_runtime_1.jsx)("div", { className: "bg-green-900/50 text-green-400 p-4 rounded-lg", children: success })), (showAddForm || editingInterview) && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "bg-white/5 rounded-lg p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white mb-4", children: editingInterview ? 'Modifier l\'entretien' : 'Ajouter un nouvel entretien' }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [!editingInterview && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Candidature" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedApplicationId || '', onChange: (e) => setSelectedApplicationId(e.target.value || null), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "S\u00E9lectionnez une candidature" }), applications.map((app) => ((0, jsx_runtime_1.jsxs)("option", { value: app.id, children: [app.job.title, " - ", app.job.company] }, app.id)))] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Date" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: interviewDate, onChange: (e) => setInterviewDate(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Heure" }), (0, jsx_runtime_1.jsx)("input", { type: "time", value: interviewTime, onChange: (e) => setInterviewTime(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Type d'entretien" }), (0, jsx_runtime_1.jsxs)("select", { value: interviewType, onChange: (e) => setInterviewType(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "phone", children: "T\u00E9l\u00E9phonique" }), (0, jsx_runtime_1.jsx)("option", { value: "technical", children: "Technique" }), (0, jsx_runtime_1.jsx)("option", { value: "hr", children: "RH" }), (0, jsx_runtime_1.jsx)("option", { value: "final", children: "Final" }), (0, jsx_runtime_1.jsx)("option", { value: "other", children: "Autre" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Lieu (optionnel)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: interviewLocation, onChange: (e) => setInterviewLocation(e.target.value), placeholder: "Ex: Visioconf\u00E9rence Zoom, Bureaux de l'entreprise, etc.", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Nom du contact (optionnel)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: contactName, onChange: (e) => setContactName(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Email du contact (optionnel)" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: contactEmail, onChange: (e) => setContactEmail(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Notes (optionnel)" }), (0, jsx_runtime_1.jsx)("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: "reminder", checked: reminderSet, onChange: (e) => setReminderSet(e.target.checked), className: "rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "reminder", className: "text-sm text-gray-400", children: "Activer les rappels (24h et 1h avant l'entretien)" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-4", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: resetForm, className: "btn-secondary", children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: editingInterview ? handleUpdateInterview : handleAddInterview, disabled: loading, className: "btn-primary", children: loading ? ((0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "sm" })) : editingInterview ? ('Mettre à jour') : ('Ajouter') })] })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "Entretiens \u00E0 venir" }), interviews.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-6 text-gray-400 bg-white/5 rounded-lg", children: "Aucun entretien programm\u00E9." })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: interviews
                            .filter(interview => (0, date_fns_1.isAfter)((0, date_fns_1.parseISO)(interview.date), new Date()))
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map((interview) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium", children: interview.job_application.job.title }), (0, jsx_runtime_1.jsx)("span", { className: `px-2 py-0.5 rounded-full text-xs ${getInterviewStatusClass(interview.date)}`, children: getInterviewStatusLabel(interview.date) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: interview.job_application.job.company }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 grid grid-cols-1 md:grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.CalendarIcon, { className: "h-4 w-4 text-primary-400" }), (0, date_fns_1.format)((0, date_fns_1.parseISO)(interview.date), 'EEEE d MMMM yyyy', { locale: locale_1.fr })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.ClockIcon, { className: "h-4 w-4 text-primary-400" }), (0, date_fns_1.format)((0, date_fns_1.parseISO)(interview.date), 'HH:mm', { locale: locale_1.fr })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.BriefcaseIcon, { className: "h-4 w-4 text-primary-400" }), "Entretien ", getInterviewTypeLabel(interview.type)] }), interview.location && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.MapPinIcon, { className: "h-4 w-4 text-primary-400" }), interview.location] }))] }), (interview.contact_name || interview.contact_email) && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.UserIcon, { className: "h-4 w-4 text-primary-400" }), interview.contact_name && (0, jsx_runtime_1.jsx)("span", { children: interview.contact_name }), interview.contact_email && ((0, jsx_runtime_1.jsx)("a", { href: `mailto:${interview.contact_email}`, className: "text-primary-400 hover:text-primary-300", children: interview.contact_email }))] })), interview.notes && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 text-sm text-gray-300", children: (0, jsx_runtime_1.jsx)("p", { className: "italic", children: interview.notes }) })), interview.reminder_set && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center gap-2 text-sm text-green-400", children: [(0, jsx_runtime_1.jsx)(outline_1.BellIcon, { className: "h-4 w-4" }), "Rappels activ\u00E9s"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleEditInterview(interview), className: "p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.PencilIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleDeleteInterview(interview.id), className: "p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-5 w-5" }) })] })] }) }, interview.id))) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "Entretiens pass\u00E9s" }), interviews.filter(interview => (0, date_fns_1.isBefore)((0, date_fns_1.parseISO)(interview.date), new Date())).length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-6 text-gray-400 bg-white/5 rounded-lg", children: "Aucun entretien pass\u00E9." })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: interviews
                            .filter(interview => (0, date_fns_1.isBefore)((0, date_fns_1.parseISO)(interview.date), new Date()))
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((interview) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium", children: interview.job_application.job.title }), (0, jsx_runtime_1.jsx)("span", { className: "bg-gray-600 text-gray-100 px-2 py-0.5 rounded-full text-xs", children: "Pass\u00E9" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: interview.job_application.job.company }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 grid grid-cols-1 md:grid-cols-2 gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.CalendarIcon, { className: "h-4 w-4 text-primary-400" }), (0, date_fns_1.format)((0, date_fns_1.parseISO)(interview.date), 'EEEE d MMMM yyyy', { locale: locale_1.fr })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.ClockIcon, { className: "h-4 w-4 text-primary-400" }), (0, date_fns_1.format)((0, date_fns_1.parseISO)(interview.date), 'HH:mm', { locale: locale_1.fr })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.BriefcaseIcon, { className: "h-4 w-4 text-primary-400" }), "Entretien ", getInterviewTypeLabel(interview.type)] }), interview.location && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.MapPinIcon, { className: "h-4 w-4 text-primary-400" }), interview.location] }))] }), interview.notes && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 text-sm text-gray-300", children: (0, jsx_runtime_1.jsx)("p", { className: "italic", children: interview.notes }) }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-2", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => handleDeleteInterview(interview.id), className: "p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-5 w-5" }) }) })] }) }, interview.id))) }))] })] }));
}
