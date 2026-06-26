package com.robgon.backend.dto;

public record FuelPriceSummary(
        FuelRange gasoline95,
        FuelRange gasoline98,
        FuelRange diesel,
        FuelRange glp,
        FuelRange dieselPremium,
        FuelRange gasoline95Premium,
        FuelRange dieselRenewable
) {
    public record FuelRange(Double min, Double max) {}
}
