import {useEffect, useState} from "react";
import PdfViewer from "./PdfViewer";
import {userService} from "../services/userService";
import {Skeleton} from "./Skeleton.tsx";
import AnimeCard from "./AnimeCard.tsx";
import NoAnimeFound from "./NoAnimeFound.tsx"; // Adjust the path as needed

interface Anime {
	id: number;
	title: string;
	score: number;
	shortDescription: string;
	doc_name: string;
}

interface SavedAnimesProps {
	animes: Anime[],
	userId: number,
	onAnimeUnsave: (animeId: number) => void,
	loading?: boolean
}

const SavedAnimes: React.FC<SavedAnimesProps> = ({animes, userId, onAnimeUnsave, loading}) => {
	const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

	const token = localStorage.getItem("authToken");

	useEffect(() => {
		console.log(animes)
	}, [animes]);

	const handleUnsaveAnime = async (animeId: number) => {
		try {
            onAnimeUnsave(animeId);
            await userService.removeAnimeFromUser(userId, animeId);
			// Notify parent to update the list

		} catch (error) {
			console.error("Failed to remove anime:", error);
		}
	};

	return (
		<section className=" p-6 mb-8 z-0 rounded-b-lg">
			<h2 className="text-4xl  font-bold my-8">Saved Animes</h2>
			<ul className="space-y-4">
				{!loading ? (
					[0, 1, 2, 3 ].map((index) => (
						<div key={index}>
							<Skeleton/>
						</div>
					))
				) : animes && animes.length > 0 ? (
					animes.map((anime, index) => (
						<AnimeCard
							key={index}
							anime={anime}
							onPdfView={(docName) => setSelectedPdf(`http://localhost:5173/animes/${docName}`)}
							onBookmark={handleUnsaveAnime}
							token={token}
						/>
					))
				) : (
					<NoAnimeFound/>
				)}
			</ul>

			{/* PDF Viewer Modal */}
			{selectedPdf && (
				<PdfViewer
					pdfUrl={selectedPdf}
					onClose={() => setSelectedPdf(null)}
				/>
			)}
		</section>


	);
};

export default SavedAnimes;
