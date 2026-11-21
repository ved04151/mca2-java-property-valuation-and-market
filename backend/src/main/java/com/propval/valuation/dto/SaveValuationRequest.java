package com.propval.valuation.dto;

import java.math.BigDecimal;

public class SaveValuationRequest {
    private String propertyId;
    private String propertyTitle;
    private String clientName;
    private String city;
    private String locality;
    private String propertyType;
    private BigDecimal areaSqFt;
    private Integer bhk;
    private Integer ageYears;
    private String condition;
    private Integer amenitiesScore;
    private BigDecimal baseRateSqFt;
    private BigDecimal adjustedRateSqFt;
    private BigDecimal estimatedPrice;
    private BigDecimal priceRangeLow;
    private BigDecimal priceRangeHigh;
    private Integer confidenceScore;
    private String notes;
    private ValuationBreakdownDto breakdown;

    public SaveValuationRequest() {}

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

    public Integer getAmenitiesScore() { return amenitiesScore; }
    public void setAmenitiesScore(Integer amenitiesScore) { this.amenitiesScore = amenitiesScore; }

    public BigDecimal getBaseRateSqFt() { return baseRateSqFt; }
    public void setBaseRateSqFt(BigDecimal baseRateSqFt) { this.baseRateSqFt = baseRateSqFt; }

    public BigDecimal getAdjustedRateSqFt() { return adjustedRateSqFt; }
    public void setAdjustedRateSqFt(BigDecimal adjustedRateSqFt) { this.adjustedRateSqFt = adjustedRateSqFt; }

    public BigDecimal getEstimatedPrice() { return estimatedPrice; }
    public void setEstimatedPrice(BigDecimal estimatedPrice) { this.estimatedPrice = estimatedPrice; }

    public BigDecimal getPriceRangeLow() { return priceRangeLow; }
    public void setPriceRangeLow(BigDecimal priceRangeLow) { this.priceRangeLow = priceRangeLow; }

    public BigDecimal getPriceRangeHigh() { return priceRangeHigh; }
    public void setPriceRangeHigh(BigDecimal priceRangeHigh) { this.priceRangeHigh = priceRangeHigh; }

    public Integer getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Integer confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public ValuationBreakdownDto getBreakdown() { return breakdown; }
    public void setBreakdown(ValuationBreakdownDto breakdown) { this.breakdown = breakdown; }
}
