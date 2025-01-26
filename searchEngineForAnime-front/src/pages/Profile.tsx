import {useEffect, useState} from "react";
import welcomImage from "../assets/ktyCLFc.gif";
import SavedAnimes from "../components/SavedAnimes";
import {userService} from "../services/userService";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "johndoe@example.com",
    bio: "Anime enthusiast and full-stack developer.",
  });

  type Anime = {
    id: number;
    title: string;
    score: number;
    shortDescription: string;
    doc_name: string;
  };

  const [savedAnimes, setSavedAnimes] = useState<Anime[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState({})
  const [loading, setLoading] = useState<boolean>(false)
  const pageSize = 10;

  const userId = localStorage.getItem("userId");
  const parsedUserId = userId ? parseInt(userId, 10) : null;

  // Fetch user information
  useEffect(() => {
    const fetchUserName = async () => {
      if (parsedUserId === null) {
        console.error("User ID is not available in localStorage.");
        return;
      }

      try {
        const username = await userService.getNameById(parsedUserId);
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          username,
        }));
      } catch (err) {
        console.error("Failed to fetch username:", err);
      }
    };

    fetchUserName();
  }, [parsedUserId]);

  // Function to load saved animes
  const loadSavedAnimes = async () => {
    if (parsedUserId === null) {
      console.error("User ID is not available.");
      return;
    }

    try {
      const response = await userService.getPaginatedAnimes(
        parsedUserId,
        currentPage,
        pageSize
      );
      setData(response);

      setSavedAnimes(response.content);
      // setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Failed to fetch animes:", err);
    }finally {
      setLoading(true)
    }
  };

  // Fetch saved animes when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(false)
    loadSavedAnimes();
  }, [currentPage]);

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle unsave anime
  const handleAnimeUnsave = (animeId: number) => {
    const updatedAnimes = savedAnimes.filter((anime) => anime.id !== animeId);
    setSavedAnimes(updatedAnimes); // Update the state to remove the anime from the list

    console.log(updatedAnimes.length , currentPage)

    // If the current page has no items, check if there are previous pages available
    if (updatedAnimes.length === 0 && currentPage > 0) {
      setCurrentPage(currentPage - 1); // Move to the previous page if necessary
    }

  };

  const showPagination = () => {
    if (!data?.totalPages || data?.totalPages <= 1) return null;


    return (
        <div className="flex justify-center items-center gap-3 w-full px-6 py-10">

          <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`font-bold py-2 px-4 rounded active:border-b-0 ${
                  data?.first
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed border-b-4 border-gray-400"
                      : "bg-blue-500 hover:bg-blue-400 text-white active:border-b-0 hover:border-blue-500 border-b-4 border-blue-700"
              }`}
              disabled={data?.first}
          >
            Previous
          </button>

          {data?.totalPages && (
              <div className="flex  max-w-full min-w-24  overflow-x-auto py-[5px]   [&::-webkit-scrollbar]:h-1


                                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">

                {Array.from({length: data?.totalPages}, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index)}
                        className={`px-3 font-bold rounded py-1 mx-1 active:border-b-0 ${
                            currentPage === index
                                ? "bg-blue-500 hover:bg-blue-400 text-white active:border-b-0 hover:border-blue-500 border-b-4 border-blue-700"
                                : "bg-gray-200 text-gray-400  border-b-4 border-gray-400"
                        } rounded`}
                    >
                      {index + 1}
                    </button>
                ))}
              </div>
          )}


          <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`font-bold py-2 px-4 rounded active:border-b-0 ${
                  data?.last
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed border-b-4 border-gray-400"
                      : "bg-blue-500 hover:bg-blue-400 text-white active:border-b-0 hover:border-blue-500 border-b-4 border-blue-700"
              }`}
              disabled={data?.last}
          >
            Next
          </button>
        </div>
    );
  };


  return (
    <div className="min-h-screen p-6">
      <header className="relative bg-gray-100 mt-14 rounded-t-lg">
        <img
          src={welcomImage}
          alt="Anime Banner"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </header>

      <section className="bg-white p-6 -mt-2 -pt-2 shadow-md -mb-1 text-center z-10">
        <h1 className="text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl drop-shadow-lg">
          Welcome, {userInfo.username}!
        </h1>
        <p className="text-lg mt-2 text-gray-700 md:text-xl lg:text-2xl drop-shadow-lg">
          Your anime journey starts here!
        </p>
      </section>

      <SavedAnimes
        animes={savedAnimes}
        userId={parsedUserId ?? 0}
        onAnimeUnsave={handleAnimeUnsave}
        loading={loading}
      />

      {showPagination()}
    </div>
  );
};

export default Profile;