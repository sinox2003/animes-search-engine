package org.projet.searchengineforanimeapi.dtos;

import lombok.Data;
import org.projet.searchengineforanimeapi.entities.Premiered;

import java.util.List;
import java.util.function.Predicate;

@Data
public class AnimeDTO {
    private Long id;
    private String title;
    private Double score;
    private String shortDescription;
    private String doc_name;
    private List<String> genres; // Maps "genres" as a collection of strings
    private String demographic; // Maps "demographic"
    private String studios; // Maps "studios"
    private Premiered premiered;
    private Boolean saved;
    private String image;
}
