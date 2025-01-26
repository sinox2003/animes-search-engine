package org.projet.searchengineforanimeapi.dtos;

import lombok.Data;

import java.io.Serializable;

@Data
public class Result implements Serializable {

    private String doc;
    private String score;
}
