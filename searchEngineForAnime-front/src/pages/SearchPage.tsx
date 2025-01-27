import SearchBar from "../components/SearchBar";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import PdfViewer from "../components/PdfViewer";
import {Skeleton} from "../components/Skeleton";
import {userService} from "../services/userService";
import {ChevronDown, ChevronUp, Search} from 'lucide-react';
import AnimeCard from "../components/AnimeCard";
import NoAnimeFound from "../components/NoAnimeFound";

interface Premiered {
	id: number;
	season: string;
	year: string;
}

interface Anime {
	id: number;
	title: string;
	score: number;
	shortDescription: string;
	doc_name: string;
	genres: string[];
	demographic: string | null;
	studios: string;
	premiered: Premiered | null;
	saved: boolean | null;
	image: string;
}

interface SearchResponse {
	correct_query: string[][];
	results: Anime[];
	number: number;
	size: number;
	totalElements: number;
	totalPages: number;
	isFirst: boolean;
	isLast: boolean;
}

export const SearchPage = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const [data, setData] = useState<SearchResponse>({
		correct_query: [],
		results: [],
		number: 0,
		size: 10,
		totalElements: 0,
		totalPages: 0,
		isFirst: true,
		isLast: true
	});
	const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [selectedWords, setSelectedWords] = useState<Record<number, string>>({});
	const [openDropdown, setOpenDropdown] = useState<number | null>(null);

	const userId = localStorage.getItem('userId');
	const query = params.get('query');
	const token = localStorage.getItem("authToken");
	const url = `http://localhost:8080/animes/search?query=`;

	useEffect(() => {

		getSearchResults();

	}, [query, data.number]);

	useEffect(() => {
		setData(prevState => ({
			...prevState,number: 0
		}))
	}, [query]);

	useEffect(() => {
		if (data.correct_query.length > 0) {
			const initialSelected = {};
			data.correct_query.forEach((options, index) => {
				initialSelected[index] = options[0];
			});
			setSelectedWords(initialSelected);
		}
	}, [data.correct_query]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [data.number]);

	const handleAnime = async (animeId: number, saved: boolean) => {
		const updatedResults = data.results.map((anime) =>
			anime.id === animeId ? { ...anime, saved: !saved } : anime
		);

		setData(prev => ({
			...prev,
			results: updatedResults
		}));

		try {
			if (saved) {
				await userService.removeAnimeFromUser(parseInt(userId), animeId);
			} else {
				await userService.addAnimeToUser(parseInt(userId), animeId);
			}
		} catch (error) {
			console.error(error);
			// Revert on error
			setData(prev => ({
				...prev,
				results: data.results
			}));
		}
	};

	const getSearchResults = async () => {
		setLoading(false);
		try {
			const response = await axios.get<SearchResponse>(
				userId !== ''
					? `${url}${query}&pageNumber=${data.number}&userId=${userId}`
					: `${url}${query}&pageNumber=${data.number}`
			);
			setData(response.data);
		} catch (error) {
			console.error('Error fetching search results:', error);
		} finally {
			setLoading(true);
		}
	};

	const handleWordSelection = (index: number, word: string) => {
		setSelectedWords(prev => ({
			...prev,
			[index]: word
		}));
	};

	const handleSearch = () => {
		const queryWords = query.toLowerCase().split(' ');
		const newQuery = queryWords.map((word, i) => selectedWords[i] || word).join(' ');
		navigate(`/search?query=${encodeURIComponent(newQuery)}`);
	};

	const handlePageChange = (page: number) => {
		setData(prev => ({
			...prev,
			number: page
		}));
	};

	const showPagination = () => {
		if (!data.totalPages || data.totalPages <= 1) return null;



		return (
			<div className="flex justify-center items-center gap-3 w-full px-6 py-10">

				<button
					onClick={() => handlePageChange(data.number - 1)}
					className={`font-bold py-2 px-4 rounded active:border-b-0 ${
						data.isFirst
							? "bg-gray-200 text-gray-400 cursor-not-allowed border-b-4 border-gray-400"
							: "bg-blue-500 hover:bg-blue-400 text-white active:border-b-0 hover:border-blue-500 border-b-4 border-blue-700"
					}`}
					disabled={data.isFirst}
				>
					Previous
				</button>

				{data?.totalPages && (
					<div className="flex  max-w-full min-w-24  overflow-x-auto py-[5px]   [&::-webkit-scrollbar]:h-1


                                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">

						{Array.from({length: data.totalPages}, (_, index) => (
							<button
								key={index}
								onClick={() => handlePageChange(index)}
								className={`px-3 font-bold rounded py-1 mx-1 active:border-b-0 ${
									data.number === index
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
					onClick={() => handlePageChange(data.number + 1)}
					className={`font-bold py-2 px-4 rounded active:border-b-0 ${
						data.isLast
							? "bg-gray-200 text-gray-400 cursor-not-allowed border-b-4 border-gray-400"
							: "bg-blue-500 hover:bg-blue-400 text-white active:border-b-0 hover:border-blue-500 border-b-4 border-blue-700"
					}`}
					disabled={data.isLast}
				>
					Next
				</button>
			</div>
		);
	};

	const renderCorrectQuery = () => {
		if (!loading || !data.correct_query || !Array.isArray(data.correct_query) ||
			data.correct_query.join(" ") === query.toLowerCase()) {
			return <div className="px-10 text my-9 text-red-600" />;
		}

		return (
			<div className="bg-gray-900 text text-xl font-semibold flex items-center rounded-lg px-10 my-9">
				<h3 className="text-red-600 mr-2">Did you mean:</h3>
				<div className="flex items-center gap-2">
					{data.correct_query.map((options, index) => {
						if (options.length <= 1) {
							return (
								<span
									key={index}
									className="font-bold italic text-blue-400"
								>
                  {options[0]}{index < data.correct_query.length - 1 ? ' ' : ''}
                </span>
							);
						}

						return (
							<div key={index} className="inline-block relative">
								<button
									onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
									className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
								>
                  <span className="text-blue-400 font-medium">
                    {selectedWords[index] || options[0]}
                  </span>
									{openDropdown === index ? (
										<ChevronUp className="w-4 h-4 text-blue-400" />
									) : (
										<ChevronDown className="w-4 h-4 text-blue-400" />
									)}
								</button>

								{openDropdown === index && (
									<div className="absolute top-full left-0 mt-1 w-max bg-gray-800 shadow-lg rounded-md border border-gray-700 py-1 z-20">
										{options.map((option, optionIndex) => (
											<div
												key={optionIndex}
												onClick={() => {
													handleWordSelection(index, option);
													setOpenDropdown(null);
												}}
												className="block px-4 py-2 text-left text-blue-400 hover:bg-gray-700 transition-colors cursor-pointer"
											>
												{option}
											</div>
										))}
									</div>
								)}
							</div>
						);
					})}
					<button
						onClick={handleSearch}
						className="ml-4 inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
					>
						<Search className="w-4 h-4" />
						Search
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen text-white">
			<div className="max-w-3xl flex items-center mx-auto pt-20">
				<SearchBar query={query} />
			</div>
			{renderCorrectQuery()}
			<section className="px-6 mb-8 z-0 rounded-b-lg">
				<ul className="space-y-4">
					{!loading ? (
						[0, 1, 2, 3, 4, 5].map((index) => (
							<div key={index}>
								<Skeleton />
							</div>
						))
					) : data.results && data.results.length > 0 ? (
						data.results.map((anime, index) => (
							<AnimeCard
								key={index}
								anime={anime}
								onPdfView={(docName) => setSelectedPdf(`http://localhost:5173/animes/${docName}`)}
								onBookmark={handleAnime}
								token={token}
							/>
						))
					) : (
						<NoAnimeFound />
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
