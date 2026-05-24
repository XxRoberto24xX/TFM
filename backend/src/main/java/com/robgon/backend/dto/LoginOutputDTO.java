package com.robgon.backend.dto;

public class LoginOutputDTO {
    private String token;

    public LoginOutputDTO(String token) {
        this.token = token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
