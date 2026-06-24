package com.robgon.backend.services;

import com.robgon.backend.dto.FuelPriceSummary;
import org.springframework.stereotype.Service;

@Service
public class FuelPriceMargins {
    private volatile FuelPriceSummary currentSummary;

    public void updateMargins(FuelPriceSummary newSummary) {
        this.currentSummary = newSummary;
    }

    public FuelPriceSummary getMargins() {
        if (this.currentSummary == null) {
            FuelPriceSummary.FuelRange emptyRange = new FuelPriceSummary.FuelRange(0.0, 0.0);
            return new FuelPriceSummary(emptyRange, emptyRange, emptyRange);
        }
        return this.currentSummary;
    }
}
