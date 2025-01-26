package org.projet.searchengineforanimeapi.mappers;

import org.projet.searchengineforanimeapi.dtos.AnimeDTO;
import org.projet.searchengineforanimeapi.entities.Anime;

public class AnimeMapper {
    public static AnimeDTO toDto(Anime anime) {
        AnimeDTO dto = new AnimeDTO();
        dto.setId(anime.getId());
        dto.setTitle(anime.getTitle());
        dto.setScore(anime.getScore());
        dto.setShortDescription(generateShortDescription(anime.getDescription()));
//        dto.setShortDescription(anime.getDescription());
        dto.setDoc_name(anime.getDoc_name());
        dto.setImage(anime.getImage());
        dto.setGenres(anime.getGenres());
        dto.setPremiered(anime.getPremiered());
        dto.setDemographic(anime.getDemographic());
        dto.setStudios(anime.getStudios());
        return dto;
    }

    private static String generateShortDescription(String description) {
        if (description == null || description.isEmpty()) {
            return "";
        }
        return description.length() > 220 ? description.substring(0, 220) + "..." : description;
    }
}
