// components/home/CategoryGrid.tsx (optimized)
import Link from 'next/link';
import { 
  MdMovieFilter, 
  MdOutlineScience, 
  MdHistory, 
  MdOutlineSportsVolleyball,
  MdMusicNote 
} from "react-icons/md";
import { BiWorld } from "react-icons/bi";

const categories = [
  { 
    name: 'Movies', 
    desc: 'Film trivia & cinema quiz with answers',
    icon: <MdMovieFilter className="text-2xl text-blue-600 mb-2" />
  },
  { 
    name: 'Science', 
    desc: 'Biology, physics & chemistry explanations',
    icon: <MdOutlineScience className="text-2xl text-green-600 mb-2" />
  },
  { 
    name: 'History', 
    desc: 'Historical events & facts with context',
    icon: <MdHistory className="text-2xl text-amber-600 mb-2" />
  },
  { 
    name: 'Geography', 
    desc: 'World capitals & countries explained',
    icon: <BiWorld className="text-2xl text-green-600 mb-2" />
  },
  { 
    name: 'Sports', 
    desc: 'Athletics & sports trivia answers',
    icon: <MdOutlineSportsVolleyball className="text-2xl text-red-600 mb-2" />
  },
  { 
    name: 'Music', 
    desc: 'Music trivia & song quiz explanations',
    icon: <MdMusicNote className="text-2xl text-blue-600 mb-2" />
  }
];

export default function CategoryGrid() {
  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-gray-800 text-center sm:text-left">
          Popular Daily Quiz Categories with Answers
        </h3>
        <Link 
          href="/trivias" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors whitespace-nowrap"
          prefetch={false} // Disable prefetch for better performance
        >
          View All Categories →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((c) => (
          <Link
            key={c.name}
            href={`/trivias/${c.name.toLowerCase()}`}
            className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-4 text-center transition-colors group flex flex-col items-center"
            prefetch={false} // Disable prefetch for better performance
            title={c.desc}
          >
            {c.icon}
            <div className="font-medium text-gray-800 group-hover:text-blue-600">
              {c.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {c.desc}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}