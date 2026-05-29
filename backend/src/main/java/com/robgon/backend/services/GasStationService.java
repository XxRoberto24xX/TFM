package com.robgon.backend.services;

import com.robgon.backend.dto.*;
import com.robgon.backend.models.GasStationModel;
import com.robgon.backend.models.UserModel;
import com.robgon.backend.proyections.IGasStationProyection;
import com.robgon.backend.proyections.IPriceProyection;
import com.robgon.backend.repositories.IGasStationRepository;
import com.robgon.backend.repositories.IPricesRepository;
import com.robgon.backend.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

        UserModel user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        GasStationModel gasStation = gasStationRepository.findById(changeFavoritesInputDTO.getGasStationId())
                .orElseThrow(() -> new RuntimeException("Gas station not found"));

        user.getFavoriteGasStations().add(gasStation);
        userRepository.save(user);
    }

    public void removeFromFavorites(ChangeFavoritesInputDTO changeFavoritesInputDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserModel user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        GasStationModel gasStation = gasStationRepository.findById(changeFavoritesInputDTO.getGasStationId())
                .orElseThrow(() -> new RuntimeException("Gas station not found"));

        user.getFavoriteGasStations().remove(gasStation);
        userRepository.save(user);
    }

    public GetListFavoritesOutputDTO getListFavorites(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        List<IGasStationProyection> favoriteGasStations = gasStationRepository.findUserFavoriteGasStations(authentication.getName());

        return new GetListFavoritesOutputDTO(favoriteGasStations);
    }
}
