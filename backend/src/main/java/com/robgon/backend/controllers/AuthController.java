package com.robgon.backend.controllers;

import com.robgon.backend.dto.ChangePasswordInputDTO;
import com.robgon.backend.dto.LoginInputDTO;
import com.robgon.backend.dto.RefreshInputDTO;
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
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginInputDTO loginInputDTO){
        return ResponseEntity.ok(authService.login(loginInputDTO));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshInputDTO refreshInputDTO) {
        return ResponseEntity.ok(authService.refreshSession(refreshInputDTO));
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordInputDTO changePasswordInputDTO){
        authService.changePassword(changePasswordInputDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(){
        authService.delete();
        return ResponseEntity.ok().build();
    }

}
