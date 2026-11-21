package com.propval.market.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_price_history")
public class PropertyPriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "year_quarter", nullable = false, unique = true, length = 20)
    private String yearQuarter;

    @Column(name = "gurugram_rate", nullable = false, precision = 12, scale = 2)
    private BigDecimal gurugramRate;

    @Column(name = "noida_rate", nullable = false, precision = 12, scale = 2)
    private BigDecimal noidaRate;

    @Column(name = "ghaziabad_rate", nullable = false, precision = 12, scale = 2)
    private BigDecimal ghaziabadRate;

    @Column(name = "delhi_ncr_rate", nullable = false, precision = 12, scale = 2)
    private BigDecimal delhiNcrRate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public PropertyPriceHistory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getYearQuarter() { return yearQuarter; }
    public void setYearQuarter(String yearQuarter) { this.yearQuarter = yearQuarter; }

    public BigDecimal getGurugramRate() { return gurugramRate; }
    public void setGurugramRate(BigDecimal gurugramRate) { this.gurugramRate = gurugramRate; }

    public BigDecimal getNoidaRate() { return noidaRate; }
    public void setNoidaRate(BigDecimal noidaRate) { this.noidaRate = noidaRate; }

    public BigDecimal getGhaziabadRate() { return ghaziabadRate; }
    public void setGhaziabadRate(BigDecimal ghaziabadRate) { this.ghaziabadRate = ghaziabadRate; }

    public BigDecimal getDelhiNcrRate() { return delhiNcrRate; }
    public void setDelhiNcrRate(BigDecimal delhiNcrRate) { this.delhiNcrRate = delhiNcrRate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
