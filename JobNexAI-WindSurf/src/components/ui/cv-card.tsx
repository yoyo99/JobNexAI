import { UserIcon, PencilIcon, DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

type CVCardProps = {
  name: string;
  title: string;
  avatarUrl?: string;
  completion: number; // 0-100
  skills: string[];
  onEdit: () => void;
  onDownload: () => void;
  onPreview?: () => void;
  lastUpdated?: string;
};

export const CVCard = ({
  name,
  title,
  avatarUrl,
  completion,
  skills,
  onEdit,
  onDownload,
  onPreview,
  lastUpdated,
}: CVCardProps) => {
  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return "from-green-400 to-green-600";
    if (completion >= 60) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  const getCompletionText = (completion: number) => {
    if (completion >= 80) return "Excellent";
    if (completion >= 60) return "Bon";
    if (completion >= 40) return "Moyen";
    return "À améliorer";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 6px 32px 0 rgba(20,20,40,0.12)" }}
      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 transition"
    >
      {/* Avatar */}
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-16 w-16 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=64`;
            }}
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-white" />
          </div>
        )}
        
        {/* Badge de complétion */}
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-1">
          <div className="relative w-6 h-6">
            <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-zinc-200 dark:text-zinc-700"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 10}`}
                strokeDashoffset={`${2 * Math.PI * 10 * (1 - completion / 100)}`}
                className={`text-gradient bg-gradient-to-r ${getCompletionColor(completion)}`}
                style={{
                  stroke: completion >= 80 ? '#10b981' : completion >= 60 ? '#f59e0b' : '#ef4444'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                {completion}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className="text-center">
        <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-100">{name}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{title}</p>
        {lastUpdated && (
          <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">
            Mis à jour {lastUpdated}
          </p>
        )}
      </div>

      {/* Score de complétion */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            Complétion
          </span>
          <span className={`text-sm font-bold ${
            completion >= 80 ? 'text-green-600 dark:text-green-400' :
            completion >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
            'text-red-600 dark:text-red-400'
          }`}>
            {getCompletionText(completion)}
          </span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-2 rounded-full bg-gradient-to-r ${getCompletionColor(completion)}`}
          />
        </div>
      </div>

      {/* Compétences */}
      <div className="w-full">
        <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">
          Compétences principales
        </h4>
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-1 rounded-md text-xs font-medium">
              +{skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full">
        {onPreview && (
          <button
            onClick={onPreview}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition text-sm font-medium"
          >
            <EyeIcon className="h-4 w-4" />
            Aperçu
          </button>
        )}
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
        >
          <PencilIcon className="h-4 w-4" />
          Éditer
        </button>
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};
