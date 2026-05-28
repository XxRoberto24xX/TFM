package com.robgon.backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "gas_stations")
public class GasStationModel {

    @Id
    private Long id;

    @Column
    private String direction;

    @Column
    private String hours;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column
    private String sellingType;

    @Column
    private String brand;

    @Column
    private String municipality;

    @OneToMany(mappedBy = "gasStation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PricesModel> prices;

    @ManyToMany(mappedBy = "favoriteGasStations", fetch = FetchType.LAZY)
    private Set<UserModel> usersWhoFavorited;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getHours() {
        return hours;
    }

    public void setHours(String hours) {
        this.hours = hours;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getMunicipality() {
        return municipality;
    }

    public void setMunicipality(String municipality) {
        this.municipality = municipality;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getSellingType() {
        return sellingType;
    }

    public void setSellingType(String sellingType) {
        this.sellingType = sellingType;
    }

    public Set<PricesModel> getPrices() {
        return prices;
    }

    public void setPrices(Set<PricesModel> prices) {
        this.prices = prices;
    }

    public Set<UserModel> getUsersWhoFavorited() {
        return usersWhoFavorited;
    }

    public void setUsersWhoFavorited(Set<UserModel> usersWhoFavorited) {
        this.usersWhoFavorited = usersWhoFavorited;
    }


}
