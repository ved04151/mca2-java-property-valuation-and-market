package com.propval.valuation.dto;

import java.math.BigDecimal;

public class ValuationBreakdownDto {
    private BigDecimal baseRatePerSqFt;
    private BigDecimal baseValue;
    private BigDecimal conditionAdjustment;
    private BigDecimal amenitiesAdjustment;
    private BigDecimal depreciationDeduction;
    private BigDecimal floorAdjustment;

    public ValuationBreakdownDto() {}

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
