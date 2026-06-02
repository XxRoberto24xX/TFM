package com.robgon.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ChangePasswordInputDTO {
    @NotBlank(message = "Email required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Old Password required")
    private String oldPassword;

    @NotBlank(message = "New Password required")
    private String newPassword;

    public String getEmail() {
        return email;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
}
