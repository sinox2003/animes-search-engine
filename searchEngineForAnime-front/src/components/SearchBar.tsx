import {useEffect, useState} from "react";
import {Search} from "lucide-react";
import {useNavigate} from "react-router-dom";

const SearchBar = ({query}) => {
  const [searchQuery, setSearchQuery] = useState(query && query);
  const navigate = useNavigate()

  useEffect(() => {
    setSearchQuery(query)
  }, [query]);


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(searchQuery !== ''){
      navigate(`/search?query=${searchQuery}`)
      setSearchQuery(searchQuery)
    }
  };

  return (
    <div className="container  mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative flex items-center">
          {/* Input field */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anime by name (Eng/Jap), description, character, or voice actor..."
            className="w-full px-6 py-4 shadow-sm shadow-gray-600 bg-gray-800 text-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-100 pl-11"
          />
          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gray-700 text-white rounded-full hover:bg-blue-500 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

        </form>

      </div>
    </div>
  );
};

export default SearchBar;
