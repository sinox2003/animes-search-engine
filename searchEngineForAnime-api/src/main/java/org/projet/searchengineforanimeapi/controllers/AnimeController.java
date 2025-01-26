package org.projet.searchengineforanimeapi.controllers;

import org.projet.searchengineforanimeapi.dtos.AnimeDTO;
import org.projet.searchengineforanimeapi.dtos.SearchResponse;
import org.projet.searchengineforanimeapi.entities.Premiered;
import org.projet.searchengineforanimeapi.services.AnimeService;
import org.projet.searchengineforanimeapi.utility.AnimeFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/animes")
public class AnimeController {

    private final AnimeService animeService;

    public AnimeController(AnimeService animeService) {
        this.animeService = animeService;
    }

    @GetMapping("/import-anime")
    public String importAnime(@RequestParam String filePath) {
        System.out.println(filePath);
        try {
            animeService.importAnimeData(filePath);
            return "Anime data imported successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to import anime data: " + e.getMessage();
        }
    }

    @GetMapping("/search")
    public SearchResponse search(@RequestParam String query,
                                 @RequestParam(required = false) String userId,
                                 @RequestParam(required = false,defaultValue = "0") int pageNumber,
                                 @RequestParam(required = false,defaultValue = "10") int pageSize) throws Exception {
        Long userIdLong = null;
        if (userId != null && !userId.equalsIgnoreCase("null")) {
            try {
                userIdLong = Long.parseLong(userId);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid userId format");
            }
        }
        return animeService.search(query, userIdLong, pageNumber, pageSize);
    }

    @GetMapping
    public Page<AnimeDTO> getTopAnime(
            @RequestParam(required = false) List<String> genres,
            @RequestParam(required = false) List<String> premiered_seasons,
            @RequestParam(required = false) List<String> premiered_years,
            @RequestParam(required = false,defaultValue = "0") Double score_min,
            @RequestParam(required = false,defaultValue = "10") Double score_max,
            @RequestParam(required = false) List<String> studios,
            @RequestParam(required = false) List<String> demographic,
            @RequestParam(required = false,defaultValue = "0") int page,
            @RequestParam(required = false,defaultValue = "10") int size,
            @RequestParam(required = false,defaultValue = "false") boolean ascending,
            @RequestParam(required = false) Long userId
    ){
        Sort sort = ascending ? Sort.by("score").ascending() : Sort.by("score").descending();
        Pageable pageable = PageRequest.of(page,size,sort);

        AnimeFilter animeFilter = AnimeFilter.builder()
                .genres(genres)
                .studios(studios)
                .premiered_years(premiered_years)
                .premiered_seasons(premiered_seasons)
                .score_min(score_min)
                .score_max(score_max)
                .demographic(demographic).build();


        return animeService.getFilterePaginatedAnime(animeFilter,pageable,userId);
    }

    @GetMapping("/filters")
    public Map<String, List<String>> getAllFilterOptions(){
        return animeService.getAllFilterOptions();
    }



}
















