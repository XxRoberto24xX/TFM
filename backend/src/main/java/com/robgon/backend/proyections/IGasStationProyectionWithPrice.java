package com.robgon.backend.proyections;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;

public interface IGasStationProyectionWithPrice {
    Long getId();
    String getDirection();
    String getHours();
    Double getLatitude();
    Double getLongitude();
    String getSellingType();
    String getBrand();
    String getMunicipality();

    @JsonIgnore
    @Value("#{target.priceDate}")
    LocalDate getRawDate();
    @JsonIgnore
    @Value("#{target.gasoline95}")
    Double getRawG95();
    @JsonIgnore
    @Value("#{target.gasoline98}")
    Double getRawG98();
    @JsonIgnore
    @Value("#{target.diesel}")
    Double getRawDiesel();

    default IPriceProyection getPrices() {
        if (getRawDate() == null) return null;

        return new IPriceProyection() {
            @Override
            public LocalDate getDate() { return getRawDate(); }
            @Override
            public Double getGasoline95() { return getRawG95(); }
            @Override
            public Double getGasoline98() { return getRawG98(); }
            @Override
            public Double getDiesel() { return getRawDiesel(); }
        };
    }
}
