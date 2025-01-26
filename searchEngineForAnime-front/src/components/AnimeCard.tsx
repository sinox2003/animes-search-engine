import {Bookmark} from 'lucide-react';



const AnimeCard = ({anime, onPdfView, onBookmark, token}) => {
	return (
		<li className="bg-gray-900 rounded-lg  overflow-hidden shadow-lg border border-gray-700 hover:border-gray-500 transition-all duration-300">
			<div className="flex sm:flex-row  items-center flex-col h-full">
				{/* Left side - Image */}
				<div className="w-48 min-w-48 h-auto ">
					<img
						src={anime.image}
						alt={anime.title}
						className="w-full h-full object-cover"
					/>

				</div>

				{/* Right side - Content */}
				<div className="flex-1 p-4 flex flex-col">
					<div className="flex-1">
						{/* Header section */}
						<div className="flex justify-between items-start mb-2">
							<h3 className="text-xl font-bold text-white">{anime.title}</h3>
							<div className="flex items-center bg-blue-600/20 px-2 py-1 rounded">
								<span className="text-blue-400 font-semibold">{anime.score.toFixed(1)}</span>
							</div>
						</div>

						{/* Tags section */}
						<div className="flex flex-wrap gap-2 mb-3">
							{anime.genres.map((genre, index) => (
								<span
									key={index}
									className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
								>
                  {genre}
                </span>
							))}
						</div>

						{/* Info section */}
						<div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 text-sm">
							<div className="flex items-center gap-2">
								<span className="text-gray-400">Studios:</span>
								<span className="text-gray-200">{anime.studios}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-gray-400">Demographic:</span>
								<span className="text-gray-200">{anime.demographic}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-gray-400">Premiered:</span>
								<span className="text-gray-200">{anime.premiered?.season} {anime.premiered?.year}</span>
							</div>
						</div>

						{/* Description */}
						<p className="text-gray-300 text-sm line-clamp-2 mb-4">
							{anime.shortDescription}
						</p>
					</div>

					{/* Button section */}
					<div className="mt-auto flex justify-between">
						<button
							onClick={() => onPdfView(anime.doc_name)}
							className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-[5px] px-3 border-b-4 border-blue-700 active:border-b-0 hover:border-blue-500 rounded"
						>
							View Details
						</button>
						{token && (
							<button
								onClick={() => onBookmark(anime.id, anime.saved)}
								className="  p-[3px]"
							>
								<Bookmark
									className={`w-5 h-5 ${anime.saved ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'} hover:text-yellow-500 transition-colors`}
								/>
							</button>
						)}
					</div>
				</div>
			</div>
		</li>
	);
};

export default AnimeCard;