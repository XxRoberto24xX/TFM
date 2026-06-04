package com.robgon.backend.repositories;

import com.robgon.backend.models.GasStationModel;
import com.robgon.backend.proyections.IGasStationProyection;
import com.robgon.backend.proyections.IGasStationProyectionWithPrice;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

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

    @Query("""
    SELECT
        g.id as id,
        g.direction as direction,
        g.hours as hours,
        g.latitude as latitude,
        g.longitude as longitude,
        g.sellingType as sellingType,
        g.brand as brand,
        g.municipality as municipality,
        p as prices
    FROM GasStationModel g
    LEFT JOIN PricesModel p ON p.gasStation = g AND p.date = (
        SELECT MAX(p2.date) FROM PricesModel p2 WHERE p2.gasStation = g
    )
    WHERE g.latitude BETWEEN :south AND :north
      AND g.longitude BETWEEN :west AND :east
    """)
    List<IGasStationProyectionWithPrice> findStationsInBoundingBox(
            @Param("south") Double south,
            @Param("north") Double north,
            @Param("west") Double west,
            @Param("east") Double east
    );
}
