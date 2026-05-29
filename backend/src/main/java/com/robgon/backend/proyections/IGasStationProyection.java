package com.robgon.backend.proyections;

public interface IGasStationProyection {
    Long getId();
    String getDirection();
    String getHours();
    Double getLatitude();
    Double getLongitude();
    String getSellingType();
    String getBrand();
    String getMunicipality();
}
