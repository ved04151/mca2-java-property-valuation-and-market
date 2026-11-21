package com.propval.valuation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ValuationCalculationRequest {

    private String propertyId;
    private String propertyTitle;
    private String clientName;

    @NotBlank(message = "City is required")
    private String city = "Noida";

    @NotBlank(message = "Locality is required")
    private String locality = "Sector 78";

    @NotBlank(message = "Property type is required")
    private String propertyType = "Apartment";

    @NotNull(message = "Area is required")
    @DecimalMin(value = "1.0", message = "Area must be at least 1 sq.ft")
    private BigDecimal areaSqFt = BigDecimal.valueOf(1200);

    private Integer bhk = 3;
    private Integer ageYears = 3;
    private String condition = "Good";
    private Integer amenitiesCount = 4;
    private Integer floorLevel = 5;
    private String notes;

    public ValuationCalculationRequest() {}

    // Getters and Setters
    public String getPropertyId() { return propertyId; }
    public void setPropertyId(String propertyId) { this.propertyId = propertyId; }

    public String getPropertyTitle() { return propertyTitle; }
    public void setPropertyTitle(String propertyTitle) { this.propertyTitle = propertyTitle; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public BigDecimal getAreaSqFt() { return areaSqFt; }
    public void setAreaSqFt(BigDecimal areaSqFt) { this.areaSqFt = areaSqFt; }

    public Integer getBhk() { return bhk; }
    public void setBhk(Integer bhk) { this.bhk = bhk; }

    public Integer getAgeYears() { return ageYears; }
    public void setAgeYears(Integer ageYears) { this.ageYears = ageYears; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public Integer getAmenitiesCount() { return amenitiesCount; }
    public void setAmenitiesCount(Integer amenitiesCount) { this.amenitiesCount = amenitiesCount; }

    public Integer getFloorLevel() { return floorLevel; }
    public void setFloorLevel(Integer floorLevel) { this.floorLevel = floorLevel; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
