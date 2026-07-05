package com.robgon.backend.dto;

import com.robgon.backend.proyections.IGasStationProyection;
import com.robgon.backend.proyections.IPriceProyection;

public class GetGasStationInfoOutputDTO {
    private Long id;
    private String direction;
    private String hours;
    private Double latitude;
    private Double longitude;
    private String sellingType;
    private String brand;
    private String municipality;
    private IPriceProyection prices;

    public GetGasStationInfoOutputDTO(IGasStationProyection gasStationInfo, IPriceProyection prices) {
        this.id = gasStationInfo.getId();
        this.direction = gasStationInfo.getDirection();
        this.hours = gasStationInfo.getHours();
        this.latitude = gasStationInfo.getLatitude();
        this.longitude = gasStationInfo.getLongitude();
        this.sellingType = gasStationInfo.getSellingType();
        this.brand = gasStationInfo.getBrand();
        this.municipality = gasStationInfo.getMunicipality();
        this.prices = prices;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getHours() {
        return hours;
    }

    public void setHours(String hours) {
        this.hours = hours;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getSellingType() {
        return sellingType;
    }

    public void setSellingType(String sellingType) {
        this.sellingType = sellingType;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getMunicipality() {
        return municipality;
    }

    public void setMunicipality(String municipality) {
        this.municipality = municipality;
    }

    public IPriceProyection getPrices() {
        return prices;
    }

    public void setPrices(IPriceProyection prices) {
        this.prices = prices;
    }
}
