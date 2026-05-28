package com.robgon.backend.repositories;

import com.robgon.backend.models.PricesModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPricesRepository extends JpaRepository<PricesModel, Long> {
    // Obtener precios de una gasolinera ordenados por fecha (histórico)
    List<PricesModel> findByGasStationIdOrderByDateDesc(Long gasStationId);

    // Obtener el último listado de precios registrados de una gasolinera
    Optional<PricesModel> findFirstByGasStationIdOrderByDateDesc(Long gasStationId);

    @Query("""
        SELECT p FROM PricesModel p
        WHERE p.date = (
            SELECT MAX(p2.date)
            FROM PricesModel p2
            WHERE p2.gasStation = p.gasStation
        )
    """)
    List<PricesModel> findLatestPricesForAllStations();
}
