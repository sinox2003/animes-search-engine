# Anime Search Engine README

## Live Demo
🌐 Check out the live demo: [https://my-anime-search-engine.vercel.app](https://my-anime-search-engine.vercel.app)

## Overview

This project is an Anime Search Engine developed using a comprehensive technology stack:

- **Backend:** Spring Boot
  - Manages user authentication
  - Stores and retrieves anime data from a database
- **Search Engine:** Python
  - Implements fuzzy search using RapidFuzz
  - Web scraping of anime data
  - PDF generation
  - Search functionality with FastAPI
- **Frontend:** Vite React
  - Responsive and interactive user interface
  - Displays anime search results

The project combines multiple technologies to create a robust anime search platform with advanced search capabilities and user management.

## Technology Stack

- **Backend:** Spring Boot
- **Search Engine:** 
  - Python
  - FastAPI
  - RapidFuzz
- **Frontend:** Vite React
- **Database Management:** MySQL
- **Web Scraping:** Scrapy


## Prerequisites

- Python 3.8 or higher
- Scrapy
- pdfkit
- jinja2
- FastAPI
- Uvicorn
- NLTK
- RapidFuzz
- Pickle-mixin
- NumPy
- Postman (for API testing)
- MySQL Server (if using the backend with Spring Boot)
- Node.js (for running the React.js frontend)

## Features

- **Fuzzy Search:** The search engine supports fuzzy search using the RapidFuzz library.
- **Web Scraping:** Scrapes anime data from MyAnimeList.
- **PDF Generation:** Generates PDF files for each anime.
- **Search Engine:** Implements a search engine using the BM25 algorithm.
- **API:** Provides an API to query the search engine.

## Setup Instructions

### 1. Web Scraping

[... previous content remains the same ...]

### 3. Search Engine Setup

1. **Use the Pre-made Model:**
   - Open `animes_search_engine/search_engine/search_api.ipynb`.
   - Install necessary packages:
     ```bash
     !pip install fastapi uvicorn nltk rapidfuzz pickle-mixin numpy
     ```

   - **Cloudinary Image Storage Setup:**
     - Create a free Cloudinary account at [https://cloudinary.com/](https://cloudinary.com/)
     - Create a `.env` file in your project root directory
     - Add your Cloudinary credentials to the `.env` file:
       ```
       CLOUDINARY_CLOUD_NAME=your_cloud_name
       CLOUDINARY_API_KEY=your_api_key
       CLOUDINARY_API_SECRET=your_api_secret
       ```
     - Install Cloudinary Python SDK:
       ```bash
       pip install cloudinary
       ```
     - In your code, use the `python-dotenv` library to load these credentials:
       ```bash
       pip install python-dotenv
       ```
       ```python
       from dotenv import load_dotenv
       load_dotenv()  # load environment variables
       ```

   - If you don't want to use the Java backend, modify this line to get additional anime details:
     ```python
     doc_names = [anime['doc_name'] for anime in animes_json]
     ```
     to:
     ```python
     doc_names = animes_json
     ```
     
     - If you don't want to use the java backend Modify this line, in addition to getting the pdfs names as result you you also get the title and description and other fields that you can 
       use directly in the front(after modifing the search-page.tsx in the front):
     ```python
     doc_names = [anime['doc_name'] for anime in animes_json]
     ```
     to:
     ```python
     doc_names = animes_json
     ```
   - Run all cells to start the FastAPI server.

2. **Using Postman:**
   - Use Postman to interact with the API.
   - Input queries will be corrected using fuzzy search, and the output will be a JSON with the corrected query and a list of corresponding anime PDFs and their ranks using the BM25 algorithm.

### 4. Custom Search Engine

1. **Generate Custom Search Engine Data:**
   - Open `animes_search_engine/main.ipynb`.
   - Install necessary packages and run all cells.
   - This will generate `animes_data.json`, `flatten-corpus.json`, and `models/model.pkl`.

2. **Run the Search API:**
   - Open `animes_search_engine/search_engine/search_api.ipynb`.
   - Run all cells to start the FastAPI server.
  - If you don't want to use the java backend Modify this line, in addition to getting the pdfs names as result you you also get the title and description and other fields that you can use 
    directly in the front(after modifing the search-page.tsx in the front):
     ```python
     doc_names = [anime['doc_name'] for anime in animes_json]
     ```
     to:
     ```python
     doc_names = animes_json
     ```

### 5. Backend (Optional)

1. **Setup Backend:**
   - Go to `properties.yml` and create the database `animes`.
   - Run the Spring Boot backend.

2. **Import Anime Data:**
   - Use Postman to send a GET request:
     ```http
     http://localhost:8080/animes/import-anime?filePath=<absolute path of the animes_data.json>
     ```

### 6. Frontend Setup

1. **Install Node.js:**
   - Install Node.js from the official website if not already installed.

2. **Run the React.js Frontend:**
   - Navigate to the frontend directory:
     ```bash
     cd path/to/frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the application:
     ```bash
     npm start
     ```

## Usage

- Open your web browser and navigate to `http://localhost:4200`.
- Use the search engine to find and retrieve information about different animes.
- Use the provided API for programmatic access to the search engine.

## Additional Information

For any issues or questions, please refer to the project documentation or contact the project maintainers.

---

Thank you for using our Anime Search Engine! We hope it enhances your anime searching experience.
