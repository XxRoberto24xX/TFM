package com.robgon.backend.services;

import com.robgon.backend.dto.*;
import com.robgon.backend.proyections.IGasStationProyection;
import com.robgon.backend.proyections.IGasStationProyectionWithPrice;
import com.robgon.backend.proyections.IPriceProyection;
import com.robgon.backend.repositories.IGasStationRepository;
import com.robgon.backend.repositories.IPricesRepository;
import com.robgon.backend.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class GasStationService {
    @Autowired
    private IGasStationRepository gasStationRepository;

    @Autowired
    private IPricesRepository pricesRepository;

    @Autowired
    private IUserRepository userRepository;

    public GetGasStationInfoOutputDTO getGasStationInfo(GetGasStationInfoInputDTO gasStationInfoInputDTO){
        IGasStationProyection gasStationInfo = gasStationRepository.findOnlyInfoById(gasStationInfoInputDTO.getGasStationId())
                .orElseThrow(() -> new RuntimeException("Gas station not found"));

        IPriceProyection prices = pricesRepository.findFirstByGasStationIdOrderByDateDesc(gasStationInfoInputDTO.getGasStationId())
                .orElseThrow(() -> new RuntimeException("Prices for the give gas station not found"));

        return new GetGasStationInfoOutputDTO(gasStationInfo, prices);
    }

    public GetGasStationsInRangeOutputDTO getGasStationsInRange(GetGasStationsInRangeInputDTO getGasStationsInRangeInputDTO){

        Double south = getGasStationsInRangeInputDTO.getSouth();
        Double north = getGasStationsInRangeInputDTO.getNorth();
        Double west = getGasStationsInRangeInputDTO.getWest();
        Double east = getGasStationsInRangeInputDTO.getEast();

        // creation to the input polygon using the data given
        String envelopeWkt = String.format(Locale.US,
        "POLYGON((%f %f, %f %f, %f %f, %f %f, %f %f))",
            west, south,
            west, north,
            east, north,
            east, south,
            west, south
        );

        List<IGasStationProyectionWithPrice> listGasStations = gasStationRepository.findStationsInBoundingBox(envelopeWkt);

        return new GetGasStationsInRangeOutputDTO(listGasStations);
    }

    public GetActualPricesOutputDTO getActualPrices (GetActualPricesInputDTO getActualPricesInputDTO){
        IPriceProyection prices = pricesRepository.findFirstByGasStationIdOrderByDateDesc(getActualPricesInputDTO.getGasStationId())
                .orElseThrow(() -> new RuntimeException("Prices for the give gas station not found"));

        return new GetActualPricesOutputDTO(prices);
    }

    public GetHisotoricalPricesOutputDTO getHistoricalPrices (GetHistoricalPricesInputDTO getHistoricalPricesInputDTO){
        List<IPriceProyection> pricesHistorical = pricesRepository.findByGasStationIdOrderByDateDesc(getHistoricalPricesInputDTO.getGasStationId());

        if(!pricesHistorical.isEmpty()){
            return new GetHisotoricalPricesOutputDTO(pricesHistorical);
        }else{
            throw new RuntimeException("Prices for the give gas station not found");
        }
    }

    public void addToFavorites(ChangeFavoritesInputDTO changeFavoritesInputDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userRepository.addFavorite(authentication.getName(), changeFavoritesInputDTO.getGasStationId());
    }

    public void removeFromFavorites(ChangeFavoritesInputDTO changeFavoritesInputDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userRepository.removeFavorite(authentication.getName(), changeFavoritesInputDTO.getGasStationId());
    }

    public GetListFavoritesOutputDTO getListFavorites(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        List<IGasStationProyection> favoriteGasStations = gasStationRepository.findUserFavoriteGasStations(authentication.getName());

        return new GetListFavoritesOutputDTO(favoriteGasStations);
    }
}
