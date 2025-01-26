package org.projet.searchengineforanimeapi.repositories;

import org.projet.searchengineforanimeapi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByResetPasswordToken(String token);

    @Query(value = "select animes_id from user_animes where user_id =:userId",nativeQuery = true)
    Set<Long> findAnimesByUserId(@Param("userId") Long userId);

}
