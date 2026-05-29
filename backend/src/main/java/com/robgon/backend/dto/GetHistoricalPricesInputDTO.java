package com.robgon.backend.dto;

import jakarta.validation.constraints.NotNull;

public class GetHistoricalPricesInputDTO {
    @NotNull(message = "gas station id must not be blank")
    public Long gasStationId;

    public Long getGasStationId() {
        return gasStationId;
    }
}
