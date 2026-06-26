package com.robgon.backend.services;

import com.robgon.backend.dto.*;
import com.robgon.backend.models.UserModel;
import com.robgon.backend.proyections.IUserPasswordProyection;
import com.robgon.backend.repositories.IUserRepository;
import com.robgon.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService
{

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AccessOutputdto login(LoginInputDTO loginInputDTO){
        IUserPasswordProyection dbpassword = userRepository.findPasswordByEmail(loginInputDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(loginInputDTO.getPassword(), dbpassword.getPassword()))
            throw new RuntimeException("Invalid Password");

        String accessToken = jwtUtil.generateAccessToken(loginInputDTO.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(loginInputDTO.getEmail());

        return new AccessOutputdto(accessToken, refreshToken);
    }

    public AccessOutputdto refreshSession(RefreshInputDTO refreshInputDTO) {
        String oldRefreshToken = refreshInputDTO.getRefreshToken();

        if (oldRefreshToken == null || !jwtUtil.validateToken(oldRefreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String tokenType = jwtUtil.extractTokenType(oldRefreshToken);
        if (!"REFRESH".equals(tokenType)) {
            throw new RuntimeException("Provided token is not a valid refresh token");
        }

        String email = jwtUtil.extractUsername(oldRefreshToken);

        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("User associated with this token no longer exists");
        }

        String newAccessToken = jwtUtil.generateAccessToken(email);
        String newRefreshToken = jwtUtil.generateRefreshToken(email);

        return new AccessOutputdto(newAccessToken, newRefreshToken);
    }

    public void register(RegisterInputDTO registerInputDTO){
        if(userRepository.findByEmail(registerInputDTO.getEmail()).isPresent()){
            throw new RuntimeException("Email already in use");
        }

        UserModel user = new UserModel();
        user.setEmail(registerInputDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerInputDTO.getPassword()));

        userRepository.save(user);
    }

    public void changePassword(ChangePasswordInputDTO changePasswordInputDTO){
        IUserPasswordProyection dbpassword = userRepository.findPasswordByEmail(changePasswordInputDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(changePasswordInputDTO.getOldPassword(), dbpassword.getPassword()))
            throw new RuntimeException("Invalid Password");

        UserModel user = new UserModel();
        user.setEmail(changePasswordInputDTO.getEmail());
        user.setPassword(passwordEncoder.encode(changePasswordInputDTO.getNewPassword()));

        userRepository.save(user);
    }
}
