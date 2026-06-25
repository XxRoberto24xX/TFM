package com.robgon.backend.dto;

import com.robgon.backend.proyections.IGasStationProyectionWithPrice;

import java.util.List;

public class GetGasStationsInRouteOutputDTO {
    private List<IGasStationProyectionWithPrice> listGasStations;
    private FuelPriceSummary priceMargins;

    public GetGasStationsInRouteOutputDTO(List<IGasStationProyectionWithPrice> listGasStations, FuelPriceSummary priceMargins) {
        this.listGasStations = listGasStations;
        this.priceMargins = priceMargins;
    }

    public List<IGasStationProyectionWithPrice> getListGasStations() {
        return listGasStations;
    }

    public void setListGasStations(List<IGasStationProyectionWithPrice> listGasStations) {
        this.listGasStations = listGasStations;
    }

    public FuelPriceSummary getPriceSummary() {
        return priceMargins;
    }

    public void setPriceSummary(FuelPriceSummary priceSummary) {
        this.priceMargins = priceSummary;
    }
}
