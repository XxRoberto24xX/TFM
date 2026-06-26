package com.robgon.backend.repositories;

import com.robgon.backend.models.PricesModel;
import com.robgon.backend.proyections.IPriceProyection;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IPricesRepository extends JpaRepository<PricesModel, Long> {
    // Obtener precios de una gasolinera ordenados por fecha (histórico)
    List<IPriceProyection> findByGasStationIdOrderByDateDesc(Long gasStationId);

    // Obtener el último listado de precios registrados de una gasolinera
    Optional<IPriceProyection> findFirstByGasStationIdOrderByDateDesc(Long gasStationId);

    @Query("""
        SELECT p FROM PricesModel p
        WHERE p.date = (
            SELECT MAX(p2.date)
            FROM PricesModel p2
            WHERE p2.gasStation = p.gasStation
        )
    """)
    List<PricesModel> findLatestPricesForAllStations();

    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO prices (gas_station_id, date, gasoline95, gasoline98, diesel, glp, diesel_premium, gasoline95premium, diesel_renewable)
        VALUES (:stationId, :date, :gasoline95, :gasoline98, :diesel, :glp, :dieselPremium, :gasoline95Premium, :dieselRenewable)
        ON DUPLICATE KEY UPDATE
            gasoline95 = VALUES(gasoline95),
            gasoline98 = VALUES(gasoline98),
            diesel = VALUES(diesel),
            glp = VALUES(glp),
            diesel_premium = VALUES(diesel_premium),
            gasoline95premium = VALUES(gasoline95premium),
            diesel_renewable = VALUES(diesel_renewable)
        """, nativeQuery = true)
    void upsertPrice(
            @Param("stationId") Long stationId,
            @Param("date") LocalDate date,
            @Param("gasoline95") Double gasoline95,
            @Param("gasoline98") Double gasoline98,
            @Param("diesel") Double diesel,
            @Param("glp") Double glp,
            @Param("dieselPremium") Double dieselPremium,
            @Param("gasoline95Premium") Double gasoline95Premium,
            @Param("dieselRenewable") Double dieselRenewable
    );
}
