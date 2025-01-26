from fastapi import FastAPI
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.stem import PorterStemmer
import pickle
from rapidfuzz import process
import json
import nest_asyncio 
import glob
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware



nltk.download('stopwords')
nltk.download('wordnet')
lemmatizer = WordNetLemmatizer()
ps = PorterStemmer()
stop_words = set(stopwords.words('english'))



#lower, remove punctuations , remove stop words , tokenize input
def filter_text(input_string , string , stop_words):
    tokenized_input = input_string.translate(str.maketrans('', '', string.punctuation)).lower().split()
    filterd_tokenized_input = [w for w in tokenized_input if not w in stop_words]
    filterd_tokenized_input = [ps.stem(lemmatizer.lemmatize(i)) for i in filterd_tokenized_input ]
    return filterd_tokenized_input

print(os.getcwd())

#loading the bm25 model
with open(r"models\model.pkl", 'rb') as file:
    model = pickle.load(file)

# loading the flatten corpus for the fuzzy search
with open('flatten_corpus.json', 'r', encoding='utf-8') as json_file:
    flatten_corpus = json.load(json_file)

# loading the the pdfs jsons : results
with open('animes_data.json', 'r', encoding='utf-8') as json_file:
    animes_json = json.load(json_file)


print([anime["image"] for anime in animes_json])


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


doc_names = [anime['doc_name'] for anime in animes_json]



@app.get("/search")
def anime_search(query : str):


    tokenized_query = query.translate(str.maketrans('', '', string.punctuation)).lower().split()

    fuzzy_tokenized_query_list = []
    correct_querry_options = []

    for q in tokenized_query:
        if len(q) <= 2:
            q=q
            p=[q]
        else :
            options = process.extract(q,flatten_corpus,limit=3)
            print(options)
            p = [option[0] for option in options] if options[0][1] != 100.0 else [options[0][0]]
            fuzzy_query = process.extractOne(q, flatten_corpus)
            q = fuzzy_query[0] if fuzzy_query[1] > 79 else q
            
        fuzzy_tokenized_query_list.append(q)
        correct_querry_options.append(p)

    fuzzy_tokenized_query = ' '.join(fuzzy_tokenized_query_list)

    fuzzy_tokenized_cleaned_query = filter_text(fuzzy_tokenized_query , string , stop_words)
    
    result = model.get_top_n(fuzzy_tokenized_cleaned_query , doc_names, n = 100)
    print({'correct_query':correct_querry_options,'results':result})

    return {'correct_query':correct_querry_options,'results':result}



nest_asyncio.apply()
uvicorn.run(app, port=8000)