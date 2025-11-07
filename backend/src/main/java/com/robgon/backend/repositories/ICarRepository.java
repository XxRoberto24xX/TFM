package com.robgon.backend.repositories;

import com.robgon.backend.models.CarModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
    public interface ICarRepository extends JpaRepository<CarModel, String> {
    /* JPA ya trae los metodos de acceso basicos a las base de datos incorporados
    * con tan solo incluir la extensión ya se pueden utilizar, de todas meneras
    * en este espacio se pueden añadir la consultar personalizas extra que hagan
    * falta para el uso y funcionamiento de nuetra aplicacion en especifico */
}
