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
    @JsonIgnore
    @Value("#{target.glp}")
    Double getRawGLP();
    @JsonIgnore
    @Value("#{target.dieselPremium}")
    Double getRawDieselPremium();
    @JsonIgnore
    @Value("#{target.gasoline95Premium}")
    Double getRawGasoline95Premium();
    @JsonIgnore
    @Value("#{target.dieselRenewable}")
    Double getRawDieselRenewable();

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
            @Override
            public Double getGlp() { return getRawGLP(); }
            @Override
            public Double getDieselPremium() { return getRawDieselPremium(); }
            @Override
            public Double getGasoline95Premium() { return getRawGasoline95Premium(); }
            @Override
            public Double getDieselRenewable() { return getRawDieselRenewable(); }
        };
    }
}
