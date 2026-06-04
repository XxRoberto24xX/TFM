package com.robgon.backend.dto;

import com.robgon.backend.proyections.IGasStationProyectionWithPrice;

import java.util.List;

public class GetGasStationsInRangeOutputDTO {
    public List<IGasStationProyectionWithPrice> listGasStations;

    public GetGasStationsInRangeOutputDTO(List<IGasStationProyectionWithPrice> listGasStations) {
        this.listGasStations = listGasStations;
    }

    public List<IGasStationProyectionWithPrice> getListGasStations() {
        return listGasStations;
    }

    public void setListGasStations(List<IGasStationProyectionWithPrice> listGasStations) {
        this.listGasStations = listGasStations;
    }
}
