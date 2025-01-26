package org.projet.searchengineforanimeapi.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY = "90eCYODr2MwCmukG49ZItcfyS8Lzr7wT9xETl9XNUiumbZB2Ckp9jrX5BFq0G2h1gsCV3MbTVe4SYYbqFIQNvrdYjr838ew+Bbf8aybdwZPHFWdZo08fWWp3Hj/yFvFkmrkS9P1Ekdqq59crBe0lX5T02Bm7Kshzjqt41crWHVjxq+/TDwbpm1QaPYBvZe+5cKQAyMr0vdoR68YzVk93BY4zsdU3VdtpMmYsrC/8WWJmbrkw+SgWW7tQZebvUC3yt0QY/qGy2go1biec+L6GxwO4Kdk5vTd7Jg9gvKLyVDAzBV4InszLGbxtZKBm5OCOH7uwy8edlhTBPvSzIaYFKA==\n";

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public  <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails,Long userId) {
        extraClaims.put("userId", userId);
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 365L * 24 * 60 * 60 * 1000))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(UserDetails userDetails,Long userId){
        return generateToken(new HashMap<>(), userDetails,userId);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }


}
