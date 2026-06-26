package com.robgon.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Entity
@Table(
    name = "prices",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"gas_station_id", "date"})
    },
    indexes = {
        @Index(name = "idx_gasstation_date", columnList = "gas_station_id, date"), // Composite index for gas_station_id and date
        @Index(name = "idx_prices_date", columnList = "date") // Index for date to speed up queries filtering by date and the deletion of the historic prices
    }
)
public class PricesModel {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gas_station_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({"prices", "usersWhoFavorited"})
    private GasStationModel gasStation;

    @Column(nullable = false)
    private LocalDate date;

    @Column
    private Double gasoline95;

    @Column
    private Double gasoline98;

    @Column
    private Double diesel;

    @Column
    private Double glp;

    @Column
    private Double dieselPremium;

    @Column
    private Double gasoline95Premium;

    @Column
    private Double dieselRenewable;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GasStationModel getGasStation() {
        return gasStation;
    }

    public void setGasStation(GasStationModel gasStation) {
        this.gasStation = gasStation;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getGasoline95() {
        return gasoline95;
    }

    public void setGasoline95(Double gasoline95) {
        this.gasoline95 = gasoline95;
    }

    public Double getDiesel() {
        return diesel;
    }

    public void setDiesel(Double diesel) {
        this.diesel = diesel;
    }

    public Double getGasoline98() {
        return gasoline98;
    }

    public void setGasoline98(Double gasoline98) {
        this.gasoline98 = gasoline98;
    }

    public Double getGlp() {
        return glp;
    }

    public void setGlp(Double glp) {
        this.glp = glp;
    }

    public Double getDieselPremium() {
        return dieselPremium;
    }

    public void setDieselPremium(Double dieselPremium) {
        this.dieselPremium = dieselPremium;
    }

    public Double getGasoline95Premium() {
        return gasoline95Premium;
    }

    public void setGasoline95Premium(Double gasoline95Premium) {
        this.gasoline95Premium = gasoline95Premium;
    }

    public Double getDieselRenewable() {
        return dieselRenewable;
    }

    public void setDieselRenewable(Double dieselRenewable) {
        this.dieselRenewable = dieselRenewable;
    }
}
