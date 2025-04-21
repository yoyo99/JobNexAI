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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplications = JobApplications;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const pdf_1 = require("../lib/pdf");
const monitoring_1 = require("../lib/monitoring");
const outline_1 = require("@heroicons/react/24/outline");
const JobApplicationForm_1 = require("./JobApplicationForm");
const AutomatedApplications_1 = require("./applications/AutomatedApplications");
const CoverLetterGenerator_1 = require("./applications/CoverLetterGenerator");
const InterviewManager_1 = require("./applications/InterviewManager");
const statusColumns = [
    { id: 'draft', name: 'Brouillons', color: 'bg-gray-600' },
    { id: 'applied', name: 'Postulées', color: 'bg-blue-600' },
    { id: 'interviewing', name: 'Entretiens', color: 'bg-yellow-600' },
    { id: 'offer', name: 'Offres', color: 'bg-green-600' },
    { id: 'rejected', name: 'Refusées', color: 'bg-red-600' },
];
function JobApplications() {
    const { user } = (0, auth_1.useAuth)();
    const [applications, setApplications] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [selectedApplication, setSelectedApplication] = (0, react_1.useState)(null);
    const [showNotes, setShowNotes] = (0, react_1.useState)(false);
    const [notes, setNotes] = (0, react_1.useState)('');
    const [showForm, setShowForm] = (0, react_1.useState)(false);
    const [selectedJobId, setSelectedJobId] = (0, react_1.useState)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('kanban');
    (0, react_1.useEffect)(() => {
        if (user) {
            loadApplications();
        }
    }, [user]);
    const loadApplications = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase_1.supabase
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
            const { error } = yield supabase_1.supabase
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
            const { error } = yield supabase_1.supabase
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
            const { error } = yield supabase_1.supabase
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
            yield (0, pdf_1.downloadApplicationPDF)(application, {
                includeNotes: true,
                includeTimeline: true,
            });
            (0, monitoring_1.trackEvent)('application_exported_pdf', {
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
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: "Suivi des candidatures" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mt-1", children: "G\u00E9rez et suivez l'avancement de vos candidatures" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => {
                                setSelectedJobId(undefined);
                                setShowForm(true);
                            }, className: "btn-primary flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.PlusIcon, { className: "h-5 w-5" }), "Nouvelle candidature"] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6 border-b border-white/10", children: (0, jsx_runtime_1.jsxs)("nav", { className: "flex space-x-8", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('kanban'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'kanban'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Tableau Kanban" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('automated'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'automated'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Candidatures automatis\u00E9es" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('cover-letter'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'cover-letter'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Lettres de motivation" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('interviews'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'interviews'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Entretiens" })] }) }), activeTab === 'kanban' && ((0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.DragDropContext, { onDragEnd: handleDragEnd, children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-6", children: statusColumns.map((column) => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-medium text-white flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: `w-3 h-3 rounded-full ${column.color}` }), column.name] }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-400", children: applications.filter(app => app.status === column.id).length })] }), (0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.Droppable, { droppableId: column.id, children: (provided) => ((0, jsx_runtime_1.jsxs)("div", Object.assign({ ref: provided.innerRef }, provided.droppableProps, { className: "space-y-4", children: [applications
                                            .filter(app => app.status === column.id)
                                            .map((application, index) => ((0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.Draggable, { draggableId: application.id, index: index, children: (provided) => {
                                                const _a = provided.draggableProps, { style } = _a, dragProps = __rest(_a, ["style"]);
                                                return ((0, jsx_runtime_1.jsx)("div", Object.assign({ ref: provided.innerRef }, dragProps, provided.dragHandleProps, { style: style, children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card hover:bg-white/10 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-white", children: application.job.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: application.job.company })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleExportPDF(application), className: "text-gray-400 hover:text-white", title: "Exporter en PDF", children: (0, jsx_runtime_1.jsx)(outline_1.DocumentArrowDownIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                                                                        setSelectedApplication(application);
                                                                                        setNotes(application.notes || '');
                                                                                        setShowNotes(true);
                                                                                    }, className: "text-gray-400 hover:text-white", children: (0, jsx_runtime_1.jsx)(outline_1.PencilIcon, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => deleteApplication(application.id), className: "text-gray-400 hover:text-red-400", children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-4 w-4" }) })] })] }), application.next_step_date && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-primary-400", children: [(0, jsx_runtime_1.jsx)(outline_1.CalendarIcon, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { children: [(0, date_fns_1.format)(new Date(application.next_step_date), 'dd MMMM yyyy', { locale: locale_1.fr }), application.next_step_type && ` - ${application.next_step_type}`] })] })), application.notes && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 line-clamp-2", children: application.notes })), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["Mise \u00E0 jour ", (0, date_fns_1.format)(new Date(application.updated_at), 'dd/MM/yyyy', { locale: locale_1.fr })] })] }) }) })));
                                            } }, application.id))), provided.placeholder] }))) })] }, column.id))) }) })), activeTab === 'automated' && ((0, jsx_runtime_1.jsx)(AutomatedApplications_1.AutomatedApplications, {})), activeTab === 'cover-letter' && ((0, jsx_runtime_1.jsx)(CoverLetterGenerator_1.CoverLetterGenerator, {})), activeTab === 'interviews' && ((0, jsx_runtime_1.jsx)(InterviewManager_1.InterviewManager, {})), showNotes && selectedApplication && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/75 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-background rounded-lg p-6 w-full max-w-lg", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-medium text-white mb-4", children: ["Notes - ", selectedApplication.job.title] }), (0, jsx_runtime_1.jsx)("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), className: "w-full h-40 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Ajoutez vos notes ici..." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-4 mt-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setShowNotes(false), className: "btn-secondary", children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { onClick: updateNotes, className: "btn-primary", children: "Enregistrer" })] })] }) })), (0, jsx_runtime_1.jsx)(JobApplicationForm_1.JobApplicationForm, { isOpen: showForm, onClose: () => setShowForm(false), onSubmit: loadApplications, jobId: selectedJobId })] }));
}
