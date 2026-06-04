package com.robgon.backend.proyections;

import java.util.List;

public interface IGasStationProyectionWithPrice {
    Long getId();
    String getDirection();
    String getHours();
    Double getLatitude();
    Double getLongitude();
    String getSellingType();
    String getBrand();
    String getMunicipality();
    IPriceProyection getPrices();
}
