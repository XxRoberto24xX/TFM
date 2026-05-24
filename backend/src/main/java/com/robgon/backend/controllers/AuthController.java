package com.robgon.backend.controllers;

import com.robgon.backend.dto.LoginInputDTO;
import com.robgon.backend.dto.LoginOutputDTO;
import com.robgon.backend.dto.RegisterInputDTO;
import com.robgon.backend.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterInputDTO registerInputDTO){
        authService.register(registerInputDTO);
        return ResponseEntity.ok("");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginInputDTO loginInputDTO){
        String token = authService.login(loginInputDTO.getEmail(), loginInputDTO.getPassword());
        return ResponseEntity.ok(new LoginOutputDTO(token));
    }

}
