package com.robgon.backend.dto;

import com.robgon.backend.proyections.IPriceProyection;

import java.time.LocalDate;

public class GetActualPricesOutputDTO {

    public LocalDate date;
    public Double gasoline95;
    public Double gasoline98;
    public Double diesel;
    public Double glp;
    public Double dieselPremium;
    public Double gasoline95Premium;
    public Double dieselRenewable;

    public GetActualPricesOutputDTO(IPriceProyection price) {
        this.date = price.getDate();
        this.gasoline95 = price.getGasoline95();
        this.gasoline98 = price.getGasoline98();
        this.diesel = price.getDiesel();
        this.glp = price.getGlp();
        this.dieselPremium = price.getDieselPremium();
        this.gasoline95Premium = price.getGasoline95Premium();
        this.dieselRenewable = price.getDieselRenewable();
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getGasoline95() {
        return gasoline95;
    }

    public void setGasoline95(Double gasoline95) {
        this.gasoline95 = gasoline95;
    }

    public Double getDiesel() {
        return diesel;
    }

    public void setDiesel(Double diesel) {
        this.diesel = diesel;
    }

    public Double getGasoline98() {
        return gasoline98;
    }

    public void setGasoline98(Double gasoline98) {
        this.gasoline98 = gasoline98;
    }
}
