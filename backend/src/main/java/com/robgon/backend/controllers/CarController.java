package com.robgon.backend.controllers;

import com.robgon.backend.dto.DeleteCarInputModel;
import com.robgon.backend.dto.SaveCarInputDTO;
import com.robgon.backend.dto.GetCarInputDTO;
import com.robgon.backend.services.CarService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @PostMapping("/getCar")
    public ResponseEntity<?> getCar(@Valid @RequestBody GetCarInputDTO getCarInputDTO){
        return ResponseEntity.ok(carService.getCar(getCarInputDTO));
    }

    @GetMapping("/listUserCars")
    public ResponseEntity<?> getListUserCars(){
        return ResponseEntity.ok(carService.getListUserCars());
    }

    @PostMapping("/saveCar")
    public ResponseEntity<?> saveCar(@Valid @RequestBody SaveCarInputDTO saveCarInputDTO){
        carService.saveCar(saveCarInputDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteCar")
    public ResponseEntity<?> deleteCarWithId(@Valid @RequestBody DeleteCarInputModel deleteCarInputModel){
        carService.deleteCarWithId(deleteCarInputModel);
        return ResponseEntity.ok().build();
    }
}