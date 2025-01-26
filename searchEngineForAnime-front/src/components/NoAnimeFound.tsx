
export const NoAnimeFound = ({ className = "w-88 h-72" }) => {
	return (
		<div className={`${className} flex items-center justify-center`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 400 300"
				className="w-full h-full"
			>
				<circle cx="200" cy="150" r="80" fill="#f3f4f6" opacity="0.3"/>

				<rect x="150" y="110" width="100" height="80" fill="#e5e7eb" rx="8"/>
				<rect x="160" y="120" width="80" height="60" fill="#f3f4f6" rx="4"/>

				<circle cx="240" cy="170" r="25" fill="none" stroke="#d1d5db" strokeWidth="8"/>
				<line x1="258" y1="188" x2="280" y2="210" stroke="#d1d5db" strokeWidth="8" strokeLinecap="round"/>

				<circle cx="200" cy="150" r="5" fill="#d1d5db"/>
				<path d="M180,170 Q200,160 220,170" fill="none" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round"/>

				<text x="140" y="100" fontFamily="Arial" fontSize="24" fill="#d1d5db" transform="rotate(-15, 140, 100)">?</text>
				<text x="250" y="100" fontFamily="Arial" fontSize="24" fill="#d1d5db" transform="rotate(15, 250, 100)">?</text>

				<text x="200" y="260" fontFamily="Arial" fontSize="16" fill="#9ca3af" textAnchor="middle">
					No Anime Found
				</text>
			</svg>
		</div>
	);
};

export default NoAnimeFound;