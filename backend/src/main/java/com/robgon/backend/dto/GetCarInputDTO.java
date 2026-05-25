package com.robgon.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class GetCarInputDTO {

    @NotBlank(message = "Car plate required")
    public String plate;

    public String getPlate() {
        return plate;
    }
}
