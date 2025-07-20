import { motion } from "framer-motion";
import { BookmarkIcon, BriefcaseIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { CircularProgressBar } from "./CircularProgressBar";

type JobCardProps = {
  title: string;
  company: string;
  logoUrl: string;
  location: string;
  isRemote: boolean;
  salary: string;
  matchScore: number; // 0 - 100
  tags: string[];
  favorited: boolean;
  onFavorite: () => void;
  onClick?: () => void;
};

export const JobCard = ({
  title,
  company,
  logoUrl,
  location,
  isRemote,
  salary,
  matchScore,
  tags,
  favorited,
  onFavorite,
  onClick,
}: JobCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -5px rgba(0,0,0,0.1)" }}
      className="group bg-white/50 dark:bg-zinc-800/40 backdrop-blur-lg border border-white/10 dark:border-zinc-700/50 rounded-2xl shadow-xl shadow-black/5 p-5 flex flex-col gap-3 relative transition cursor-pointer"
      onClick={onClick}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavorite();
        }}
        className="absolute top-4 right-4 z-10 p-2 -m-2" // Increased tap area for better UX
        aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <motion.div
          animate={{ scale: favorited ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          whileTap={{ scale: 0.8 }}
        >
          <BookmarkIcon
            className={`h-6 w-6 transition-colors duration-200 ${ 
              favorited 
                ? "text-yellow-400 fill-yellow-400/80" 
                : "text-zinc-300 group-hover:text-yellow-400"
            }`}
          />
        </motion.div>
      </button>
      
      {/* Logo & Entreprise */}
      <div className="flex items-center gap-3">
        <img
          src={logoUrl}
          alt={company}
          className="h-12 w-12 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800"
          onError={(e) => {
            // Fallback en cas d'erreur de chargement d'image
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=6366f1&color=fff&size=48`;
          }}
        />
        <div>
          <div className="font-bold text-lg text-zinc-800 dark:text-zinc-100">{company}</div>
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-sm">
            <BriefcaseIcon className="h-4 w-4 inline" />
            {title}
          </div>
        </div>
      </div>
      
      {/* Lieu & Remote */}
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm">
        <MapPinIcon className="h-4 w-4" />
        {location} 
        {isRemote && (
          <span className="ml-2 px-2 py-0.5 bg-blue-50 dark:bg-blue-950 rounded text-blue-700 dark:text-blue-300 text-xs">
            Remote
          </span>
        )}
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300"
          >
            {tag}
          </span>
        ))}
        {tags.length > 4 && (
          <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300">
            +{tags.length - 4}
          </span>
        )}
      </div>
      
      {/* Bas de carte */}
      <div className="flex items-end justify-between mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50">
        <div className="text-zinc-800 dark:text-zinc-100 font-semibold text-lg">
          {salary}
        </div>
        <CircularProgressBar progress={matchScore} size={50} strokeWidth={5} />
      </div>
    </motion.div>
  );
};
