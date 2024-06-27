package dev.uktcteam.hackathon.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED, reason = "JWT expired")
public class StatusExpiredJwtException extends RuntimeException{
    public StatusExpiredJwtException() {
        super("JWT expired");
    }
}
