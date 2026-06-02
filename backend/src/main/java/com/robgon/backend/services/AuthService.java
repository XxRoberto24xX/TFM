package com.robgon.backend.services;

import com.robgon.backend.dto.ChangePasswordInputDTO;
import com.robgon.backend.dto.LoginInputDTO;
import com.robgon.backend.dto.RegisterInputDTO;
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

    public String login(LoginInputDTO loginInputDTO){
        IUserPasswordProyection dbpassword = userRepository.findPasswordByEmail(loginInputDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(loginInputDTO.getPassword(), dbpassword.getPassword()))
            throw new RuntimeException("Invalid Password");

        return jwtUtil.generateToken(loginInputDTO.getEmail());
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
