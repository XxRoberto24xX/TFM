package com.robgon.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class GetGasStationsInRouteInputDTO {
    @NotNull(message = "the route cant be blank")
    private List<CoordinateDTO> coordinates;

    private Double distance;

    public List<CoordinateDTO> getCoordinates() {
        return coordinates;
    }

    public Double getDistance() {
        return distance;
    }
}
