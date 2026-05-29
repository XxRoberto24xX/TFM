package com.robgon.backend.repositories;

import com.robgon.backend.models.CarModel;
import com.robgon.backend.proyections.ICarProyection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICarRepository extends JpaRepository<CarModel, String> {
    Optional<ICarProyection> findByPlate(String plate);

    @Query("""
        SELECT c.plate as plate,
               c.brand as brand,
               c.model as model,
               c.consumption as consumption
        FROM CarModel c
        WHERE c.user.email = :email
        """)
    List<ICarProyection> findUserCars(String email);
}
