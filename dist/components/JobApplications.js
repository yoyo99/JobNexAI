var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { downloadApplicationPDF } from '../lib/pdf';
import { trackEvent } from '../lib/monitoring';
import { CalendarIcon, PencilIcon, TrashIcon, PlusIcon, DocumentArrowDownIcon, } from '@heroicons/react/24/outline';
import { JobApplicationForm } from './JobApplicationForm';
import { AutomatedApplications } from './applications/AutomatedApplications';
import { CoverLetterGenerator } from './applications/CoverLetterGenerator';
import { InterviewManager } from './applications/InterviewManager';
import MatchingIA from './MatchingIA';
import AutomatedApplyButton from './AutomatedApplyButton';
const statusColumns = [
    { id: 'draft', name: 'Brouillons', color: 'bg-gray-600' },
    { id: 'applied', name: 'Postulées', color: 'bg-blue-600' },
    { id: 'interviewing', name: 'Entretiens', color: 'bg-yellow-600' },
    { id: 'offer', name: 'Offres', color: 'bg-green-600' },
    { id: 'rejected', name: 'Refusées', color: 'bg-red-600' },
];
export function JobApplications() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState();
    const [activeTab, setActiveTab] = useState('kanban');
    useEffect(() => {
        if (user) {
            loadApplications();
        }
    }, [user]);
    const loadApplications = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase
                .from('job_applications')
                .select(`
          *,
          job:jobs (
            id,
            title,
            company,
            location,
            url
          )
        `)
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .order('updated_at', { ascending: false });
            if (error)
                throw error;
            setApplications(data || []);
        }
        catch (error) {
            console.error('Error loading applications:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const handleDragEnd = (result) => __awaiter(this, void 0, void 0, function* () {
        if (!result.destination)
            return;
        const { draggableId, destination } = result;
        const newStatus = destination.droppableId;
        try {
            const { error } = yield supabase
                .from('job_applications')
                .update({
                status: newStatus,
                applied_at: newStatus === 'applied' ? new Date().toISOString() : null
            })
                .eq('id', draggableId);
            if (error)
                throw error;
            setApplications(prev => prev.map(app => app.id === draggableId
                ? Object.assign(Object.assign({}, app), { status: newStatus, applied_at: newStatus === 'applied' ? new Date().toISOString() : null }) : app));
        }
        catch (error) {
            console.error('Error updating application status:', error);
        }
    });
    const updateNotes = () => __awaiter(this, void 0, void 0, function* () {
        if (!selectedApplication)
            return;
        try {
            const { error } = yield supabase
                .from('job_applications')
                .update({ notes })
                .eq('id', selectedApplication.id);
            if (error)
                throw error;
            setApplications(prev => prev.map(app => app.id === selectedApplication.id
                ? Object.assign(Object.assign({}, app), { notes }) : app));
            setShowNotes(false);
        }
        catch (error) {
            console.error('Error updating notes:', error);
        }
    });
    const deleteApplication = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase
                .from('job_applications')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            setApplications(prev => prev.filter(app => app.id !== id));
        }
        catch (error) {
            console.error('Error deleting application:', error);
        }
    });
    const handleExportPDF = (application) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield downloadApplicationPDF(application, {
                includeNotes: true,
                includeTimeline: true,
            });
            trackEvent('application_exported_pdf', {
                applicationId: application.id,
                jobTitle: application.job.title,
                company: application.job.company,
            });
        }
        catch (error) {
            console.error('Error exporting application:', error);
        }
    });
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Suivi des candidatures" }), _jsx("p", { className: "text-gray-400 mt-1", children: "G\u00E9rez et suivez l'avancement de vos candidatures" })] }), _jsxs("button", { onClick: () => {
                                setSelectedJobId(undefined);
                                setShowForm(true);
                            }, className: "btn-primary flex items-center gap-2", children: [_jsx(PlusIcon, { className: "h-5 w-5" }), "Nouvelle candidature"] })] }) }), _jsx("div", { className: "mb-6 border-b border-white/10", children: _jsxs("nav", { className: "flex space-x-8", children: [_jsx("button", { onClick: () => setActiveTab('kanban'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'kanban'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Tableau Kanban" }), _jsx("button", { onClick: () => setActiveTab('automated'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'automated'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Candidatures automatis\u00E9es" }), _jsx("button", { onClick: () => setActiveTab('cover-letter'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'cover-letter'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Lettres de motivation" }), _jsx("button", { onClick: () => setActiveTab('interviews'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'interviews'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Entretiens" })] }) }), activeTab === 'kanban' && (_jsx(DragDropContext, { onDragEnd: handleDragEnd, children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-6", children: statusColumns.map((column) => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-lg font-medium text-white flex items-center gap-2", children: [_jsx("span", { className: `w-3 h-3 rounded-full ${column.color}` }), column.name] }), _jsx("span", { className: "text-sm text-gray-400", children: applications.filter(app => app.status === column.id).length })] }), _jsx(Droppable, { droppableId: column.id, children: (provided) => (_jsxs("div", Object.assign({ ref: provided.innerRef }, provided.droppableProps, { className: "space-y-4", children: [applications
                                            .filter(app => app.status === column.id)
                                            .map((application, index) => (_jsx(Draggable, { draggableId: application.id, index: index, children: (provided) => {
                                                const _a = provided.draggableProps, { style } = _a, dragProps = __rest(_a, ["style"]);
                                                return (_jsx("div", Object.assign({ ref: provided.innerRef }, dragProps, provided.dragHandleProps, { style: style, children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card hover:bg-white/10 transition-colors", children: _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-medium text-white", children: application.job.title }), _jsx("p", { className: "text-sm text-gray-400", children: application.job.company })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(MatchingIA, { userSkills: ['react', 'typescript', 'remote'], jobKeywords: ['react', 'node', 'remote'] }), _jsx(AutomatedApplyButton, { jobId: application.job.id })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: () => handleExportPDF(application), className: "text-gray-400 hover:text-white", title: "Exporter en PDF", children: _jsx(DocumentArrowDownIcon, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => {
                                                                                        setSelectedApplication(application);
                                                                                        setNotes(application.notes || '');
                                                                                        setShowNotes(true);
                                                                                    }, className: "text-gray-400 hover:text-white", children: _jsx(PencilIcon, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => deleteApplication(application.id), className: "text-gray-400 hover:text-red-400", children: _jsx(TrashIcon, { className: "h-4 w-4" }) })] })] }), application.next_step_date && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-primary-400", children: [_jsx(CalendarIcon, { className: "h-4 w-4" }), _jsxs("span", { children: [format(new Date(application.next_step_date), 'dd MMMM yyyy', { locale: fr }), application.next_step_type && ` - ${application.next_step_type}`] })] })), application.notes && (_jsx("p", { className: "text-sm text-gray-400 line-clamp-2", children: application.notes })), _jsxs("div", { className: "text-xs text-gray-500", children: ["Mise \u00E0 jour ", format(new Date(application.updated_at), 'dd/MM/yyyy', { locale: fr })] })] }) }) })));
                                            } }, application.id))), provided.placeholder] }))) })] }, column.id))) }) })), activeTab === 'automated' && (_jsx(AutomatedApplications, {})), activeTab === 'cover-letter' && (_jsx(CoverLetterGenerator, {})), activeTab === 'interviews' && (_jsx(InterviewManager, {})), showNotes && selectedApplication && (_jsx("div", { className: "fixed inset-0 bg-black/75 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-background rounded-lg p-6 w-full max-w-lg", children: [_jsxs("h3", { className: "text-lg font-medium text-white mb-4", children: ["Notes - ", selectedApplication.job.title] }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), className: "w-full h-40 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Ajoutez vos notes ici..." }), _jsxs("div", { className: "flex justify-end gap-4 mt-4", children: [_jsx("button", { onClick: () => setShowNotes(false), className: "btn-secondary", children: "Annuler" }), _jsx("button", { onClick: updateNotes, className: "btn-primary", children: "Enregistrer" })] })] }) })), _jsx(JobApplicationForm, { isOpen: showForm, onClose: () => setShowForm(false), onSubmit: loadApplications, jobId: selectedJobId })] }));
}
