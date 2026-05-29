package com.robgon.backend.dto;

import com.robgon.backend.proyections.ICarProyection;

import java.util.List;

public class GetListCarsOutputDTO {
    public List<ICarProyection> cars;

    public GetListCarsOutputDTO(List<ICarProyection> cars){
        this.cars = cars;
    }

    public List<ICarProyection> getCars() {
        return cars;
    }

    public void setCars(List<ICarProyection> cars) {
        this.cars = cars;
    }
}
