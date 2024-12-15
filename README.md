# Anime Search Engine README

## Overview

This project is an Anime Search Engine that supports fuzzy search, developed from scratch using Python. The project involves web scraping, PDF generation, and setting up a search engine with FastAPI. Below are the steps to set up and run the project.

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

1. **Install Scrapy:**
   ```bash
   pip install scrapy
   ```

2. **Scrape Anime Data:**
   - Go to `animes_search_engine/animescraper/spiders/animespider.py`.
   - Change the number of animes to scrape by modifying the following code:
     ```python
     if next_page is not None:
         if "400" in next_page:
             pass
         else:
             next_url = "https://myanimelist.net/topanime.php" + next_page
             yield response.follow(next_url, callback=self.parse)
     ```

3. **Run the Scraper:**
   - Open the terminal and navigate to the spider directory:
     ```bash
     cd animes_search_engine/animescraper/spiders
     ```
   - Run the spider to generate `animesList.json`:
     ```bash
     scrapy crawl animespider -O animesList.json
     ```

### 2. PDF Generation

1. **Install Dependencies:**
   ```bash
   pip install pdfkit jinja2
   ```

2. **Generate PDFs:**
   - Open `animes_search_engine/pdf_transformer/generate_pdfs.py`.
   - Change the absolute paths in the file to your own paths.
   - Run the script to generate PDFs:
     ```bash
     python animes_search_engine/pdf_transformer/generate_pdfs.py
     ```

### 3. Search Engine Setup

1. **Use the Pre-made Model:**
   - Open `animes_search_engine/search_engine/search_api.ipynb`.
   - Install necessary packages:
     ```bash
     !pip install fastapi uvicorn nltk rapidfuzz pickle-mixin numpy
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
