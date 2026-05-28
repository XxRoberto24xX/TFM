package com.robgon.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robgon.backend.models.GasStationModel;
import com.robgon.backend.models.PricesModel;
import com.robgon.backend.repositories.IGasStationRepository;
import com.robgon.backend.repositories.IPricesRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.lang.Double.parseDouble;

@Service
public class ScheduleFuelService {

    @Autowired
    private IGasStationRepository gasStationRepository;

    @Autowired
    private IPricesRepository pricesRepository;

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
            gasStation.setDirection(node.path("Dirección").asText(null));
            gasStation.setHours(node.path("Horario").asText(null));
            gasStation.setLatitude(parseDouble(replaceComa(node.path("Latitud").asText())));
            gasStation.setLongitude(parseDouble(replaceComa(node.path("Longitud (WGS84)").asText())));
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

        Map<Long, GasStationModel> listDBGasStations = gasStationRepository.findAll()
                .stream()
                .collect(Collectors.toMap(
                        GasStationModel::getId,
                        gs -> gs
                ));

        if(listDBGasStations.isEmpty()){
            return null;
        }

        for(JsonNode node : prices){
            PricesModel price = new PricesModel();

            long stationId = node.path("IDEESS").asLong();
            GasStationModel station = listDBGasStations.get(stationId);

            price.setGasStation(station);
            price.setDate(LocalDate.now());
            price.setGasoline95(parseDouble(replaceComa(node.path("Precio Gasolina 95 E5").asText())));
            price.setGasoline98(parseDouble(replaceComa(node.path("Precio Gasolina 98 E5").asText())));
            price.setDiesel(parseDouble(replaceComa(node.path("Precio Gasoleo A").asText())));

            listPricesData.add(price);
        }
        return listPricesData;
    }

    private void syncGasStationsData(List<GasStationModel> parsedApiData){
        Map<Long, GasStationModel> actualGasStations = gasStationRepository.findAll()
                .stream()
                .collect(Collectors.toMap(
                        GasStationModel::getId,
                        gs -> gs
                ));
        
        List<GasStationModel> toSave = new ArrayList<>();
        
        for(GasStationModel apiGasStation : parsedApiData){
            GasStationModel dbGasStation = actualGasStations.get(apiGasStation.getId());
            
            if(dbGasStation == null){
                toSave.add(apiGasStation);
            } else{
                if (isGasStationDifferent(dbGasStation, apiGasStation)) {
                    dbGasStation.setDirection(apiGasStation.getDirection());
                    dbGasStation.setHours(apiGasStation.getHours());
                    dbGasStation.setLatitude(apiGasStation.getLatitude());
                    dbGasStation.setLongitude(apiGasStation.getLongitude());
                    dbGasStation.setSellingType(apiGasStation.getSellingType());
                    dbGasStation.setBrand(apiGasStation.getBrand());
                    dbGasStation.setMunicipality(apiGasStation.getMunicipality());

                    toSave.add(dbGasStation);
                }

                actualGasStations.remove(apiGasStation.getId());
            }
        }

        List<Long> toDelete = new ArrayList<>(actualGasStations.keySet());

        if(!toSave.isEmpty()){
            gasStationRepository.saveAll(toSave);
        }

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

        List<PricesModel> toSave = new ArrayList<>();

        for( PricesModel apiPrice : parsedApiData){
            PricesModel dbPrice = actualPrices.get(apiPrice.getGasStation().getId());

            if(dbPrice == null){
                toSave.add(apiPrice);
            }else{
                if (isPricesDifferent(dbPrice, apiPrice)) {
                    if(dbPrice.getDate().isEqual(apiPrice.getDate())){
                        dbPrice.setGasoline95(apiPrice.getGasoline95());
                        dbPrice.setGasoline98(apiPrice.getGasoline98());
                        dbPrice.setDiesel(apiPrice.getDiesel());

                        toSave.add(dbPrice);
                    }else{
                        toSave.add(apiPrice);
                    }
                }
            }
        }

        if(!toSave.isEmpty()){
            pricesRepository.saveAll(toSave);
        }
    }

    private boolean isGasStationDifferent(GasStationModel a, GasStationModel b) {
        return !Objects.equals(a.getDirection(), b.getDirection())
                || !Objects.equals(a.getHours(), b.getHours())
                || a.getLatitude() != b.getLatitude()
                || a.getLongitude() != b.getLongitude()
                || !Objects.equals(a.getSellingType(), b.getSellingType())
                || !Objects.equals(a.getBrand(), b.getBrand())
                || !Objects.equals(a.getMunicipality(), b.getMunicipality());
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
