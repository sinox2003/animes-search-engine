package org.projet.searchengineforanimeapi.services.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.projet.searchengineforanimeapi.dtos.AnimeDTO;
import org.projet.searchengineforanimeapi.dtos.Result;
import org.projet.searchengineforanimeapi.dtos.SearchResponse;
import org.projet.searchengineforanimeapi.dtos.SearchResult;
import org.projet.searchengineforanimeapi.entities.Anime;
import org.projet.searchengineforanimeapi.mappers.AnimeMapper;
import org.projet.searchengineforanimeapi.repositories.AnimeRepository;
import org.projet.searchengineforanimeapi.repositories.UserRepo;
import org.projet.searchengineforanimeapi.services.AnimeService;
import org.projet.searchengineforanimeapi.utility.AnimeFilter;
import org.projet.searchengineforanimeapi.utility.AnimeSpecification;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnimeServiceImlp implements AnimeService {
    private final AnimeRepository animeRepository; // Your JPA repository for Anime
    private final RestTemplate restTemplate;
    private final UserRepo userRepo;

    private String currentQuery;
    private SearchResult cachedDocNames;


    public AnimeServiceImlp(AnimeRepository animeRepository, RestTemplate restTemplate, UserRepo userRepo) {
        this.animeRepository = animeRepository;
        this.restTemplate = restTemplate;
        this.userRepo = userRepo;
    }

    @Override
    public void importAnimeData(String filePath) throws Exception {
        // Parse JSON file
        ObjectMapper mapper = new ObjectMapper();
        List<Anime> animes = mapper.readValue(new File(filePath), new TypeReference<List<Anime>>() {});

        // Save data to the database
        animeRepository.saveAll(animes);
    }

    @Override
    @Cacheable("searchAnimes")
    public SearchResponse search(String query, Long id , int pageNumber,int pageSize) {

        String url = "https://anime-search-engine.proudtree-eab701bf.germanywestcentral.azurecontainerapps.io/search?query=" + query;
        Set<Long> saved_animes = Set.of();
        List<AnimeDTO> animeList = new ArrayList<>();
        SearchResult docs;
        SearchResponse searchResponse ;

        if(!Objects.equals(query, this.currentQuery)) {

            // Perform the HTTP call
             docs = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    SearchResult.class
            ).getBody();

            if (id != null) {
                saved_animes = userRepo.findAnimesByUserId(id);
            }
        }else {
            docs = this.cachedDocNames;
        }

        if (docs != null && docs.getResults() != null) {
            List<Result> documents = docs.getResults();
            List<Anime> animePages ;
            int docsLength = documents.size();

            int totalPages = docsLength / pageSize ;

            searchResponse = new SearchResponse(pageNumber,pageSize,docsLength,totalPages + 1,true,true);

            if (totalPages < 1 ){
                animePages = animeRepository.findByDocNames(documents.stream().map(Result::getDoc).toList());

            }else {

                animePages = animeRepository.findByDocNames(documents.stream().skip((long) pageSize * pageNumber).limit(pageSize).map(Result::getDoc).toList());
                if(pageNumber != 0){
                    searchResponse.setIsFirst(false);
                }
                if(pageNumber != totalPages) {
                    searchResponse.setIsLast(false);
                }
            }

            List<AnimeDTO> animeDTOList = animePages.stream().map(AnimeMapper::toDto).toList();

            if(id != null && !saved_animes.isEmpty()){
                for(AnimeDTO animeDTO : animeDTOList){
                    animeDTO.setSaved(saved_animes.contains(animeDTO.getId()));
                }
            }

            animeList.addAll(animeDTOList);
            this.currentQuery = query;
            this.cachedDocNames = docs;

            searchResponse.setResults(animeList);
            searchResponse.setCorrect_query(docs.getCorrect_query());

            return searchResponse;

        }
        else {
            return null;
        }

    }


    @Override
    @Cacheable("animes")
    public Page<AnimeDTO> getFilterePaginatedAnime(AnimeFilter animeFilter, Pageable pageable, Long userId){
        Specification<Anime> specification = AnimeSpecification.withFilter(animeFilter);
        Page<AnimeDTO> animeList = animeRepository.findAll(specification,pageable).map(AnimeMapper::toDto);

        if(userId != null){
            Set<Long> saved_animes=userRepo.findAnimesByUserId(userId);

            for (AnimeDTO anime : animeList){
                if(saved_animes.contains(anime.getId())){
                    anime.setSaved(true);
                }
            }
        }

        return animeList;
    }

    @Override
    public Map<String, List<String>> getAllFilterOptions() {
        // Get the raw data
        List<String> premiered_years = animeRepository.findAllPremieredYears();
        List<String> premiered_seasons = animeRepository.findAllPremieredSeasons();
        List<String> studios = animeRepository.findAllStudios();
        List<String> demographics = animeRepository.findAllDemographics();
        List<String> genres = animeRepository.findAllGenres();
        Double maxScore = animeRepository.findMaxScore();
        Double minScore = animeRepository.findMinScore();

        // Create a mutable map to store the results
        Map<String, List<String>> filterOptions = new HashMap<>();

        filterOptions.put("premiered_years", premiered_years);
        filterOptions.put("premiered_seasons", premiered_seasons);
        filterOptions.put("score_range",List.of( String.valueOf(minScore),String.valueOf(maxScore)));

        filterOptions.put("studios", studios.stream()
                .filter(s -> s != null && !s.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList()));

        filterOptions.put("demographics", demographics.stream()
                .filter(d -> d != null && !d.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList()));

        filterOptions.put("genres", genres.stream()
                .filter(g -> g != null && !g.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList()));

        return filterOptions;
    }



}
