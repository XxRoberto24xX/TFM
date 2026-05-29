package com.robgon.backend.dto;

import jakarta.validation.constraints.NotNull;

public class ChangeFavoritesInputDTO {
    @NotNull(message = "gas station id must not be blank")
    public Long gasStationId;

    public Long getGasStationId() {
        return gasStationId;
    }
}
