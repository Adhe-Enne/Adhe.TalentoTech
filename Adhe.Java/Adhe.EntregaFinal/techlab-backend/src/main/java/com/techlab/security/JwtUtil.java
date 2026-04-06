package com.techlab.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtUtil {

  private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

  private final Key key;
  private final long expirationMillis;

  public JwtUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long expirationMillis) {
    // Use the provided secret as bytes. For production use a long, random base64
    // string.
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
    this.expirationMillis = expirationMillis;
  }

  /**
   * Generate token including username and roles claims.
   */
  public String generateToken(String username, Collection<? extends GrantedAuthority> authorities) {
    logger.info("Generating JWT token for user: {}", username);
    Date now = new Date();
    Date expiry = new Date(now.getTime() + expirationMillis);
    List<String> roles = authorities == null ? List.of()
        : authorities.stream().map(GrantedAuthority::getAuthority).toList();

    return Jwts.builder()
        .setSubject(username)
        .claim("roles", roles)
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  // Backwards-compatible helper: generate token with no authorities
  public String generateToken(String username) {
    return generateToken(username, List.of());
  }

  public String getUsernameFromToken(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
      logger.info("JWT token validated successfully");
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      logger.warn("Invalid JWT token: {}", e.getMessage());
      return false;
    }
  }

  public List<String> getRolesFromToken(String token) {
    Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    Object rolesObj = claims.get("roles");
    if (rolesObj instanceof List) {
      return ((List<?>) rolesObj).stream().map(Object::toString).toList();
    }
    return List.of();
  }

  // NOTE: Ensure the secret key is securely managed, e.g., via environment
  // variables or a secrets manager.
}
