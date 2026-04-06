package com.techlab.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
      throws IOException, ServletException {
    response.setContentType("application/json");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    Map<String, Object> errorDetails = new HashMap<>();
    errorDetails.put("timestamp", java.time.Instant.now().toString());
    errorDetails.put("status", HttpServletResponse.SC_UNAUTHORIZED);
    errorDetails.put("error", "Unauthorized");
    errorDetails.put("message", "Access denied: insufficient permissions");
    errorDetails.put("path", request.getRequestURI());

    ObjectMapper mapper = new ObjectMapper();
    response.getWriter().write(mapper.writeValueAsString(errorDetails));
  }
}
