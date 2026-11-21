package com.propval.valuation.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "valuation_breakdowns")
public class ValuationBreakdown {

    @Id
    @Column(name = "valuation_id", length = 64)
    private String valuationId;

    @Column(name = "base_rate_per_sq_ft", nullable = false, precision = 12, scale = 2)
    private BigDecimal baseRatePerSqFt;

    @Column(name = "base_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal baseValue;

    @Column(name = "condition_adjustment", nullable = false, precision = 15, scale = 2)
    private BigDecimal conditionAdjustment = BigDecimal.ZERO;

    @Column(name = "amenities_adjustment", nullable = false, precision = 15, scale = 2)
    private BigDecimal amenitiesAdjustment = BigDecimal.ZERO;

    @Column(name = "depreciation_deduction", nullable = false, precision = 15, scale = 2)
    private BigDecimal depreciationDeduction = BigDecimal.ZERO;

    @Column(name = "floor_adjustment", nullable = false, precision = 15, scale = 2)
    private BigDecimal floorAdjustment = BigDecimal.ZERO;

    public ValuationBreakdown() {}

    public String getValuationId() { return valuationId; }
    public void setValuationId(String valuationId) { this.valuationId = valuationId; }

    public BigDecimal getBaseRatePerSqFt() { return baseRatePerSqFt; }
    public void setBaseRatePerSqFt(BigDecimal baseRatePerSqFt) { this.baseRatePerSqFt = baseRatePerSqFt; }

    public BigDecimal getBaseValue() { return baseValue; }
    public void setBaseValue(BigDecimal baseValue) { this.baseValue = baseValue; }

    public BigDecimal getConditionAdjustment() { return conditionAdjustment; }
    public void setConditionAdjustment(BigDecimal conditionAdjustment) { this.conditionAdjustment = conditionAdjustment; }

    public BigDecimal getAmenitiesAdjustment() { return amenitiesAdjustment; }
    public void setAmenitiesAdjustment(BigDecimal amenitiesAdjustment) { this.amenitiesAdjustment = amenitiesAdjustment; }

    public BigDecimal getDepreciationDeduction() { return depreciationDeduction; }
    public void setDepreciationDeduction(BigDecimal depreciationDeduction) { this.depreciationDeduction = depreciationDeduction; }

    public BigDecimal getFloorAdjustment() { return floorAdjustment; }
    public void setFloorAdjustment(BigDecimal floorAdjustment) { this.floorAdjustment = floorAdjustment; }
}
