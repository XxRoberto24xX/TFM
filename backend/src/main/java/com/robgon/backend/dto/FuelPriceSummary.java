package com.robgon.backend.dto;

public record FuelPriceSummary(
        FuelRange gasolina95,
        FuelRange gasolina98,
        FuelRange diesel
) {
    public record FuelRange(Double min, Double max) {}
}
