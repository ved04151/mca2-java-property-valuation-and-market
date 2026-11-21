package com.propval.valuation.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "valuations")
public class Valuation {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "property_id", length = 64)
    private String propertyId;

    @Column(name = "property_title", nullable = false)
    private String propertyTitle;

    @Column(name = "client_name", nullable = false, length = 150)
    private String clientName;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "locality", nullable = false, length = 150)
    private String locality;

    @Column(name = "property_type", nullable = false, length = 100)
    private String propertyType;

    @Column(name = "area_sq_ft", nullable = false, precision = 12, scale = 2)
    private BigDecimal areaSqFt;

    @Column(name = "bhk", nullable = false)
    private Integer bhk = 0;

    @Column(name = "age_years", nullable = false)
    private Integer ageYears = 0;

    @Column(name = "condition_type", nullable = false, length = 50)
    private String conditionType = "Good";

    @Column(name = "amenities_score", nullable = false)
    private Integer amenitiesScore = 5;

    @Column(name = "base_rate_sq_ft", nullable = false, precision = 12, scale = 2)
    private BigDecimal baseRateSqFt;

    @Column(name = "adjusted_rate_sq_ft", nullable = false, precision = 12, scale = 2)
    private BigDecimal adjustedRateSqFt;

    @Column(name = "estimated_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal estimatedPrice;

    @Column(name = "price_range_low", nullable = false, precision = 15, scale = 2)
    private BigDecimal priceRangeLow;

    @Column(name = "price_range_high", nullable = false, precision = 15, scale = 2)
    private BigDecimal priceRangeHigh;

    @Column(name = "confidence_score", nullable = false)
    private Integer confidenceScore = 85;

    @Column(name = "assessor_id", length = 64)
    private String assessorId;

    @Column(name = "assessor_name", nullable = false, length = 150)
    private String assessorName;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "COMPLETED";

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "date", nullable = false)
    private LocalDateTime date = LocalDateTime.now();

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @PrimaryKeyJoinColumn
    private ValuationBreakdown breakdown;

    public Valuation() {}

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "val_" + System.currentTimeMillis();
        }
        if (date == null) {
            date = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public String getConditionType() { return conditionType; }
    public void setConditionType(String conditionType) { this.conditionType = conditionType; }

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

    public String getAssessorId() { return assessorId; }
    public void setAssessorId(String assessorId) { this.assessorId = assessorId; }

    public String getAssessorName() { return assessorName; }
    public void setAssessorName(String assessorName) { this.assessorName = assessorName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public ValuationBreakdown getBreakdown() { return breakdown; }
    public void setBreakdown(ValuationBreakdown breakdown) { this.breakdown = breakdown; }
}
