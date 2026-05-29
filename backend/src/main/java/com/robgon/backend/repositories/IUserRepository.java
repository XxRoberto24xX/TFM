package com.robgon.backend.repositories;

import com.robgon.backend.models.UserModel;
import com.robgon.backend.proyections.IUserPasswordProyection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<UserModel, String> {
    Optional<UserModel> findByEmail(String email);

    @Query("""
        SELECT u.password as password
        FROM UserModel u
        WHERE u.email = :email
        """)
    Optional<IUserPasswordProyection> findPasswordByEmail(String email);
}
