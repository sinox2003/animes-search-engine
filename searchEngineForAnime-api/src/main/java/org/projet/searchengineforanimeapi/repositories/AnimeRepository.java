package org.projet.searchengineforanimeapi.repositories;

import org.projet.searchengineforanimeapi.entities.Anime;
import org.projet.searchengineforanimeapi.entities.Premiered;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimeRepository extends JpaRepository<Anime, Long>, JpaSpecificationExecutor<Anime> {

     @Query(value = "SELECT a FROM Anime a WHERE a.doc_name = :docName")
     Anime findAnimeBy_Doc_name(String docName);

     @Query("SELECT a FROM Anime a WHERE a.doc_name IN :docNames")
     List<Anime> findByDocNames(@Param("docNames") List<String> docNames);


     @Query("SELECT DISTINCT a.premiered.year  FROM Anime a order by a.premiered.year")
     List<String> findAllPremieredYears();

     @Query("SELECT DISTINCT a.premiered.season  FROM Anime a ")
     List<String> findAllPremieredSeasons();

     @Query("SELECT DISTINCT a.studios FROM Anime a  ")
     List<String> findAllStudios();

     @Query("SELECT DISTINCT a.demographic FROM Anime a")
     List<String> findAllDemographics();

     @Query("SELECT DISTINCT g FROM Anime a JOIN a.genres g")
     List<String> findAllGenres();

     @Query("SELECT MAX(a.score) from Anime a ")
     Double findMaxScore();

     @Query("SELECT MIN(a.score) from Anime a ")
     Double findMinScore();


}
