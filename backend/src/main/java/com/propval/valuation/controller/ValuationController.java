package com.propval.valuation.controller;

import com.propval.property.dto.PageResponse;
import com.propval.valuation.dto.SaveValuationRequest;
import com.propval.valuation.dto.ValuationCalculationRequest;
import com.propval.valuation.dto.ValuationDto;
import com.propval.valuation.service.ValuationService;
import com.propval.user.entity.User;
import com.propval.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/valuations")
public class ValuationController {

    private final ValuationService valuationService;
    private final UserRepository userRepository;

    public ValuationController(ValuationService valuationService, UserRepository userRepository) {
        this.valuationService = valuationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/calculate")
    public ResponseEntity<ValuationDto> calculateValuation(
            @Valid @RequestBody ValuationCalculationRequest request) {
        return ResponseEntity.ok(valuationService.calculateValuation(request));
    }

    @PostMapping
    public ResponseEntity<ValuationDto> saveValuation(
            @Valid @RequestBody SaveValuationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(valuationService.saveValuation(request, userEmail));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ValuationDto>> getValuations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String city,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "8") int pageSize) {
        return ResponseEntity.ok(valuationService.getValuations(search, city, page, pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ValuationDto> getValuationById(@PathVariable String id) {
        return ResponseEntity.ok(valuationService.getValuationById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteValuation(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getAuthenticatedUserId(userDetails);
        valuationService.deleteValuation(id, userId);
        return ResponseEntity.noContent().build();
    }

    private String getAuthenticatedUserId(UserDetails userDetails) {
        if (userDetails == null) {
            throw new AccessDeniedException("Authentication is required.");
        }
        return userRepository.findByEmailIgnoreCase(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new AccessDeniedException("Authenticated user was not found."));
    }
}
