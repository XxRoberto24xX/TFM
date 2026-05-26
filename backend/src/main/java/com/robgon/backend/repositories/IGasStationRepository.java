package com.robgon.backend.repositories;

import com.robgon.backend.models.GasStationModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IGasStationRepository extends JpaRepository<GasStationModel, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM GasStationModel g WHERE g.id IN :ids")
    void deleteByIdIn(List<Long> ids);
}
