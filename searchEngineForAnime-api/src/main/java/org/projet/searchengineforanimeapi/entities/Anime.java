package org.projet.searchengineforanimeapi.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Anime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String doc_name; // Maps "doc_name"
    private String title; // Maps "title"
    private Double score; // Maps "score", assuming it's numeric
    @Lob
    private String image;

    @Lob
    private String description; // Maps "description", a large text field
    @ElementCollection
    private List<String> genres; // Maps "genres" as a collection of strings
    private String demographic; // Maps "demographic"
    private String studios; // Maps "studios"

    @ManyToOne(cascade = CascadeType.ALL)
    private Premiered premiered;
}
