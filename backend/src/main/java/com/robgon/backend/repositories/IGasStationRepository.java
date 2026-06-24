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

@Repository
public interface IGasStationRepository extends JpaRepository<GasStationModel, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM GasStationModel g WHERE g.id IN :ids")
    void deleteByIdIn(List<Long> ids);

    @Query(value = """
        SELECT
            g.id as id,
            g.direction as direction,
            g.hours as hours,
            ST_Y(g.location) as latitude,
            ST_X(g.location) as longitude,
            g.selling_type as sellingType,
            g.brand as brand,
            g.municipality as municipality
        FROM gas_stations g
        WHERE g.id = :id
        """, nativeQuery = true)
    Optional<IGasStationProyection> findOnlyInfoById(@Param("id") Long id);

    @Query(value = """
    SELECT
        g.id as id,
        g.direction as direction,
        g.hours as hours,
        ST_Y(g.location) as latitude,
        ST_X(g.location) as longitude,
        g.selling_type as sellingType,
        g.brand as brand,
        g.municipality as municipality
    FROM user_favorite_gas_stations ufg
    JOIN gas_stations g ON ufg.gas_station_id = g.id
    WHERE ufg.user_email = :email
    """, nativeQuery = true)
    List<IGasStationProyection> findUserFavoriteGasStations(@Param("email") String email);

    @Query(value = """
    SELECT
        g.id as id,
        g.direction as direction,
        g.hours as hours,
        ST_Y(g.location) as latitude,
        ST_X(g.location) as longitude,
        g.selling_type as sellingType,
        g.brand as brand,
        g.municipality as municipality,
        p.id as priceId,
        p.date as priceDate,
        p.gasoline95 as gasoline95,
        p.gasoline98 as gasoline98,
        p.diesel as diesel
    FROM gas_stations g
    LEFT JOIN prices p ON p.gas_station_id = g.id AND p.date = (
        SELECT MAX(p2.date) FROM prices p2 WHERE p2.gas_station_id = g.id
    )
    WHERE ST_Within(g.location, ST_GeomFromText(:envelopeWkt, 4326))
    """, nativeQuery = true)
    List<IGasStationProyectionWithPrice> findStationsInBoundingBox(@Param("envelopeWkt") String envelopeWkt);

    @Query(value = """
    SELECT
        g.id as id,
        g.direction as direction,
        g.hours as hours,
        ST_Y(g.location) as latitude,
        ST_X(g.location) as longitude,
        g.selling_type as sellingType,
        g.brand as brand,
        g.municipality as municipality
    FROM gas_stations g
    WHERE ST_Distance_Sphere(g.location, ST_GeomFromText(:polylineWkt, 4326)) <= :distanceMeters
    """, nativeQuery = true)
    List<IGasStationProyection> findStationsNearRoute(
            @Param("polylineWkt") String polylineWkt,
            @Param("distanceMeters") double distanceMeters
    );

    @Query(value = """
    SELECT 
        g.id as id,
        g.direction as direction,
        g.hours as hours,
        ST_Y(g.location) as latitude,
        ST_X(g.location) as longitude,
        g.selling_type as sellingType,
        g.brand as brand,
        g.municipality as municipality
    FROM gas_stations g
    """, nativeQuery = true)
    List<IGasStationProyection> findAllForSync();

    @Modifying
    @Transactional
    @Query(value = """
    INSERT INTO gas_stations (id, direction, hours, location, selling_type, brand, municipality)
    VALUES (:id, :direction, :hours, ST_GeomFromText(:locationWkt, 4326), :sellingType, :brand, :municipality)
    ON DUPLICATE KEY UPDATE
        direction = VALUES(direction),
        hours = VALUES(hours),
        location = VALUES(location),
        selling_type = VALUES(selling_type),
        brand = VALUES(brand),
        municipality = VALUES(municipality)
    """, nativeQuery = true)
    void upsertGasStation(
            @Param("id") Long id,
            @Param("direction") String direction,
            @Param("hours") String hours,
            @Param("locationWkt") String locationWkt,
            @Param("sellingType") String sellingType,
            @Param("brand") String brand,
            @Param("municipality") String municipality
    );
}