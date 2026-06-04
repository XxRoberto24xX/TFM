package com.robgon.backend.dto;

import jakarta.validation.constraints.NotNull;

public class GetGasStationsInRangeInputDTO {
    @NotNull(message = "North coordinate missing")
    public Double north;

    @NotNull(message = "South coordinate missing")
    public Double south;

    @NotNull(message = "East coordinate missing")
    public Double east;

    @NotNull(message = "West coordinate missing")
    public Double west;

    public Double getNorth() {
        return north;
    }

    public void setNorth(Double north) {
        this.north = north;
    }

    public Double getSouth() {
        return south;
    }

    public void setSouth(Double south) {
        this.south = south;
    }

    public Double getEast() {
        return east;
    }

    public void setEast(Double east) {
        this.east = east;
    }

    public Double getWest() {
        return west;
    }

    public void setWest(Double west) {
        this.west = west;
    }
}
