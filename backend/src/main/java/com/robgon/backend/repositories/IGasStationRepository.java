package com.robgon.backend.repositories;

import com.robgon.backend.models.GasStationModel;
import com.robgon.backend.proyections.IGasStationProyection;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IGasStationRepository extends JpaRepository<GasStationModel, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM GasStationModel g WHERE g.id IN :ids")
    void deleteByIdIn(List<Long> ids);

    @Query("""
        SELECT
            g.id as id,
            g.direction as direction,
            g.hours as hours,
            g.latitude as latitude,
            g.longitude as longitude,
            g.sellingType as sellingType,
            g.brand as brand,
            g.municipality as municipality
        FROM GasStationModel g
        WHERE g.id = :id
        """)
    Optional<IGasStationProyection> findOnlyInfoById(Long id);

    @Query("""
        SELECT
            g.id as id,
            g.direction as direction,
            g.hours as hours,
            g.latitude as latitude,
            g.longitude as longitude,
            g.sellingType as sellingType,
            g.brand as brand,
            g.municipality as municipality
        FROM UserModel u
        JOIN u.favoriteGasStations g
        WHERE u.email = :email
        """)
    List<IGasStationProyection> findUserFavoriteGasStations(String email);

}
