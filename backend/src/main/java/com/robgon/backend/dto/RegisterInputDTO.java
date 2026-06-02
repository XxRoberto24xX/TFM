package com.robgon.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterInputDTO {
    @NotBlank(message = "Email required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password required")
    private String password;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
