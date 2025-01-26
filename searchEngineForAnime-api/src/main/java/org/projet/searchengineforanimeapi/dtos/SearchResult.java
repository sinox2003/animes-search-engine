package org.projet.searchengineforanimeapi.dtos;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SearchResult implements Serializable {

    private List<List<String>> correct_query;
    private List<Result> results ;

}
