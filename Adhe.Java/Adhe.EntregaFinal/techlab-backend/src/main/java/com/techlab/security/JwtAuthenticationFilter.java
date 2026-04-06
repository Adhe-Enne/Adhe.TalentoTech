package com.techlab.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private static final Logger logJwtAuth = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

  private final JwtUtil jwtUtil;
  private final UsuarioDetailsService userDetailsService;

  public JwtAuthenticationFilter(JwtUtil jwtUtil, UsuarioDetailsService userDetailsService) {
    this.jwtUtil = jwtUtil;
    this.userDetailsService = userDetailsService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String header = request.getHeader("Authorization");
    String token = null;
    String username = null;

    // Skip validation for endpoints configured as permitAll
    String requestURI = request.getRequestURI();
    if (requestURI.startsWith("/api/auth") || requestURI.startsWith("/actuator")) {
      filterChain.doFilter(request, response);
      return;
    }

    if (header != null && header.startsWith("Bearer ")) {
      token = header.substring(7);
      if (jwtUtil.validateToken(token)) {
        username = jwtUtil.getUsernameFromToken(token);
        logJwtAuth.info("JWT authentication successful for user: {}", username);
      } else {
        logJwtAuth.warn("JWT authentication failed: invalid or expired token");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Token inválido o expirado");
        return;
      }
    }

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      UserDetails userDetails = userDetailsService.loadUserByUsername(username);
      if (userDetails != null) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null,
            userDetails.getAuthorities());
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    }

    filterChain.doFilter(request, response);
  }
}
