package dev.uktcteam.hackathon.exceptions;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;

@RestControllerAdvice
public class CustomExceptionHandler {


    //TODO handle exceptions
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(Exception e) {
        ProblemDetail problemDetail = ProblemDetail
                .forStatusAndDetail(
                        HttpStatusCode.valueOf(500), e.toString());

        if (e instanceof BadCredentialsException) {
            problemDetail = ProblemDetail
                    .forStatusAndDetail(
                            HttpStatusCode.valueOf(401), "Invalid credentials");
            problemDetail.setProperty(
                    "access_denied", "Invalid credentials"
            );
        }

        if (e instanceof AccessDeniedException) {
            problemDetail = ProblemDetail
                    .forStatusAndDetail(
                            HttpStatusCode.valueOf(403), e.getMessage());
            problemDetail.setProperty(
                    "access_denied", "Not authorized"
            );
        }

        if (e instanceof ExpiredJwtException){
            problemDetail = ProblemDetail
                    .forStatusAndDetail(
                            HttpStatusCode.valueOf(401), "Token expired");
            problemDetail.setProperty(
                    "access_denied", "Token expired"
            );
        }

        e.printStackTrace();

        return problemDetail;
    }



}
