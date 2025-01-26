"use client"

import {useEffect, useState} from "react"
import {Link} from "react-router-dom";

export default function NotFound() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY })
		}

		window.addEventListener("mousemove", handleMouseMove)
		return () => window.removeEventListener("mousemove", handleMouseMove)
	}, [])

	return (

		<div className="h-screen  bg-gray-900 relative overflow-hidden flex flex-col items-center justify-center">
			{/* Animated stars background */}
			<div className="absolute inset-0 overflow-hidden   ">
				{[...Array(100)].map((_, i) => (
					<div
						key={i}
						className="absolute bg-white rounded-full animate-twinkle"
						style={{
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							width: `${Math.random() * 3 + 1}px`,
							height: `${Math.random() * 3 + 1}px`,
							animationDelay: `${Math.random() * 5}s`,
						}}
					/>
				))}
			</div>

			{/* Moon with parallax effect */}
			<div
				className="absolute w-96 h-96 rounded-full bg-indigo-300/50"
				style={{
					transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
					transition: "transform 0.1s ease-out",
				}}
			/>

			<div className="relative z-10 text-center space-y-8 p-4 max-w-2xl mx-auto">
				{/* Glitch effect text */}
				<h1
					className="text-[150px] font-bold text-white relative inline-block
          animate-pulse filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]
          before:content-['404'] before:absolute before:left-[2px] before:text-red-500/75
          after:content-['404'] after:absolute after:left-[-2px] after:text-blue-500/75"
				>
					404
				</h1>

				<div className="space-y-4">
					<h2 className="text-2xl md:text-4xl font-bold text-white">Nani?! This Page Doesn't Exist</h2>

					<p className="text-gray-400 text-lg">
						Looks like you've wandered into the wrong dimension, senpai! Let's get you back to a world you know...
					</p>
				</div>

				{/* Updated button style */}
				<Link
					to="/"
					className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold py-[5px] px-3 border-b-4 border-blue-700 active:border-b-0 hover:border-blue-500 rounded transition-all duration-150 ease-in-out transform hover:-translate-y-px active:translate-y-0"
				>
					Return to Homepage
				</Link>
			</div>

			{/* Anime-style decorative elements */}
			<div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-2xl"></div>
			<div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
		</div>
	)
}

