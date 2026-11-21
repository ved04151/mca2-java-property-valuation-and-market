package com.propval.property.controller;

import com.propval.property.dto.PageResponse;
import com.propval.property.dto.PropertyDto;
import com.propval.property.dto.PropertyRequest;
import com.propval.property.service.PropertyService;
import com.propval.user.entity.User;
import com.propval.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final UserRepository userRepository;

    public PropertyController(PropertyService propertyService, UserRepository userRepository) {
        this.propertyService = propertyService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<PageResponse<PropertyDto>> getProperties(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String city,
            @RequestParam(required = false, defaultValue = "ALL") String propertyType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "6") int pageSize) {

        return ResponseEntity.ok(propertyService.getProperties(
                search, city, propertyType, minPrice, maxPrice, sortBy, page, pageSize
        ));
    }

    @GetMapping("/locations")
    public ResponseEntity<Map<String, Object>> getLocations() {
        return ResponseEntity.ok(propertyService.getDistinctLocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getPropertyById(@PathVariable String id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @PostMapping
    public ResponseEntity<PropertyDto> createProperty(
            @Valid @RequestBody PropertyRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = getAuthenticatedUserId(userDetails);
        PropertyDto created = propertyService.createProperty(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> updateProperty(
            @PathVariable String id,
            @Valid @RequestBody PropertyRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getAuthenticatedUserId(userDetails);
        return ResponseEntity.ok(propertyService.updateProperty(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getAuthenticatedUserId(userDetails);
        propertyService.deleteProperty(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<PropertyDto> addImage(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String imageUrl = body.get("imageUrl");
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("imageUrl is required");
        }
        return ResponseEntity.ok(propertyService.addImage(id, imageUrl, getAuthenticatedUserId(userDetails)));
    }

    @DeleteMapping("/{id}/images/{imageIndex}")
    public ResponseEntity<PropertyDto> removeImage(
            @PathVariable String id,
            @PathVariable int imageIndex,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(propertyService.removeImage(id, imageIndex, getAuthenticatedUserId(userDetails)));
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
