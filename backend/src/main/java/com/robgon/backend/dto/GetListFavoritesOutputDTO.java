package com.robgon.backend.dto;

import com.robgon.backend.models.GasStationModel;
import com.robgon.backend.proyections.IGasStationProyection;

import java.util.List;

public class GetListFavoritesOutputDTO {
    public List<IGasStationProyection> gasStations;

    public GetListFavoritesOutputDTO(List<IGasStationProyection> gasStations) {
        this.gasStations = gasStations;
    }

    public List<IGasStationProyection> getGasStations() {
        return gasStations;
    }

    public void setGasStations(List<IGasStationProyection> gasStations) {
        this.gasStations = gasStations;
    }
}
