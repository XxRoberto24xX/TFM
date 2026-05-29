package com.robgon.backend.controllers;

import com.robgon.backend.dto.GetActualPricesInputDTO;
import com.robgon.backend.dto.GetGasStationInfoInputDTO;
import com.robgon.backend.dto.GetHistoricalPricesInputDTO;
import com.robgon.backend.dto.ChangeFavoritesInputDTO;
import com.robgon.backend.services.GasStationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gasStations")
public class GasStationController {
    @Autowired
    GasStationService gasStationService;

    @PostMapping("getGasStationInfo")
    public ResponseEntity<?> getGasStationInfo(@Valid @RequestBody GetGasStationInfoInputDTO getGasStationInfoInputDTO){
        return ResponseEntity.ok(gasStationService.getGasStationInfo(getGasStationInfoInputDTO));
    }

    @PostMapping("/getActualPrices")
    public ResponseEntity<?> getActualPrices(@Valid @RequestBody GetActualPricesInputDTO getActualPricesInputDTO){
        return ResponseEntity.ok(gasStationService.getActualPrices(getActualPricesInputDTO));
    }

    @PostMapping("/getHistoricalPrices")
    public ResponseEntity<?> getHistoricalPrices(@Valid @RequestBody GetHistoricalPricesInputDTO getHistoricalPricesInputDTO){
        return ResponseEntity.ok(gasStationService.getHistoricalPrices(getHistoricalPricesInputDTO));
    }

    @PostMapping("/addToFavorites")
    public ResponseEntity<?> addToFavorites(@Valid @RequestBody ChangeFavoritesInputDTO changeFavoritesInputDTO){
        gasStationService.addToFavorites(changeFavoritesInputDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/removeFromFavorites")
    public ResponseEntity<?> removeFromFavorites(@Valid @RequestBody ChangeFavoritesInputDTO changeFavoritesInputDTO){
        gasStationService.removeFromFavorites(changeFavoritesInputDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getListFavorites")
    public ResponseEntity<?> listFavorites(){
        return ResponseEntity.ok(gasStationService.getListFavorites());
    }
}
