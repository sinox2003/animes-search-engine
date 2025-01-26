

export const Skeleton = () => {
	return (
		// <div role="status"
		//      className="max-w p-4  border border-gray-200 rounded-lg shadow animate-pulse md:p-6 dark:border-gray-700">
		//
		// 	<div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-4/12 mb-5"></div>
		// 	<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20  mb-5"></div>
		// 	<div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
		// 	{/*<div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700  mb-2.5"></div>*/}
		// 	<div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-5/12"></div>
		// 	<div className="h-10 bg-gray-200 rounded dark:bg-gray-700 w-28 mt-5"></div>
		// 	<span className="sr-only">Loading...</span>
		// </div>

	<li className="bg-gray-900  rounded-lg overflow-hidden shadow-lg border border-gray-700">
		<div className="flex h-full">
			{/* Left side - Image skeleton */}
			<div className="w-48 min-w-48 h-64 bg-gray-800 animate-pulse"/>

			{/* Right side - Content skeleton */}
			<div className="flex-1 p-4 flex flex-col">
				<div className="flex-1">
					{/* Header section skeleton */}
					<div className="flex justify-between items-start mb-2">
						<div className="h-6 bg-gray-800 rounded w-1/2 animate-pulse"/>
						<div className="h-9 w-9 bg-gray-800 rounded animate-pulse"/>
					</div>

					{/* Tags section skeleton */}
					<div className="flex flex-wrap gap-2 mb-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-6 w-16 bg-gray-800 rounded-full animate-pulse"
							/>
						))}
					</div>

					{/* Info section skeleton */}
					<div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
						{[1, 2, 3].map((i) => (
							<div key={i} className="h-4 bg-gray-800 w-24 rounded animate-pulse"/>
						))}
					</div>

					{/* Description skeleton */}
					<div className="space-y-2 mb-4">
						<div className="h-4 bg-gray-800 rounded animate-pulse"/>
						<div className="h-4 bg-gray-800 rounded animate-pulse w-3/4"/>
					</div>
				</div>

				{/* Button section skeleton */}
				<div className="mt-auto flex justify-between">
					<div className="h-8 w-24 bg-gray-800 rounded animate-pulse"/>
					<div className="h-8 w-7  bg-gray-800 rounded animate-pulse"/>
				</div>
			</div>
		</div>
	</li>
)
	;
};