package com.robgon.backend.exception;

import com.robgon.backend.dto.ErrorDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /* Exception handler for input arguments validation errors */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        ErrorDTO error = new ErrorDTO(
                ex.getClass().getSimpleName(),
                ex.getBindingResult().getFieldErrors().getFirst().getDefaultMessage()
        );
        return ResponseEntity.badRequest().body(error);
    }

    /* Exception handler for any other exceptions */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handlerGeneric(Exception ex){
        ErrorDTO error = new ErrorDTO(
                ex.getClass().getSimpleName(),
                ex.getMessage()
        );
        return ResponseEntity.internalServerError().body(error);
    }
}