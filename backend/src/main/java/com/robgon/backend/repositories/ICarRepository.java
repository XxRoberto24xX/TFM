package com.robgon.backend.repositories;

import com.robgon.backend.models.CarModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
    public interface ICarRepository extends JpaRepository<CarModel, String> {
    List<CarModel> findByUser_Email(String userEmail);
}
