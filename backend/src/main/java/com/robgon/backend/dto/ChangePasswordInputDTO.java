package com.robgon.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ChangePasswordInputDTO {
    @NotBlank(message = "Old Password required")
    private String oldPassword;

    @NotBlank(message = "New Password required")
    private String newPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
}
