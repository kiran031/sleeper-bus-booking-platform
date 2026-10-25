package com.sleeper.SleeperBookingPlatform.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.sleeper.SleeperBookingPlatform.dto.ApiErrorResponse;


@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException ex){
		Map<String,String> errors = new HashMap<>();
		for(FieldError error:ex.getBindingResult().getFieldErrors()) {
			String field = error.getField();
			String message = error.getDefaultMessage();
			errors.put(field, message);
		}
		ApiErrorResponse response = new ApiErrorResponse(HttpStatus.BAD_REQUEST.value(),"Validation failed",errors);
		return ResponseEntity.badRequest().body(response);
	}
}
