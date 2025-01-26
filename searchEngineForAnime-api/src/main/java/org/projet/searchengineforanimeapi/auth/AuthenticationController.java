package org.projet.searchengineforanimeapi.auth;

import lombok.RequiredArgsConstructor;
import org.projet.searchengineforanimeapi.config.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authenticationService.register(request));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> register(@RequestBody AuthenticationRequest authRequest) {
        try {
            return ResponseEntity.ok(authenticationService.authenticate(authRequest));

        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token) {
        // Remove the "Bearer " prefix if it exists
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            String userName = jwtService.extractUserName(token);
            return ResponseEntity.ok("Token is valid for "+ userName);
        } catch (JwtException e) {
            return ResponseEntity.status(401).body("Invalid token: " + e.getMessage());
        }
    }
}
