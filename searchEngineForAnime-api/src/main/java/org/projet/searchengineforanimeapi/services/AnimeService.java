package org.projet.searchengineforanimeapi.services;

import org.projet.searchengineforanimeapi.dtos.AnimeDTO;
import org.projet.searchengineforanimeapi.dtos.SearchResponse;
import org.projet.searchengineforanimeapi.entities.Premiered;
import org.projet.searchengineforanimeapi.utility.AnimeFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface AnimeService{

    void importAnimeData(String filePath) throws Exception;

    SearchResponse search(String query, Long id, int pageNumber,int pageSize) throws Exception;


    Page<AnimeDTO> getFilterePaginatedAnime(AnimeFilter animeFilter, Pageable pageable, Long userId);

    Map<String, List<String>> getAllFilterOptions();

}
