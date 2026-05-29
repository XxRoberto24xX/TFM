package com.robgon.backend.services;

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

    public String login(String email, String password){
        IUserPasswordProyection dbpassword = userRepository.findPasswordByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(password, dbpassword.getPassword()))
            throw new RuntimeException("Invalid Password");

        return jwtUtil.generateToken(email);
    }

    public void register(RegisterInputDTO registerInputDTO){
        UserModel user = new UserModel();
        user.setUsername(registerInputDTO.getUsername());
        user.setEmail(registerInputDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerInputDTO.getPassword()));

        userRepository.save(user);
    }
}
