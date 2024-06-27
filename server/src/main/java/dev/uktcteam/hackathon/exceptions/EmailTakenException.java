package dev.uktcteam.hackathon.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Email is already taken")
public class EmailTakenException extends RuntimeException {
    public EmailTakenException() {
        super("Email is already taken.");
    }
}
