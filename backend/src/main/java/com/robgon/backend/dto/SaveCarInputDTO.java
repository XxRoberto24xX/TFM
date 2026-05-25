package com.robgon.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public class SaveCarInputDTO {
    @NotBlank(message = "Plate si required")
    @Pattern(
            regexp = "^\\d{4}[B-DF-HJ-NP-TV-Z]{3}$",
            message = "The plate must have 4 numbers and 3 valid letters (Ej: 1234ABC)"
    )
    private String plate;

    @NotBlank(message = "Brand si required")
    private String brand;

    @NotBlank(message = "Car model si required")
    private String model;

    @NotNull(message = "Consumption is required")
    @Positive(message = "Consumption must be greater than 0")
    private float consumption;



    public String getPlate() {
        return plate;
    }

    public float getConsumption() {
        return consumption;
    }

    public String getModel() {
        return model;
    }

    public String getBrand() {
        return brand;
    }
}
