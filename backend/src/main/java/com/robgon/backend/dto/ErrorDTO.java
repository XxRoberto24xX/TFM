package com.robgon.backend.dto;

import java.time.LocalDateTime;

public class ErrorDTO {
    private String exceptionType;
    private String message;
    private LocalDateTime timestamp;

    public ErrorDTO (String exceptionType, String message){
        this.exceptionType = exceptionType;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getExceptionType() {
        return exceptionType;
    }

    public void setExceptionType(String exceptionType) {
        this.exceptionType = exceptionType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
