package com.propval.market.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "locality_benchmarks")
public class LocalityBenchmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "locality", nullable = false, length = 150)
    private String locality;

    @Column(name = "average_rate_sq_ft", nullable = false, precision = 12, scale = 2)
    private BigDecimal averageRateSqFt;

    @Column(name = "yoy_growth_pct", nullable = false, precision = 6, scale = 2)
    private BigDecimal yoyGrowthPct;

    @Column(name = "quarterly_growth_pct", nullable = false, precision = 6, scale = 2)
    private BigDecimal quarterlyGrowthPct;

    @Column(name = "rental_yield_pct", nullable = false, precision = 6, scale = 2)
    private BigDecimal rentalYieldPct;

    @Column(name = "inventory_months", nullable = false, precision = 6, scale = 2)
    private BigDecimal inventoryMonths;

    @Column(name = "demand_index", nullable = false)
    private Integer demandIndex = 80;

    @Column(name = "trend_direction", nullable = false, length = 20)
    private String trendDirection = "up";

    @Column(name = "top_driver", columnDefinition = "TEXT")
    private String topDriver;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public LocalityBenchmark() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public BigDecimal getAverageRateSqFt() { return averageRateSqFt; }
    public void setAverageRateSqFt(BigDecimal averageRateSqFt) { this.averageRateSqFt = averageRateSqFt; }

    public BigDecimal getYoyGrowthPct() { return yoyGrowthPct; }
    public void setYoyGrowthPct(BigDecimal yoyGrowthPct) { this.yoyGrowthPct = yoyGrowthPct; }

    public BigDecimal getQuarterlyGrowthPct() { return quarterlyGrowthPct; }
    public void setQuarterlyGrowthPct(BigDecimal quarterlyGrowthPct) { this.quarterlyGrowthPct = quarterlyGrowthPct; }

    public BigDecimal getRentalYieldPct() { return rentalYieldPct; }
    public void setRentalYieldPct(BigDecimal rentalYieldPct) { this.rentalYieldPct = rentalYieldPct; }

    public BigDecimal getInventoryMonths() { return inventoryMonths; }
    public void setInventoryMonths(BigDecimal inventoryMonths) { this.inventoryMonths = inventoryMonths; }

    public Integer getDemandIndex() { return demandIndex; }
    public void setDemandIndex(Integer demandIndex) { this.demandIndex = demandIndex; }

    public String getTrendDirection() { return trendDirection; }
    public void setTrendDirection(String trendDirection) { this.trendDirection = trendDirection; }

    public String getTopDriver() { return topDriver; }
    public void setTopDriver(String topDriver) { this.topDriver = topDriver; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
