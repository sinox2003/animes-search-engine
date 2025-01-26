package org.projet.searchengineforanimeapi.services;

import org.projet.searchengineforanimeapi.dtos.AnimeDTO;
import org.projet.searchengineforanimeapi.dtos.UserInput;
import org.projet.searchengineforanimeapi.entities.User;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserService {

    User getUserById(Long id);

    Optional<User> findByResetPasswordToken(String token);

    String resetPassword(Map<String, String> request);

    String forgotPassword(String email);

    User updateUserFromInput(Long id, UserInput input);

    User saveUser(User user);

    void resendVerificationCode(String email);


    Page<AnimeDTO> getAnimesByUserId(Long userId, int page, int size);

    void removeAnimeFromUser(Long userId, Long animeId);

    void addAnimeToUser(Long userId, Long animeId);
}
