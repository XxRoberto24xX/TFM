package com.robgon.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.locationtech.jts.geom.Point;

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

    @Column(name = "location", columnDefinition = "POINT SRID 4326", nullable = false)
    private Point location;

    @Column(
            name = "location_utm",
            columnDefinition = "GEOMETRY",
            insertable = false,
            updatable = false
    )
    private byte[] locationUtm;

    @Column
    private String sellingType;

    @Column
    private String brand;

    @Column
    private String municipality;

    @OneToMany(mappedBy = "gasStation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"gasStation"})
    private Set<PricesModel> prices;

    @ManyToMany(mappedBy = "favoriteGasStations", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"favoriteGasStations"})
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

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    @Transient
    public double getLatitude() {
        return location != null ? location.getY() : 0.0;
    }

    @Transient
    public double getLongitude() {
        return location != null ? location.getX() : 0.0;
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
