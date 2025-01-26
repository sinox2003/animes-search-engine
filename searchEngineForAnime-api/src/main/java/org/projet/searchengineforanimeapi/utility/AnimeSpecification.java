package org.projet.searchengineforanimeapi.utility;

import jakarta.persistence.criteria.Predicate;
import lombok.experimental.UtilityClass;
import org.projet.searchengineforanimeapi.entities.Anime;
import org.projet.searchengineforanimeapi.entities.Premiered;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@UtilityClass
public class AnimeSpecification {

    public static  Specification<Anime> withFilter(AnimeFilter filter) {


        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getGenres() != null && !filter.getGenres().isEmpty()) {
                predicates.add(root.join("genres").in(filter.getGenres()));
            }

            if (filter.getPremiered_years() != null && !filter.getPremiered_years().isEmpty()) {
                predicates.add(root.join("premiered").get("year").in(filter.getPremiered_years()));
            }

            if (filter.getPremiered_seasons() != null && !filter.getPremiered_seasons().isEmpty()) {
                predicates.add(root.join("premiered").get("season").in(filter.getPremiered_seasons()));
            }
            if (filter.getScore_max() != null || filter.getScore_min() != null) {
                if (filter.getScore_min() != null) {
                    // Add condition for minimum score
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("score"), filter.getScore_min()));
                }
                if (filter.getScore_max() != null) {
                    // Add condition for maximum score
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("score"), filter.getScore_max()));
                }
            }


            if (filter.getStudios() != null && !filter.getStudios().isEmpty()) {
                predicates.add(root.get("studios").in(filter.getStudios()));
            }

            if (filter.getDemographic() != null && !filter.getDemographic().isEmpty()) {
                predicates.add(root.get("demographic").in(filter.getDemographic()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

