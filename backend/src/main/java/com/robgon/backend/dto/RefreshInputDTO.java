package com.robgon.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class RefreshInputDTO {
    @NotBlank(message = "The refresh token is required")
    private String refreshToken;

    public String getRefreshToken() { return refreshToken; }
}
