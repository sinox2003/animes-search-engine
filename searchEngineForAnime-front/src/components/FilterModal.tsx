import React, {useEffect, useState} from 'react';
import {Dialog} from '@headlessui/react';
import Select, {OnChangeValue} from 'react-select';
import axios from "axios";

interface FilterModalProps {
	isOpen: boolean;
	onClose: () => void;
	onApply: (filters: any) => void;
	baseUrl: string;
}



const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, baseUrl }) => {
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [selectedDemographics, setSelectedDemographics] = useState<string[]>([]);
	const [selectedStudios, setSelectedStudios] = useState<string[]>([]);
	const [selectedSeasons, setSelectedSeasons] = useState<string[] | null>([]);
	const [selectedYears, setSelectedYears] = useState<string[] | null>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [data, setData] = useState<any>(null);
	const [score_min, setScoreMin] = useState<number>(0);
	const [score_max, setScoreMax] = useState<number>(10);

	const [showAllGenres, setShowAllGenres] = useState(false);
	const [showAllStudios, setShowAllStudios] = useState(false);
	const [showAllDemographics, setShowAllDemographics] = useState(false);

	const ITEMS_TO_SHOW = 12;

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${baseUrl}/filters`);
			setData(response.data);
			setScoreMin(response.data?.score_range[0])
			setScoreMax(response.data?.score_range[1])
		} catch (error) {
			if (!axios.isCancel(error)) {
				console.error('Error fetching anime:', error);
			}
		} finally {
			setLoading(false);
		}
	};

	// Convert data for react-select
	const seasonOptions = data?.premiered_seasons?.map((season: string) => ({
		value: season,
		label: season
	})) || [];

	const yearOptions = data?.premiered_years?.map((year: string) => ({
		value: year,
		label: year
	})) || [];

	const handleGenreToggle = (genre: string) => {
		setSelectedGenres(prev =>
			prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
		);
	};

	const handleDemographicToggle = (demographic: string) => {
		setSelectedDemographics(prev =>
			prev.includes(demographic) ? prev.filter(d => d !== demographic) : [...prev, demographic]
		);
	};

	const handleStudioToggle = (studio: string) => {
		setSelectedStudios(prev =>
			prev.includes(studio) ? prev.filter(s => s !== studio) : [...prev, studio]
		);
	};

	const handleSelectPremieredSeasons = (season: OnChangeValue<unknown, false>) => {
		setSelectedSeasons(season);
	};

	const handleSelectPremieredYears = (year: OnChangeValue<unknown, false>) => {
		setSelectedYears(year);
	};


	const handleApply = () => {
		const filters = {
			score_min,
			score_max,
			genres: selectedGenres,
			demographic: selectedDemographics,
			studios: selectedStudios,
			premiered_seasons: selectedSeasons?.map(season => season?.value),
			premiered_years: selectedYears?.map(year => year?.value),
		};
		onApply(filters);
		// onClose();
	};

	const handleResetFilter = () => {
		setScoreMin(data?.score_range[0]);
		setScoreMax( data?.score_range[1]);
		setSelectedDemographics([]);
		setSelectedSeasons([]);
		setSelectedYears([]);
		setSelectedGenres([]);
		setSelectedStudios([]);
	};

	const customSelectStyles = {
		control: (base: any) => ({
			...base,
			background: '#1f2937',
			borderColor: '#374151',
			'&:hover': {
				borderColor: '#4B5563'
			}
		}),
		menu: (base: any) => ({
			...base,
			background: '#1f2937',
			color: '#D1D5DB'
		}),
		option: (base: any, state: { isSelected: boolean; isFocused: boolean }) => ({
			...base,
			backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#374151' : undefined,
			'&:active': {
				backgroundColor: '#2563EB'
			}
		}),
		multiValue: (base: any) => ({
			...base,
			backgroundColor: '#3B82F6',
			color: '#ffffff'
		}),
		multiValueLabel: (base: any) => ({
			...base,
			color: '#ffffff'
		}),
		multiValueRemove: (base: any) => ({
			...base,
			color: '#ffffff',
			':hover': {
				backgroundColor: '#2563EB',
				color: '#ffffff',
			},
		}),
		input: (base: any) => ({
			...base,
			color: '#D1D5DB'
		})

	};

	const renderFilterSection = (
		title: string,
		items: string[],
		selectedItems: string[],
		onToggle: (item: string) => void,
		showAll: boolean,
		setShowAll: (show: boolean) => void
	) => {
		const displayedItems = showAll ? items : items?.slice(0, ITEMS_TO_SHOW);

		return (
			<div>
				<label className="block mb-2 text-sm font-medium text-gray-300">{title}</label>
				<div className="flex flex-wrap gap-2">
					{displayedItems?.map((item) => (
						<button
							key={item}
							className={`px-3 py-1 rounded-full text-sm transition-colors ${
								selectedItems.includes(item)
									? 'bg-blue-600 hover:bg-blue-700 text-white'
									: 'bg-gray-800 hover:bg-gray-700 text-gray-300'
							}`}
							onClick={() => onToggle(item)}
						>
							{item}
						</button>
					))}
				</div>
				{items?.length > ITEMS_TO_SHOW && (
					<button
						onClick={() => setShowAll(!showAll)}
						className="mt-2 text-blue-500 hover:text-blue-400 text-sm"
					>
						{showAll ? 'Show Less' : `Show More (${items.length - ITEMS_TO_SHOW} more)`}
					</button>
				)}
			</div>
		);
	};

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
		>
			<div className="bg-gray-900 text-gray-300 py-6 rounded-2xl shadow-xl  w-[800px] border border-gray-800">
				<Dialog.Title className="text-xl font-semibold px-6 text-white">Filter Animes</Dialog.Title>

				<div className="mt-6 h-[90vh] overflow-auto  [&::-webkit-scrollbar]:w-2
					  [&::-webkit-scrollbar-track]:rounded-full
					  [&::-webkit-scrollbar-thumb]:bg-gray-300
					  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
					  dark:[&::-webkit-scrollbar-track]:rounded-full
					  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb]:rounded-full px-6 space-y-6">
					{/* Score Range Slider */}
					<div>
						<label className="block mb-2 text-sm font-medium text-gray-300">
							Score Range: {score_min > score_max ?  score_max +" - "+ score_min : score_min +" - "+ score_max }
						</label>
						<div className="space-y-4">
							<input
								type="range"
								min={data?.score_range[0]}
								max={data?.score_range[1]}
								step="0.01"
								value={score_min}
								onChange={(e) => setScoreMin(+e.target.value)}
								className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
							/>
							<input
								type="range"
								min={data?.score_range[0]}
								max={data?.score_range[1]}
								step="0.01"
								value={score_max}
								onChange={(e) => setScoreMax(+e.target.value)}
								className="w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
							/>
						</div>
					</div>
					<div>
						<label className="block mb-2 text-sm font-medium text-gray-300">Premiered</label>
						<div className="grid grid-cols-2 gap-4">
							<Select
								closeMenuOnSelect={false}
								isMulti
								options={seasonOptions}
								value={selectedSeasons}
								onChange={(option) => handleSelectPremieredSeasons(option)}
								styles={customSelectStyles}
								placeholder="Select season..."
								isClearable
							/>
							<Select
								closeMenuOnSelect={false}
								isMulti
								options={yearOptions}
								value={selectedYears}
								onChange={(option) => handleSelectPremieredYears(option)}
								styles={customSelectStyles}
								placeholder="Select year..."
								isClearable
							/>
						</div>
					</div>
					{/* Filter Sections */}
					{renderFilterSection(
						"Genres",
						data?.genres || [],
						selectedGenres,
						handleGenreToggle,
						showAllGenres,
						setShowAllGenres
					)}

					{renderFilterSection(
						"Demographics",
						data?.demographics || [],
						selectedDemographics,
						handleDemographicToggle,
						showAllDemographics,
						setShowAllDemographics
					)}

					{renderFilterSection(
						"Studios",
						data?.studios || [],
						selectedStudios,
						handleStudioToggle,
						showAllStudios,
						setShowAllStudios
					)}

					{/* Premiered Section */}

				</div>

				<div className="mt-8 px-6 flex justify-between">
					<button
						className="bg-gray-700 hover:bg-gray-700 px-4 border-b-4 border-gray-800 font-bold py-2 active:border-b-0 rounded transition-colors text-gray-300"
						onClick={handleResetFilter}
					>
						Reset
					</button>
					<div className="space-x-4">
						<button
							className="bg-gray-700 hover:bg-gray-700 px-4 border-b-4 border-gray-800 font-bold py-2 active:border-b-0 rounded transition-colors text-gray-300"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 active:border-b-0 hover:border-blue-500 rounded"
							onClick={handleApply}
						>
							Apply
						</button>
					</div>
				</div>
			</div>
		</Dialog>
	);
};

export default FilterModal;