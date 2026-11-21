package com.propval.property.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "property_type", nullable = false, length = 100)
    private String propertyType;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "locality", nullable = false, length = 150)
    private String locality;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "pincode", nullable = false, length = 10)
    private String pincode;

    @Column(name = "bhk", nullable = false)
    private Integer bhk = 0;

    @Column(name = "bathrooms", nullable = false)
    private Integer bathrooms = 1;

    @Column(name = "area_sq_ft", nullable = false, precision = 12, scale = 2)
    private BigDecimal areaSqFt;

    @Column(name = "price", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "price_per_sq_ft", nullable = false, precision = 12, scale = 2)
    private BigDecimal pricePerSqFt;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "Ready to Move";

    @Column(name = "furnishing", nullable = false, length = 50)
    private String furnishing = "Semi-Furnished";

    @Column(name = "floor", length = 50)
    private String floor;

    @Column(name = "age_of_property_years", nullable = false)
    private Integer ageOfPropertyYears = 0;

    @Column(name = "facing", length = 50)
    private String facing;

    @Column(name = "parking", length = 100)
    private String parking;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "verified", nullable = false)
    private Boolean verified = true;

    @Column(name = "added_by", length = 64)
    private String addedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    @OrderColumn(name = "display_order")
    private List<String> images = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity", length = 150)
    private List<String> amenities = new ArrayList<>();

    public Property() {}

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "prop_" + System.currentTimeMillis();
        }
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        calculatePricePerSqFt();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculatePricePerSqFt();
    }

    public void calculatePricePerSqFt() {
        if (price != null && areaSqFt != null && areaSqFt.compareTo(BigDecimal.ZERO) > 0) {
            this.pricePerSqFt = price.divide(areaSqFt, 2, java.math.RoundingMode.HALF_UP);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public Integer getBhk() { return bhk; }
    public void setBhk(Integer bhk) { this.bhk = bhk; }

    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }

    public BigDecimal getAreaSqFt() { return areaSqFt; }
    public void setAreaSqFt(BigDecimal areaSqFt) { this.areaSqFt = areaSqFt; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getPricePerSqFt() { return pricePerSqFt; }
    public void setPricePerSqFt(BigDecimal pricePerSqFt) { this.pricePerSqFt = pricePerSqFt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFurnishing() { return furnishing; }
    public void setFurnishing(String furnishing) { this.furnishing = furnishing; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public Integer getAgeOfPropertyYears() { return ageOfPropertyYears; }
    public void setAgeOfPropertyYears(Integer ageOfPropertyYears) { this.ageOfPropertyYears = ageOfPropertyYears; }

    public String getFacing() { return facing; }
    public void setFacing(String facing) { this.facing = facing; }

    public String getParking() { return parking; }
    public void setParking(String parking) { this.parking = parking; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public String getAddedBy() { return addedBy; }
    public void setAddedBy(String addedBy) { this.addedBy = addedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
}
