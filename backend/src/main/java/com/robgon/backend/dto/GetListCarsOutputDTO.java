package com.robgon.backend.dto;

import com.robgon.backend.models.CarModel;

import java.util.List;

public class GetListCarsOutputDTO {
    public List<CarModel> cars;

    public GetListCarsOutputDTO(List<CarModel> cars){
        this.cars = cars;
    }

    public List<CarModel> getCars() {
        return cars;
    }

    public void setCars(List<CarModel> cars) {
        this.cars = cars;
    }
}
