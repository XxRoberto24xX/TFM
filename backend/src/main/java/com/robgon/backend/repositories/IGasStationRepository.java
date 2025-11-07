package com.robgon.backend.repositories;

import com.robgon.backend.models.GasStationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IGasStationRepository extends JpaRepository<GasStationModel, Long> {

}
