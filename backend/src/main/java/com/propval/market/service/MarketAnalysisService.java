package com.propval.market.service;

import com.propval.market.entity.LocalityBenchmark;
import com.propval.market.entity.PropertyPriceHistory;
import com.propval.market.repository.LocalityBenchmarkRepository;
import com.propval.market.repository.PropertyPriceHistoryRepository;
import com.propval.property.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class MarketAnalysisService {

    private final LocalityBenchmarkRepository benchmarkRepository;
    private final PropertyPriceHistoryRepository priceHistoryRepository;
    private final PropertyRepository propertyRepository;

    public MarketAnalysisService(LocalityBenchmarkRepository benchmarkRepository,
                                 PropertyPriceHistoryRepository priceHistoryRepository,
                                 PropertyRepository propertyRepository) {
        this.benchmarkRepository = benchmarkRepository;
        this.priceHistoryRepository = priceHistoryRepository;
        this.propertyRepository = propertyRepository;
    }

    public List<LocalityBenchmark> getBenchmarks(String city) {
        if (city != null && !city.trim().isEmpty() && !"ALL".equalsIgnoreCase(city)) {
            return benchmarkRepository.findByCityIgnoreCase(city.trim());
        }
        return benchmarkRepository.findAll();
    }

    public List<PropertyPriceHistory> getPriceTrends() {
        return priceHistoryRepository.findAllByOrderByYearQuarterAsc();
    }

    public Map<String, Object> getMarketOverview() {
        List<LocalityBenchmark> benchmarks = benchmarkRepository.findAll();

        BigDecimal totalRate = BigDecimal.ZERO;
        BigDecimal totalGrowth = BigDecimal.ZERO;
        BigDecimal totalYield = BigDecimal.ZERO;

        for (LocalityBenchmark b : benchmarks) {
            totalRate = totalRate.add(b.getAverageRateSqFt());
            totalGrowth = totalGrowth.add(b.getYoyGrowthPct());
            totalYield = totalYield.add(b.getRentalYieldPct());
        }

        BigDecimal count = benchmarks.isEmpty() ? BigDecimal.ONE : BigDecimal.valueOf(benchmarks.size());
        BigDecimal avgRate = totalRate.divide(count, 0, RoundingMode.HALF_UP);
        BigDecimal avgGrowth = totalGrowth.divide(count, 2, RoundingMode.HALF_UP);
        BigDecimal avgYield = totalYield.divide(count, 2, RoundingMode.HALF_UP);

        Map<String, Object> overview = new HashMap<>();
        overview.put("totalTrackedLocalities", benchmarks.size());
        overview.put("ncrAverageRateSqFt", avgRate);
        overview.put("ncrAverageYoYGrowth", avgGrowth);
        overview.put("ncrAverageRentalYield", avgYield);
        overview.put("benchmarks", benchmarks);
        overview.put("priceTrends", priceHistoryRepository.findAllByOrderByYearQuarterAsc());

        return overview;
    }

    public List<Map<String, Object>> compareLocalities(List<String> localities) {
        List<Map<String, Object>> results = new ArrayList<>();
        List<LocalityBenchmark> all = benchmarkRepository.findAll();

        for (LocalityBenchmark b : all) {
            if (localities == null || localities.isEmpty() || localities.contains(b.getLocality())) {
                Map<String, Object> item = new HashMap<>();
                item.put("locality", b.getLocality());
                item.put("city", b.getCity());
                item.put("rate", b.getAverageRateSqFt());
                item.put("yoyGrowth", b.getYoyGrowthPct());
                item.put("quarterlyGrowth", b.getQuarterlyGrowthPct());
                item.put("rentalYield", b.getRentalYieldPct());
                item.put("inventoryMonths", b.getInventoryMonths());
                item.put("demandIndex", b.getDemandIndex());
                results.add(item);
            }
        }
        return results;
    }

    public Map<String, Object> getPropertyTypesDistribution() {
        List<String> types = propertyRepository.findDistinctPropertyTypes();
        Map<String, Object> distribution = new HashMap<>();
        distribution.put("types", types);
        return distribution;
    }
}
