package com.robgon.backend.repositories;

import com.robgon.backend.models.UserModel;
import com.robgon.backend.proyections.IUserPasswordProyection;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<UserModel, String> {
    Optional<UserModel> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("""
        SELECT u.password as password
        FROM UserModel u
        WHERE u.email = :email
        """)
    Optional<IUserPasswordProyection> findPasswordByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "INSERT IGNORE INTO user_favorite_gas_stations (user_email, gas_station_id) VALUES (:email, :stationId)", nativeQuery = true)
    void addFavorite(@Param("email") String email, @Param("stationId") Long stationId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_favorite_gas_stations WHERE user_email = :email AND gas_station_id = :stationId", nativeQuery = true)
    void removeFavorite(@Param("email") String email, @Param("stationId") Long stationId);
}
