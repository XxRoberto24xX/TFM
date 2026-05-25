package com.robgon.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class DeleteCarInputModel {
    @NotBlank(message = "Plate is required")
    public String plate;

    public String getPlate() {
        return plate;
    }
}
