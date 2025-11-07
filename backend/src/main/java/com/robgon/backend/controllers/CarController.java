package com.robgon.backend.controllers;

import com.robgon.backend.models.CarModel;
import com.robgon.backend.services.CarService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping("/{id}")
    public Optional<CarModel> getCarWithId(@PathVariable("id") String id){
        return carService.getCarWithId(id);
    }

    @PostMapping("/addCar")
    public CarModel saveCar(@RequestBody CarModel car){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return this.carService.saveCar(car, username);
    }

    @PatchMapping("/updateCar{id}")
    public CarModel updateCarWithId(@RequestBody CarModel modCar, @PathVariable("id") String id){
        return carService.updateCarWithId(modCar, id);
    }

    @DeleteMapping("/deleteCar{id}")
    public String deleteCarWithId(@PathVariable("id") String id){
        if(carService.deleteCarWithId(id)){
            return "Car with plate " + id + " deleted";
        }else{
            return "Error deleting the user with id" + id;
        }
    }

}
