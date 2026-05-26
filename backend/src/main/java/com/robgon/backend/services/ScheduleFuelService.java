package com.robgon.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robgon.backend.models.GasStationModel;
import com.robgon.backend.repositories.IGasStationRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

    private JsonNode fuelData;
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
            fuelData = objectMapper.readTree(response);
            syncGasStationsData(parseGasStationsData(fuelData));
        }catch (Exception e){
            System.out.println("Error en la carga de datos:" + e.getMessage());
        }

        System.out.println("Datos de estaciones de servicio actualizados correctamente.");
    }

    private void syncGasStationsData(List<GasStationModel> apiData){
        Map<Long, GasStationModel> actualGasStations = gasStationRepository.findAll()
                .stream()
                .collect(Collectors.toMap(GasStationModel::getId, gs -> gs));
        
        List<GasStationModel> toSave = new ArrayList<>();
        
        for(GasStationModel apiGasStation : apiData){
            GasStationModel dbGasStation = actualGasStations.get(apiGasStation.getId());
            
            if(dbGasStation == null){
                toSave.add(apiGasStation);
            } else{
                if (isDifferent(dbGasStation, apiGasStation)) {
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

    private List<GasStationModel> parseGasStationsData(JsonNode root) {

        List<GasStationModel> result = new ArrayList<>();

        JsonNode stations = root.path("ListaEESSPrecio");

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

            result.add(gasStation);
        }

        return result;
    }

    private boolean isDifferent(GasStationModel a, GasStationModel b) {
        return !Objects.equals(a.getDirection(), b.getDirection())
                || !Objects.equals(a.getHours(), b.getHours())
                || a.getLatitude() != b.getLatitude()
                || a.getLongitude() != b.getLongitude()
                || !Objects.equals(a.getSellingType(), b.getSellingType())
                || !Objects.equals(a.getBrand(), b.getBrand())
                || !Objects.equals(a.getMunicipality(), b.getMunicipality());
    }

    private String replaceComa(String value){
        if (value == null || value.isEmpty()) return "0.0";

        return value.replace(",", ".");
    }

    public JsonNode getFuelData(){
        return fuelData;
    }
}
