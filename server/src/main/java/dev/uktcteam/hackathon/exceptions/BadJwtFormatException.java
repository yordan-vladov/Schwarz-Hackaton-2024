package dev.uktcteam.hackathon.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Wrong JWT format")
public class BadJwtFormatException extends RuntimeException{
    public BadJwtFormatException(String message) {
        super("Wrong JWT format. " + message);
    }
}
