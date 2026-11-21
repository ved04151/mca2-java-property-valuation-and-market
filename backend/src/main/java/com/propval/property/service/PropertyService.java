package com.propval.property.service;

import com.propval.common.ResourceNotFoundException;
import com.propval.property.dto.PageResponse;
import com.propval.property.dto.PropertyDto;
import com.propval.property.dto.PropertyRequest;
import com.propval.property.entity.Property;
import com.propval.property.repository.PropertyRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public PageResponse<PropertyDto> getProperties(
            String search,
            String city,
            String propertyType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sortBy,
            int page,
            int pageSize) {

        int pageIndex = Math.max(0, page - 1);
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        if ("priceAsc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("priceDesc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        } else if ("areaAsc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "areaSqFt");
        } else if ("areaDesc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "areaSqFt");
        } else if ("rateAsc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "pricePerSqFt");
        } else if ("rateDesc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "pricePerSqFt");
        }

        Pageable pageable = PageRequest.of(pageIndex, pageSize, sort);

        Specification<Property> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titleP = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate localityP = cb.like(cb.lower(root.get("locality")), searchPattern);
                Predicate cityP = cb.like(cb.lower(root.get("city")), searchPattern);
                Predicate addressP = cb.like(cb.lower(root.get("address")), searchPattern);
                predicates.add(cb.or(titleP, localityP, cityP, addressP));
            }

            if (city != null && !city.trim().isEmpty() && !"ALL".equalsIgnoreCase(city)) {
                predicates.add(cb.equal(cb.lower(root.get("city")), city.trim().toLowerCase()));
            }

            if (propertyType != null && !propertyType.trim().isEmpty() && !"ALL".equalsIgnoreCase(propertyType)) {
                predicates.add(cb.equal(cb.lower(root.get("propertyType")), propertyType.trim().toLowerCase()));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Property> propPage = propertyRepository.findAll(spec, pageable);

        List<PropertyDto> content = propPage.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                propPage.getTotalElements(),
                propPage.getTotalPages(),
                page,
                pageSize
        );
    }

    public PropertyDto getPropertyById(String id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
        return toDto(property);
    }

    @Transactional
    public PropertyDto createProperty(PropertyRequest request, String addedByUserId) {
        Property property = new Property();
        property.setId("prop_" + System.currentTimeMillis());
        applyRequestToEntity(request, property);
        property.setAddedBy(addedByUserId);

        Property saved = propertyRepository.save(property);
        return toDto(saved);
    }

    @Transactional
    public PropertyDto updateProperty(String id, PropertyRequest request, String currentUserId) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        assertOwner(property.getAddedBy(), currentUserId);
        applyRequestToEntity(request, property);
        Property updated = propertyRepository.save(property);
        return toDto(updated);
    }

    @Transactional
    public void deleteProperty(String id, String currentUserId) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
        assertOwner(property.getAddedBy(), currentUserId);
        propertyRepository.delete(property);
    }

    public Map<String, Object> getDistinctLocations() {
        Map<String, Object> result = new HashMap<>();
        result.put("cities", propertyRepository.findDistinctCities());
        result.put("localities", propertyRepository.findDistinctLocalities());
        result.put("propertyTypes", propertyRepository.findDistinctPropertyTypes());
        return result;
    }

    @Transactional
    public PropertyDto addImage(String propertyId, String imageUrl, String currentUserId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));
        assertOwner(property.getAddedBy(), currentUserId);
        property.getImages().add(imageUrl);
        return toDto(propertyRepository.save(property));
    }

    @Transactional
    public PropertyDto removeImage(String propertyId, int imageIndex, String currentUserId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));
        assertOwner(property.getAddedBy(), currentUserId);
        if (imageIndex >= 0 && imageIndex < property.getImages().size()) {
            property.getImages().remove(imageIndex);
        }
        return toDto(propertyRepository.save(property));
    }


    private void assertOwner(String ownerId, String currentUserId) {
        if (currentUserId == null || ownerId == null || !ownerId.equals(currentUserId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You can only modify or delete properties that you created.");
        }
    }

    private void applyRequestToEntity(PropertyRequest request, Property property) {
        property.setTitle(request.getTitle());
        property.setPropertyType(request.getPropertyType());
        property.setCity(request.getCity());
        property.setLocality(request.getLocality());
        property.setAddress(request.getAddress());
        property.setPincode(request.getPincode());
        property.setBhk(request.getBhk() != null ? request.getBhk() : 0);
        property.setBathrooms(request.getBathrooms() != null ? request.getBathrooms() : 1);
        property.setAreaSqFt(request.getAreaSqFt());
        property.setPrice(request.getPrice());
        if (request.getStatus() != null) property.setStatus(request.getStatus());
        if (request.getFurnishing() != null) property.setFurnishing(request.getFurnishing());
        property.setFloor(request.getFloor());
        property.setAgeOfPropertyYears(request.getAgeOfPropertyYears() != null ? request.getAgeOfPropertyYears() : 0);
        property.setFacing(request.getFacing());
        property.setParking(request.getParking());
        property.setDescription(request.getDescription());
        if (request.getVerified() != null) property.setVerified(request.getVerified());

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            property.setImages(new ArrayList<>(request.getImages()));
        }

        if (request.getAmenities() != null) {
            property.setAmenities(new ArrayList<>(request.getAmenities()));
        }
        property.calculatePricePerSqFt();
    }

    public PropertyDto toDto(Property property) {
        PropertyDto dto = new PropertyDto();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setPropertyType(property.getPropertyType());
        dto.setCity(property.getCity());
        dto.setLocality(property.getLocality());
        dto.setAddress(property.getAddress());
        dto.setPincode(property.getPincode());
        dto.setBhk(property.getBhk());
        dto.setBathrooms(property.getBathrooms());
        dto.setAreaSqFt(property.getAreaSqFt());
        dto.setPrice(property.getPrice());
        dto.setPricePerSqFt(property.getPricePerSqFt());
        dto.setStatus(property.getStatus());
        dto.setFurnishing(property.getFurnishing());
        dto.setFloor(property.getFloor());
        dto.setAgeOfPropertyYears(property.getAgeOfPropertyYears());
        dto.setFacing(property.getFacing());
        dto.setParking(property.getParking());
        dto.setDescription(property.getDescription());
        dto.setVerified(property.getVerified());
        dto.setAddedBy(property.getAddedBy());
        dto.setCreatedAt(property.getCreatedAt());
        dto.setUpdatedAt(property.getUpdatedAt());
        dto.setImages(new ArrayList<>(property.getImages()));
        dto.setAmenities(new ArrayList<>(property.getAmenities()));
        return dto;
    }
}
