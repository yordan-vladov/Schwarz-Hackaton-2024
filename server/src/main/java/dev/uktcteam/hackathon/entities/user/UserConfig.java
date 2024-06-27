package dev.uktcteam.hackathon.entities.user;

import dev.uktcteam.hackathon.enums.Role;
import dev.uktcteam.hackathon.security.auth.AuthenticationService;
import dev.uktcteam.hackathon.security.auth.requests.RegisterRequest;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserConfig {

    @Bean
    public CommandLineRunner commandLineRunner(
            AuthenticationService authenticationService
    ){
        return args -> {

            var admin = RegisterRequest.builder()
                    .username("Admin")
                    .email("admin@uktc.bg")
                    .password("1234")
                    .role(Role.ADMIN)
                    .build();
            var authAdmin = authenticationService.registerWithRole(admin);
            System.out.println("Admin access token: " + authAdmin.getAccessToken());
            System.out.println("Admin refresh token: " + authAdmin.getRefreshToken());


            var user = RegisterRequest.builder()
                    .username("Tomov")
                    .email("tomov@abv.bg")
                    .password("1234")
                    .role(Role.USER)
                    .build();
            var authUser = authenticationService.registerWithRole(user);
            System.out.println("User access token: " + authUser.getAccessToken());
            System.out.println("User refresh token: " + authUser.getRefreshToken());

        };
    }
}
