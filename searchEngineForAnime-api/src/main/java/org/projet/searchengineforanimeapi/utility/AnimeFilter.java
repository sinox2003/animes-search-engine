package org.projet.searchengineforanimeapi.utility;

import lombok.Builder;
import lombok.Data;
import org.projet.searchengineforanimeapi.entities.Premiered;

import java.util.List;

@Data
@Builder
public class AnimeFilter {

    private List<String> genres;
    private List<String> premiered_years;
    private List<String> premiered_seasons;
    private List<String> studios;
    private List<String> demographic;
    private Double score_min;
    private Double score_max;

}
