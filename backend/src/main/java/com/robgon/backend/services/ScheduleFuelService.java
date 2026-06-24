package com.robgon.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robgon.backend.dto.FuelPriceSummary;
import com.robgon.backend.models.GasStationModel;
import com.robgon.backend.models.PricesModel;
import com.robgon.backend.proyections.IGasStationProyection;
import com.robgon.backend.repositories.IGasStationRepository;
import com.robgon.backend.repositories.IPricesRepository;
import jakarta.annotation.PostConstruct;
import org.apache.commons.text.WordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.function.ToDoubleFunction;
import java.util.stream.Collectors;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import static java.lang.Double.parseDouble;

@Service
public class ScheduleFuelService {

    @Autowired
    private IGasStationRepository gasStationRepository;

    @Autowired
    private IPricesRepository pricesRepository;

    @Autowired
    private FuelPriceMargins fuelPriceMargins;

    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init(){
        updateFuelData();
    }

    @Scheduled(fixedRate = 1000*60*30)
    public void updateFuelData(){
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

        try{
            String response = restTemplate.getForObject(url, String.class);
            JsonNode apiData = objectMapper.readTree(response);

            syncGasStationsData(parseNewGasStationInformation(apiData));
            upsertPricesData(parseNewPricesInformation(apiData));
        }catch (Exception e){
            System.out.println("Error en la carga de datos:" + e.getMessage());
            return;
        }

        System.out.println("Datos de estaciones de servicio actualizados correctamente.");
    }

    private List<GasStationModel> parseNewGasStationInformation(JsonNode root) {

        JsonNode stations = root.path("ListaEESSPrecio");
        List<GasStationModel> listGasStationsData = new ArrayList<>();

        for (JsonNode node : stations) {

            GasStationModel gasStation = new GasStationModel();

            gasStation.setId(node.path("IDEESS").asLong());

            String rawDirection = node.path("Dirección").asText(null);
            String formatedDirection = null;
            if(rawDirection != null){
                formatedDirection = WordUtils.capitalizeFully(rawDirection);
            }
            gasStation.setDirection(formatedDirection);

            gasStation.setHours(node.path("Horario").asText(null));

            double lat = parseDouble(replaceComa(node.path("Latitud").asText()));
            double lng = parseDouble(replaceComa(node.path("Longitud (WGS84)").asText()));

            Coordinate coordinate = new Coordinate(lng, lat);
            Point gpsPoint = geometryFactory.createPoint(coordinate);

            gasStation.setLocation(gpsPoint);

            gasStation.setBrand(node.path("Rótulo").asText(null));
            gasStation.setMunicipality(node.path("Municipio").asText(null));
            String tipoVenta = node.path("Tipo Venta").asText(null);

            if ("P".equalsIgnoreCase(tipoVenta)) {
                gasStation.setSellingType("public");
            } else if ("R".equalsIgnoreCase(tipoVenta)) {
                gasStation.setSellingType("private");
            } else {
                gasStation.setSellingType("unknown");
            }

            listGasStationsData.add(gasStation);
        }
        return listGasStationsData;
    }

    private List<PricesModel> parseNewPricesInformation(JsonNode root){

        JsonNode prices = root.path("ListaEESSPrecio");
        List<PricesModel> listPricesData = new ArrayList<>();

        Map<Long, IGasStationProyection> listDBGasStations = gasStationRepository.findAllForSync()
                .stream()
                .collect(Collectors.toMap(
                        IGasStationProyection::getId,
                        gs -> gs
                ));

        if(listDBGasStations.isEmpty()){
            return null;
        }

        for(JsonNode node : prices){
            long stationId = node.path("IDEESS").asLong();
            IGasStationProyection stationProyection = listDBGasStations.get(stationId);

            GasStationModel stationStub = new GasStationModel();
            stationStub.setId(stationProyection.getId());

            PricesModel price = new PricesModel();

            price.setGasStation(stationStub);
            price.setDate(LocalDate.now());
            price.setGasoline95(parseDouble(replaceComa(node.path("Precio Gasolina 95 E5").asText())));
            price.setGasoline98(parseDouble(replaceComa(node.path("Precio Gasolina 98 E5").asText())));
            price.setDiesel(parseDouble(replaceComa(node.path("Precio Gasoleo A").asText())));

            listPricesData.add(price);
        }
        return listPricesData;
    }

    private void syncGasStationsData(List<GasStationModel> parsedApiData){
        Map<Long, IGasStationProyection> actualGasStations = gasStationRepository.findAllForSync()
                .stream()
                .collect(Collectors.toMap(
                        IGasStationProyection::getId,
                        gs -> gs
                ));

        for (GasStationModel apiGasStation : parsedApiData) {
            String wkt = String.format(Locale.US, "POINT(%f %f)",
                    apiGasStation.getLocation().getX(),
                    apiGasStation.getLocation().getY());

            gasStationRepository.upsertGasStation(
                    apiGasStation.getId(),
                    apiGasStation.getDirection(),
                    apiGasStation.getHours(),
                    wkt,
                    apiGasStation.getSellingType(),
                    apiGasStation.getBrand(),
                    apiGasStation.getMunicipality()
            );

            actualGasStations.remove(apiGasStation.getId());
        }

        List<Long> toDelete = new ArrayList<>(actualGasStations.keySet());

        if (!toDelete.isEmpty()) {
            gasStationRepository.deleteByIdIn(toDelete);
        }
    }

    private void upsertPricesData(List<PricesModel> parsedApiData){
        Map<Long, PricesModel> actualPrices = pricesRepository.findLatestPricesForAllStations()
                .stream()
                .collect(Collectors.toMap(
                        p -> p.getGasStation().getId(),
                        p -> p
                ));


        for (PricesModel apiPrice : parsedApiData) {
            PricesModel dbPrice = actualPrices.get(apiPrice.getGasStation().getId());

            boolean registrarPrecio = false;

            if (dbPrice == null) {
                registrarPrecio = true;
            } else {
                if (dbPrice.getDate().isEqual(apiPrice.getDate())) {
                    if (isPricesDifferent(dbPrice, apiPrice)) {
                        dbPrice.setGasoline95(apiPrice.getGasoline95());
                        dbPrice.setGasoline98(apiPrice.getGasoline98());
                        dbPrice.setDiesel(apiPrice.getDiesel());

                        pricesRepository.upsertPrice(
                                dbPrice.getGasStation().getId(),
                                dbPrice.getDate(),
                                dbPrice.getGasoline95(),
                                dbPrice.getGasoline98(),
                                dbPrice.getDiesel()
                        );
                    }
                } else {
                    registrarPrecio = true;
                }

            }

            if (registrarPrecio) {
                pricesRepository.upsertPrice(
                        apiPrice.getGasStation().getId(),
                        apiPrice.getDate(),
                        apiPrice.getGasoline95(),
                        apiPrice.getGasoline98(),
                        apiPrice.getDiesel()
                );
            }
        }

        if (!parsedApiData.isEmpty()) {
            FuelPriceSummary.FuelRange statsG95 = calcularRango(parsedApiData, PricesModel::getGasoline95);
            FuelPriceSummary.FuelRange statsG98 = calcularRango(parsedApiData, PricesModel::getGasoline98);
            FuelPriceSummary.FuelRange statsDiesel = calcularRango(parsedApiData, PricesModel::getDiesel);

            FuelPriceSummary nuevoResumen = new FuelPriceSummary(statsG95, statsG98, statsDiesel);

            // Guardamos el resultado en el Singleton de memoria
            fuelPriceMargins.updateMargins(nuevoResumen);
        }
    }

    private FuelPriceSummary.FuelRange calcularRango(List<PricesModel> prices, ToDoubleFunction<PricesModel> mapper) {
        DoubleSummaryStatistics stats = prices.stream()
                .mapToDouble(mapper)
                .filter(price -> price > 0.0)
                .summaryStatistics();

        double min = (stats.getCount() > 0) ? stats.getMin() : 0.0;
        double max = (stats.getCount() > 0) ? stats.getMax() : 0.0;

        return new FuelPriceSummary.FuelRange(min, max);
    }

    private boolean isGasStationDifferent(IGasStationProyection db, GasStationModel api) {
        return !Objects.equals(db.getDirection(), api.getDirection())
                || !Objects.equals(db.getHours(), api.getHours())
                || db.getLatitude() != api.getLatitude()
                || db.getLongitude() != api.getLongitude()
                || !Objects.equals(db.getSellingType(), api.getSellingType())
                || !Objects.equals(db.getBrand(), api.getBrand())
                || !Objects.equals(db.getMunicipality(), api.getMunicipality());
    }

    private boolean isPricesDifferent(PricesModel a, PricesModel b) {
        return !Objects.equals(a.getGasoline95(), b.getGasoline95())
                || !Objects.equals(a.getGasoline98(), b.getGasoline98())
                || !Objects.equals(a.getDiesel(), b.getDiesel());
    }

    private String replaceComa(String value){
        if (value == null || value.isEmpty()) return "0.0";

        return value.replace(",", ".");
    }
}
