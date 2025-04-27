var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../stores/auth';
import { supabase } from '../../lib/supabase';
import { format, addDays, isBefore, isAfter, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, ClockIcon, BriefcaseIcon, UserIcon, MapPinIcon, PencilIcon, TrashIcon, BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../LoadingSpinner';
export function InterviewManager() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [interviews, setInterviews] = useState([]);
    const [applications, setApplications] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewTime, setInterviewTime] = useState('');
    const [interviewType, setInterviewType] = useState('phone');
    const [interviewLocation, setInterviewLocation] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [reminderSet, setReminderSet] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingInterview, setEditingInterview] = useState(null);
    useEffect(() => {
        if (user) {
            loadInterviews();
            loadApplications();
        }
    }, [user]);
    const loadInterviews = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Récupérer les entretiens de l'utilisateur
            const { data, error } = yield supabase
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
            const { data, error } = yield supabase
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
            const { error } = yield supabase
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
            yield supabase
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
            const { error } = yield supabase
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
            yield supabase
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
            const { error } = yield supabase
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
        setInterviewDate(format(date, 'yyyy-MM-dd'));
        setInterviewTime(format(date, 'HH:mm'));
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
        const interviewDate = parseISO(date);
        if (isBefore(interviewDate, now)) {
            return 'bg-gray-600 text-gray-100';
        }
        if (isBefore(interviewDate, addDays(now, 2))) {
            return 'bg-yellow-600 text-yellow-100';
        }
        return 'bg-green-600 text-green-100';
    };
    const getInterviewStatusLabel = (date) => {
        const now = new Date();
        const interviewDate = parseISO(date);
        if (isBefore(interviewDate, now)) {
            return 'Passé';
        }
        if (isBefore(interviewDate, addDays(now, 2))) {
            return 'Imminent';
        }
        return 'À venir';
    };
    if (loading && interviews.length === 0) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx(LoadingSpinner, { size: "lg", text: "Chargement des entretiens..." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Gestion des entretiens" }), _jsx("button", { onClick: () => setShowAddForm(!showAddForm), className: "btn-primary flex items-center gap-2", children: showAddForm ? (_jsx(_Fragment, { children: "Annuler" })) : (_jsxs(_Fragment, { children: [_jsx(PlusIcon, { className: "h-5 w-5" }), "Ajouter un entretien"] })) })] }), error && (_jsx("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), success && (_jsx("div", { className: "bg-green-900/50 text-green-400 p-4 rounded-lg", children: success })), (showAddForm || editingInterview) && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "bg-white/5 rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-medium text-white mb-4", children: editingInterview ? 'Modifier l\'entretien' : 'Ajouter un nouvel entretien' }), _jsxs("div", { className: "space-y-4", children: [!editingInterview && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Candidature" }), _jsxs("select", { value: selectedApplicationId || '', onChange: (e) => setSelectedApplicationId(e.target.value || null), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez une candidature" }), applications.map((app) => (_jsxs("option", { value: app.id, children: [app.job.title, " - ", app.job.company] }, app.id)))] })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Date" }), _jsx("input", { type: "date", value: interviewDate, onChange: (e) => setInterviewDate(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Heure" }), _jsx("input", { type: "time", value: interviewTime, onChange: (e) => setInterviewTime(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Type d'entretien" }), _jsxs("select", { value: interviewType, onChange: (e) => setInterviewType(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "phone", children: "T\u00E9l\u00E9phonique" }), _jsx("option", { value: "technical", children: "Technique" }), _jsx("option", { value: "hr", children: "RH" }), _jsx("option", { value: "final", children: "Final" }), _jsx("option", { value: "other", children: "Autre" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Lieu (optionnel)" }), _jsx("input", { type: "text", value: interviewLocation, onChange: (e) => setInterviewLocation(e.target.value), placeholder: "Ex: Visioconf\u00E9rence Zoom, Bureaux de l'entreprise, etc.", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Nom du contact (optionnel)" }), _jsx("input", { type: "text", value: contactName, onChange: (e) => setContactName(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Email du contact (optionnel)" }), _jsx("input", { type: "email", value: contactEmail, onChange: (e) => setContactEmail(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Notes (optionnel)" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "reminder", checked: reminderSet, onChange: (e) => setReminderSet(e.target.checked), className: "rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" }), _jsx("label", { htmlFor: "reminder", className: "text-sm text-gray-400", children: "Activer les rappels (24h et 1h avant l'entretien)" })] }), _jsxs("div", { className: "flex justify-end gap-4", children: [_jsx("button", { type: "button", onClick: resetForm, className: "btn-secondary", children: "Annuler" }), _jsx("button", { type: "button", onClick: editingInterview ? handleUpdateInterview : handleAddInterview, disabled: loading, className: "btn-primary", children: loading ? (_jsx(LoadingSpinner, { size: "sm" })) : editingInterview ? ('Mettre à jour') : ('Ajouter') })] })] })] })), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "Entretiens \u00E0 venir" }), interviews.length === 0 ? (_jsx("div", { className: "text-center py-6 text-gray-400 bg-white/5 rounded-lg", children: "Aucun entretien programm\u00E9." })) : (_jsx("div", { className: "space-y-4", children: interviews
                            .filter(interview => isAfter(parseISO(interview.date), new Date()))
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map((interview) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "text-white font-medium", children: interview.job_application.job.title }), _jsx("span", { className: `px-2 py-0.5 rounded-full text-xs ${getInterviewStatusClass(interview.date)}`, children: getInterviewStatusLabel(interview.date) })] }), _jsx("p", { className: "text-gray-400", children: interview.job_application.job.company }), _jsxs("div", { className: "mt-2 grid grid-cols-1 md:grid-cols-2 gap-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [_jsx(CalendarIcon, { className: "h-4 w-4 text-primary-400" }), format(parseISO(interview.date), 'EEEE d MMMM yyyy', { locale: fr })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [_jsx(ClockIcon, { className: "h-4 w-4 text-primary-400" }), format(parseISO(interview.date), 'HH:mm', { locale: fr })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [_jsx(BriefcaseIcon, { className: "h-4 w-4 text-primary-400" }), "Entretien ", getInterviewTypeLabel(interview.type)] }), interview.location && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [_jsx(MapPinIcon, { className: "h-4 w-4 text-primary-400" }), interview.location] }))] }), (interview.contact_name || interview.contact_email) && (_jsxs("div", { className: "mt-2 flex items-center gap-2 text-sm text-gray-300", children: [_jsx(UserIcon, { className: "h-4 w-4 text-primary-400" }), interview.contact_name && _jsx("span", { children: interview.contact_name }), interview.contact_email && (_jsx("a", { href: `mailto:${interview.contact_email}`, className: "text-primary-400 hover:text-primary-300", children: interview.contact_email }))] })), interview.notes && (_jsx("div", { className: "mt-2 text-sm text-gray-300", children: _jsx("p", { className: "italic", children: interview.notes }) })), interview.reminder_set && (_jsxs("div", { className: "mt-2 flex items-center gap-2 text-sm text-green-400", children: [_jsx(BellIcon, { className: "h-4 w-4" }), "Rappels activ\u00E9s"] }))] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("button", { onClick: () => handleEditInterview(interview), className: "p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors", children: _jsx(PencilIcon, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleDeleteInterview(interview.id), className: "p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors", children: _jsx(TrashIcon, { className: "h-5 w-5" }) })] })] }) }, interview.id))) }))] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "Entretiens pass\u00E9s" }), interviews.filter(interview => isBefore(parseISO(interview.date), new Date())).length === 0 ? (_jsx("div", { className: "text-center py-6 text-gray-400 bg-white/5 rounded-lg", children: "Aucun entretien pass\u00E9." })) : (_jsx("div", { className: "space-y-4", children: interviews
                            .filter(interview => isBefore(parseISO(interview.date), new Date()))
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((interview) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "text-white font-medium", children: interview.job_application.job.title }), _jsx("span", { className: "bg-gray-600 text-gray-100 px-2 py-0.5 rounded-full text-xs", children: "Pass\u00E9" })] }), _jsx("p", { className: "text-gray-400", children: interview.job_application.job.company }), _jsxs("div", { className: "mt-2 grid grid-cols-1 md:grid-cols-2 gap-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [_jsx(CalendarIcon, { className: "h-4 w-4 text-primary-400" }), format(parseISO(interview.date), 'EEEE d MMMM yyyy', { locale: fr })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [_jsx(ClockIcon, { className: "h-4 w-4 text-primary-400" }), format(parseISO(interview.date), 'HH:mm', { locale: fr })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [_jsx(BriefcaseIcon, { className: "h-4 w-4 text-primary-400" }), "Entretien ", getInterviewTypeLabel(interview.type)] }), interview.location && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-300", children: [_jsx(MapPinIcon, { className: "h-4 w-4 text-primary-400" }), interview.location] }))] }), interview.notes && (_jsx("div", { className: "mt-2 text-sm text-gray-300", children: _jsx("p", { className: "italic", children: interview.notes }) }))] }), _jsx("div", { className: "flex flex-col gap-2", children: _jsx("button", { onClick: () => handleDeleteInterview(interview.id), className: "p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors", children: _jsx(TrashIcon, { className: "h-5 w-5" }) }) })] }) }, interview.id))) }))] })] }));
}
