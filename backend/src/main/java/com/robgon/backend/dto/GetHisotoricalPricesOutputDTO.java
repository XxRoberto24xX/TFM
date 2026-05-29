package com.robgon.backend.dto;

import com.robgon.backend.proyections.IPriceProyection;

import java.util.List;

public class GetHisotoricalPricesOutputDTO {
    public List<IPriceProyection> historicalPrices;

    public GetHisotoricalPricesOutputDTO(List<IPriceProyection> historicalPrices) {
        this.historicalPrices = historicalPrices;
    }

    public List<IPriceProyection> getHistoricalPrices() {
        return historicalPrices;
    }

    public void setHistoricalPrices(List<IPriceProyection> historicalPrice) {
        this.historicalPrices = historicalPrice;
    }
}
