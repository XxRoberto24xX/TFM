package com.robgon.backend.proyections;

import java.time.LocalDate;

public interface IPriceProyection {
    LocalDate getDate();
    Double getGasoline95();
    Double getGasoline98();
    Double getGasoline95Premium();
    Double getDiesel();
    Double getDieselPremium();
    Double getDieselRenewable();
    Double getGlp();
}
