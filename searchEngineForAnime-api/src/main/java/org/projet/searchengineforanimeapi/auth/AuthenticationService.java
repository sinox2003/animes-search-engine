package org.projet.searchengineforanimeapi.auth;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.projet.searchengineforanimeapi.config.JwtService;
import org.projet.searchengineforanimeapi.entities.Role;
import org.projet.searchengineforanimeapi.entities.User;
import org.projet.searchengineforanimeapi.repositories.UserRepo;
import org.projet.searchengineforanimeapi.services.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public AuthenticationResponse register(RegisterRequest registerRequest) {
        // Check if user already exists
        Optional<User> existingUser = userRepo.findByEmail(registerRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        var user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.USER)
                .build();

        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        User savedUser = userRepo.save(user);
        Long userId = savedUser.getId();
        var jwtToken = jwtService.generateToken(user, userId);

        try {
            sendVerificationEmail(savedUser.getEmail(), verificationCode);
        }catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );
        }catch (Exception e) {
            if(e.getMessage().equals("Bad credentials")){
                throw new RuntimeException("Email or password incorrect");
            }else if(e.getMessage().equals("User is disabled")){
                throw new RuntimeException("Your account is not activated");
            }else {
                throw new RuntimeException(e.getMessage());
            }
        }

        var user = userRepo.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var jwtToken = jwtService.generateToken(user,user.getId());
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public String generateVerificationCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    public void sendVerificationEmail(String email, String verificationCode) {
        String subject = "Vérification de votre compte";
        String message = "Votre code de vérification est : " + verificationCode;
        emailService.sendEmail(email, subject, message);
    }
}

