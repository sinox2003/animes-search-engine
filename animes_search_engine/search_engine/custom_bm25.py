import math
import numpy as np

class BM25:
    def __init__(self, corpus):
        self.corpus_size = 0
        self.avgdl = 0
        self.doc_freqs = []
        self.idf = {}
        self.doc_len = []

        self._initialize(corpus)

    def _initialize(self, corpus):
        nd = {}  # word -> number of documents with word
        total_length = 0

        for document in corpus:
            self.doc_len.append(len(document))
            total_length += len(document)

            frequencies = {}
            for word in document:
                frequencies[word] = frequencies.get(word, 0) + 1
            self.doc_freqs.append(frequencies)

            for word in frequencies:
                nd[word] = nd.get(word, 0) + 1

            self.corpus_size += 1

        self.avgdl = total_length / self.corpus_size
        return nd

    def get_top_n(self, query, documents, n=5):
        assert self.corpus_size == len(documents), "The documents given don't match the index corpus!"

        scores = self.get_scores(query)
        top_n = np.argsort(scores)[::-1][:n]
        return [{"doc": documents[i], "score": scores[i]} for i in top_n if scores[i] > 3]


class BM25Okapi(BM25):
    def __init__(self, corpus, k1=1.5, b=0.75, epsilon=0.25):
        self.k1 = k1
        self.b = b
        self.epsilon = epsilon
        super().__init__(corpus)

    def _initialize(self, corpus):
        nd = super()._initialize(corpus)
        self._calc_idf(nd)

    def _calc_idf(self, nd):
        idf_sum = 0
        negative_idfs = []

        for word, freq in nd.items():
            idf = math.log(self.corpus_size - freq + 0.5) - math.log(freq + 0.5)
            self.idf[word] = idf
            idf_sum += idf
            if idf < 0:
                negative_idfs.append(word)

        self.average_idf = idf_sum / len(self.idf)
        eps = self.epsilon * self.average_idf
        for word in negative_idfs:
            self.idf[word] = eps

    def get_scores(self, query):
        scores = np.zeros(self.corpus_size)
        doc_len = np.array(self.doc_len)

        for q in query:
            q_freq = np.array([doc.get(q, 0) for doc in self.doc_freqs])
            scores += (self.idf.get(q, 0) * 
                       (q_freq * (self.k1 + 1) / (q_freq + self.k1 * (1 - self.b + self.b * doc_len / self.avgdl))))

        redundancy_bonus = np.array([sum(1 for q in query if doc.get(q, 0) > 1) for doc in self.doc_freqs])
        scores += redundancy_bonus

        full_match_bonus = np.array([all(q in doc for q in query) for doc in self.doc_freqs]) * 2
        scores += full_match_bonus

        return scores
