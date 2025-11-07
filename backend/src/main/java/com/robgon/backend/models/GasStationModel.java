package com.robgon.backend.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "gas_stations")
public class GasStationModel {

    @Id
    private Long id;

    @Column
    private String brand;

    @Column
    private String municipality;

    @Column
    private String direction;



    @ManyToMany(mappedBy = "favoriteGasStations", fetch = FetchType.LAZY)
    private Set<UserModel> usersWhoFavorited;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getMunicipality() {
        return municipality;
    }

    public void setMunicipality(String municipality) {
        this.municipality = municipality;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public Set<UserModel> getUsersWhoFavorited() {
        return usersWhoFavorited;
    }

    public void setUsersWhoFavorited(Set<UserModel> usersWhoFavorited) {
        this.usersWhoFavorited = usersWhoFavorited;
    }
}
