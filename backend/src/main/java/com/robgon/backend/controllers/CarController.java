package com.robgon.backend.controllers;

import com.robgon.backend.models.CarModel;
import com.robgon.backend.services.CarService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.webauthn.api.AuthenticationExtensionsClientInput;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @GetMapping("/listUserCars")
    public ResponseEntity<?> getListUserCars(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        List<CarModel> userCars = carService.getListUserCars(email);

        if(userCars == null){
            return ResponseEntity.badRequest().body("User not found");
        }else{
            return ResponseEntity.ok(userCars);
        }
    }

    @PostMapping("/addCar")
    public CarModel saveCar(@RequestBody CarModel car){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return this.carService.saveCar(car, email);
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
