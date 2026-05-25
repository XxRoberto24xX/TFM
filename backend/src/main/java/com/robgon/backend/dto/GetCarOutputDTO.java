package com.robgon.backend.dto;

public class GetCarOutputDTO {
    public String plate;
    public String brand;
    public String model;
    public float consumption;

    public GetCarOutputDTO (String plate,String brand, String model, float consumption){
        this.plate = plate;
        this.brand = brand;
        this.model = model;
        this.consumption = consumption;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public float getConsumption() {
        return consumption;
    }

    public void setConsumption(float consumption) {
        this.consumption = consumption;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }
}
