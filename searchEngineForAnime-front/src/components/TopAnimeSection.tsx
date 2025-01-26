import {useEffect, useState} from "react";
import AnimeCard from "./AnimeCard";
import {Skeleton} from "./Skeleton";
import {userService} from "../services/userService";
import PdfViewer from "./PdfViewer";
import {NoAnimeFound} from "./NoAnimeFound";
import axios from "axios";
import FilterModal from "./FilterModal.tsx";

interface Anime {
    id: number;
    saved: boolean;
    doc_name: string;
    // Add other anime properties here
}

interface AnimeResponse {
    content: Anime[];
    first: boolean;
    last: boolean;
    totalPages: number;  // Added missing property
}

const TopAnimeSection = () => {
    const [data, setData] = useState<AnimeResponse | null>(null);
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    let [isOpen, setIsOpen] = useState(false)

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem("authToken");
    const baseUrl = "http://localhost:8080/animes";

    useEffect(() => {
        fetchData(undefined);
    }, [currentPage, token]); // Added token as dependency

    const fetchData = async (filters:never) => {
        try {
            const params = {
                page: currentPage,
                userId:userId || null,
                ...filters,

            };

            // Flatten array fields into query parameters
            for (const key in filters) {
                if (Array.isArray(filters[key])) {
                    params[key] = filters[key].join(',');
                }
            }
            setLoading(true);
            const response = await axios.get<AnimeResponse>(
                baseUrl,
                {
                    params,
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined
                }
            );
            setData(response.data);
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Error fetching anime:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAnime = async (animeId: number, saved: boolean) => {
        if (!userId || !data?.content) return;

        try {
            // Optimistically update the UI
            const updatedContent = data.content.map((anime) =>
                anime.id === animeId ? { ...anime, saved: !saved } : anime
            );
            setData(prev => prev ? { ...prev, content: updatedContent } : null);

            if (saved) {
                await userService.removeAnimeFromUser(parseInt(userId), animeId);
            } else {
                await userService.addAnimeToUser(parseInt(userId), animeId);
            }
        } catch (error) {
            console.error('Error updating anime:', error);
            // Revert the change if the API call fails
            const revertedContent = data.content.map((anime) =>
                anime.id === animeId ? { ...anime, saved } : anime
            );
            setData(prev => prev ? { ...prev, content: revertedContent } : null);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const applyFilters = (filters)=>{
        console.log({
            page:currentPage,
            ...filters

        })
        fetchData(filters);
    }

    const showPagination = () => {
        return <div className="flex justify-center items-center gap-3  w-full  py-10">
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
                <div className="flex  max-w-full min-w-64  overflow-x-auto py-[5px]   [&::-webkit-scrollbar]:h-1


                                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">

                    {Array.from({length: data.totalPages}, (_, index) => (
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
    }

    return (
        <div className="flex flex-col items-center sm:px-20 px-4  ">
            <div id="top-anime" className="  justify-between flex items-center w-full pt-16">
                <div>
                    <h2 className="text-3xl font-semibold">Top Anime</h2>
                    <p className="text-gray-400">Check out the top-rated anime based on popularity and reviews.</p>
                </div>
                <button
                    onClick={() => setIsOpen(prevState => !prevState)}
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 active:border-b-0 hover:border-blue-500 rounded"
                >
                    Filter
                </button>
            </div>
            {showPagination()}

            <FilterModal baseUrl={baseUrl} isOpen={isOpen} onClose={() => setIsOpen(false)}
                         onApply={applyFilters}/>
            <section className="mb-8 w-full rounded-b-lg">
                <ul className="space-y-4">
                    {loading ? (
                        Array.from({length: 10}).map((_, index) => (
                            <div key={index}>
                                <Skeleton/>
                            </div>
                        ))
                    ) : data?.content && data.content.length > 0 ? (
                        data.content.map((anime) => (
                            <AnimeCard
                                key={anime.id}
                                anime={anime}
                                onPdfView={(docName) => setSelectedPdf(`http://localhost:5173/animes/${docName}`)}
                                onBookmark={handleAnime}
                                token={token}
                            />
                        ))
                    ) : (
                        <NoAnimeFound/>
                    )}
                </ul>
                {showPagination()}


                {selectedPdf && (
                    <PdfViewer
                        pdfUrl={selectedPdf}
                        onClose={() => setSelectedPdf(null)}
                    />
                )}
            </section>
        </div>
    );
};

export default TopAnimeSection;











