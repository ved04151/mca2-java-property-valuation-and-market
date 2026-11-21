package com.propval.property.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PropertyDto {
    private String id;
    private String title;
    private String propertyType;
    private String city;
    private String locality;
    private String address;
    private String pincode;
    private Integer bhk;
    private Integer bathrooms;
    private BigDecimal areaSqFt;
    private BigDecimal price;
    private BigDecimal pricePerSqFt;
    private String status;
    private String furnishing;
    private String floor;
    private Integer ageOfPropertyYears;
    private String facing;
    private String parking;
    private String description;
    private Boolean verified;
    private String addedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> images = new ArrayList<>();
    private List<String> amenities = new ArrayList<>();

    public PropertyDto() {}

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
