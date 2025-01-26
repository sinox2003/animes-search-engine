package org.projet.searchengineforanimeapi.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResponse {

    private  List<List<String>> correct_query;
    private List<AnimeDTO> results;
    private int number;
    private int size;
    private int totalElements;
    private int totalPages;
    private Boolean isFirst;
    private Boolean isLast;


    public SearchResponse(int number, int size, int totalElements, int totalPages, Boolean isFirst, Boolean isLast) {
        this.number = number;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.isFirst = isFirst;
        this.isLast = isLast;
    }
}
