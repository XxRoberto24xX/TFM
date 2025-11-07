package com.robgon.backend.services;

import com.robgon.backend.models.UserModel;
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

    public UserModel register(UserModel user){
        if(userRepository.existsByUsername(user.getUsername()))
            throw new RuntimeException("Username already exists");

        if(userRepository.existsByEmail(user.getEmail()))
            throw new RuntimeException("Email already exists");

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String login(String email, String password){
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid Password");

        return jwtUtil.generateToken(email);
    }

}
