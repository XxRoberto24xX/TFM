package com.robgon.backend.services;

import com.robgon.backend.dto.*;
import com.robgon.backend.models.CarModel;
import com.robgon.backend.models.UserModel;
import com.robgon.backend.repositories.ICarRepository;
import com.robgon.backend.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CarService {
    @Autowired
    ICarRepository carRepository;

    @Autowired
    IUserRepository userRepository;

    public GetCarOutputDTO getCar(GetCarInputDTO getCarInputDTO){
        CarModel car = carRepository.findById(getCarInputDTO.getPlate())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        return new GetCarOutputDTO(
            car.getPlate(),
            car.getBrand(),
            car.getModel(),
            car.getConsumption()
        );
    }

    public GetListCarsOutputDTO getListUserCars(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserModel user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new GetListCarsOutputDTO(user.getCars());
    }

    public void saveCar(SaveCarInputDTO saveCarInputDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserModel user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        CarModel car = new CarModel();
        car.setPlate(saveCarInputDTO.getPlate());
        car.setBrand(saveCarInputDTO.getBrand());
        car.setModel(saveCarInputDTO.getModel());
        car.setConsumption(saveCarInputDTO.getConsumption());
        car.setUser(user);

        carRepository.save(car);
    }

    public void deleteCarWithId(DeleteCarInputModel deleteCarInputModel){
        carRepository.deleteById(deleteCarInputModel.getPlate());
    }
}
