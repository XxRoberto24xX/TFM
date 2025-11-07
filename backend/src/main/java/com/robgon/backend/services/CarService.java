package com.robgon.backend.services;

import com.robgon.backend.models.CarModel;
import com.robgon.backend.models.UserModel;
import com.robgon.backend.repositories.ICarRepository;
import com.robgon.backend.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CarService {
    @Autowired
    ICarRepository carRepository;

    @Autowired
    IUserRepository userRepository;

    public Optional<CarModel> getCarWithId(String id){
        return carRepository.findById(id);
    }

    public CarModel saveCar(CarModel car, String username){
        Optional<UserModel> sqlResponse = userRepository.findByUsername(username);

        if(sqlResponse.isEmpty())
            return null;

        UserModel user = sqlResponse.get();
        car.setUser(user);

        return carRepository.save(car);
    }

    public CarModel updateCarWithId(CarModel modCar, String id){
        Optional<CarModel> sqlResponse = carRepository.findById(id);

        if(sqlResponse.isEmpty())
            return null;

        CarModel car = sqlResponse.get();

        if(!modCar.getPlate().equals(car.getPlate()))
            car.setPlate(modCar.getPlate());

        if(! (modCar.getConsumption() == car.getConsumption()))
            car.setConsumption(modCar.getConsumption());

        if(!modCar.getBrand().equals(car.getBrand()))
            car.setBrand(modCar.getBrand());

        if(!modCar.getModel().equals(car.getModel()))
            car.setModel(modCar.getModel());

        return carRepository.save(car);
    }

    public boolean deleteCarWithId(String id){
        try{
            carRepository.deleteById(id);
            return true;
        }catch(Exception e){
            return false;
        }
    }
}
