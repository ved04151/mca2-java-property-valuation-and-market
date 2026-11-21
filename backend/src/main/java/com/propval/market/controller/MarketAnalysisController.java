package com.propval.market.controller;

import com.propval.market.entity.LocalityBenchmark;
import com.propval.market.entity.PropertyPriceHistory;
import com.propval.market.service.MarketAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market-analysis")
public class MarketAnalysisController {

    private final MarketAnalysisService marketAnalysisService;

    public MarketAnalysisController(MarketAnalysisService marketAnalysisService) {
        this.marketAnalysisService = marketAnalysisService;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        return ResponseEntity.ok(marketAnalysisService.getMarketOverview());
    }

    @GetMapping("/benchmarks")
    public ResponseEntity<List<LocalityBenchmark>> getBenchmarks(
            @RequestParam(required = false, defaultValue = "ALL") String city) {
        return ResponseEntity.ok(marketAnalysisService.getBenchmarks(city));
    }

    @GetMapping("/trends")
    public ResponseEntity<List<PropertyPriceHistory>> getPriceTrends() {
        return ResponseEntity.ok(marketAnalysisService.getPriceTrends());
    }

    @GetMapping("/localities/compare")
    public ResponseEntity<List<Map<String, Object>>> compareLocalities(
            @RequestParam(required = false) List<String> localities) {
        return ResponseEntity.ok(marketAnalysisService.compareLocalities(localities));
    }

    @GetMapping("/property-types")
    public ResponseEntity<Map<String, Object>> getPropertyTypes() {
        return ResponseEntity.ok(marketAnalysisService.getPropertyTypesDistribution());
    }
}
