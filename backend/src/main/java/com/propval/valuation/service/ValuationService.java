package com.propval.valuation.service;

import com.propval.common.ResourceNotFoundException;
import com.propval.market.entity.LocalityBenchmark;
import com.propval.market.repository.LocalityBenchmarkRepository;
import com.propval.property.dto.PageResponse;
import com.propval.user.entity.User;
import com.propval.user.repository.UserRepository;
import com.propval.valuation.dto.SaveValuationRequest;
import com.propval.valuation.dto.ValuationBreakdownDto;
import com.propval.valuation.dto.ValuationCalculationRequest;
import com.propval.valuation.dto.ValuationDto;
import com.propval.valuation.entity.Valuation;
import com.propval.valuation.entity.ValuationBreakdown;
import com.propval.valuation.repository.ValuationRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ValuationService {

    private final ValuationRepository valuationRepository;
    private final LocalityBenchmarkRepository benchmarkRepository;
    private final UserRepository userRepository;

    public ValuationService(ValuationRepository valuationRepository,
                            LocalityBenchmarkRepository benchmarkRepository,
                            UserRepository userRepository) {
        this.valuationRepository = valuationRepository;
        this.benchmarkRepository = benchmarkRepository;
        this.userRepository = userRepository;
    }

    /**
     * EXACT PORT of frontend valuationService.js calculateValuation algorithm.
     * Preserves identical factors, adjustments, confidence scores and breakdown.
     */
    public ValuationDto calculateValuation(ValuationCalculationRequest params) {
        String city = params.getCity() != null ? params.getCity() : "Noida";
        String locality = params.getLocality() != null ? params.getLocality() : "Sector 78";
        String propertyType = params.getPropertyType() != null ? params.getPropertyType() : "Apartment";
        BigDecimal areaSqFt = params.getAreaSqFt() != null ? params.getAreaSqFt() : BigDecimal.valueOf(1200);
        int bhk = params.getBhk() != null ? params.getBhk() : 3;
        int ageYears = params.getAgeYears() != null ? params.getAgeYears() : 3;
        String condition = params.getCondition() != null ? params.getCondition() : "Good";
        int amenitiesCount = params.getAmenitiesCount() != null ? params.getAmenitiesCount() : 4;
        int floorLevel = params.getFloorLevel() != null ? params.getFloorLevel() : 5;

        // 1. Locate base rate from benchmarks or fallback default
        LocalityBenchmark benchmark = benchmarkRepository.findByLocalityIgnoreCaseAndCityIgnoreCase(locality, city)
                .orElseGet(() -> {
                    LocalityBenchmark b = new LocalityBenchmark();
                    b.setCity(city);
                    b.setLocality(locality);
                    b.setAverageRateSqFt(BigDecimal.valueOf(12000));
                    b.setDemandIndex(80);
                    b.setYoyGrowthPct(BigDecimal.valueOf(10.0));
                    b.setRentalYieldPct(BigDecimal.valueOf(4.0));
                    b.setTopDriver("Established residential sector with reliable public transport connectivity.");
                    return b;
                });

        double baseRate = benchmark.getAverageRateSqFt().doubleValue();

        // 2. Adjust for property type
        double typeMultiplier = 1.0;
        if ("Penthouse".equalsIgnoreCase(propertyType)) {
            typeMultiplier = 1.25;
        } else if ("Independent House / Villa".equalsIgnoreCase(propertyType) || "Villa".equalsIgnoreCase(propertyType)) {
            typeMultiplier = 1.35;
        } else if ("Commercial Office".equalsIgnoreCase(propertyType) || "Commercial".equalsIgnoreCase(propertyType)) {
            typeMultiplier = 1.40;
        } else if ("Plot / Land".equalsIgnoreCase(propertyType) || "Land".equalsIgnoreCase(propertyType)) {
            typeMultiplier = 0.90;
        }
        baseRate = baseRate * typeMultiplier;

        // 3. Condition factor (-10% to +12%)
        double conditionMultiplier = 0.0;
        if ("Poor".equalsIgnoreCase(condition)) conditionMultiplier = -0.10;
        else if ("Good".equalsIgnoreCase(condition)) conditionMultiplier = 0.06;
        else if ("Excellent".equalsIgnoreCase(condition)) conditionMultiplier = 0.12;

        double conditionAdjRate = baseRate * conditionMultiplier;

        // 4. Age depreciation (0.8% per year beyond 2 years, capped at -25%)
        double depreciationRate = ageYears > 2 ? Math.min(0.25, (ageYears - 2) * 0.008) : 0;
        double depreciationDeduction = -(baseRate * depreciationRate);

        // 5. Amenities premium
        double amenitiesRate = Math.min(0.10, amenitiesCount * 0.015) * baseRate;

        // 6. Floor adjustment
        double floorAdj = 0;
        if (floorLevel > 15) floorAdj = baseRate * 0.03;
        else if (floorLevel == 1) floorAdj = -baseRate * 0.02;

        double adjustedRateSqFt = Math.round(baseRate + conditionAdjRate + depreciationDeduction + amenitiesRate + floorAdj);
        double area = areaSqFt.doubleValue();
        double estimatedPrice = Math.round(adjustedRateSqFt * area);

        // Price brackets (-5% to +5%)
        double priceRangeLow = Math.round(estimatedPrice * 0.95);
        double priceRangeHigh = Math.round(estimatedPrice * 1.05);

        // Confidence score based on demand index and age
        int demandIndex = benchmark.getDemandIndex() != null ? benchmark.getDemandIndex() : 80;
        int confidenceScore = (int) Math.min(97, Math.max(75, Math.round(demandIndex * 0.9 + (15 - Math.min(10, ageYears)))));

        ValuationBreakdownDto breakdownDto = new ValuationBreakdownDto();
        breakdownDto.setBaseRatePerSqFt(BigDecimal.valueOf(Math.round(baseRate)));
        breakdownDto.setBaseValue(BigDecimal.valueOf(Math.round(baseRate * area)));
        breakdownDto.setConditionAdjustment(BigDecimal.valueOf(Math.round(conditionAdjRate * area)));
        breakdownDto.setAmenitiesAdjustment(BigDecimal.valueOf(Math.round(amenitiesRate * area)));
        breakdownDto.setDepreciationDeduction(BigDecimal.valueOf(Math.round(depreciationDeduction * area)));
        breakdownDto.setFloorAdjustment(BigDecimal.valueOf(Math.round(floorAdj * area)));

        ValuationDto dto = new ValuationDto();
        dto.setCity(city);
        dto.setLocality(locality);
        dto.setPropertyType(propertyType);
        dto.setAreaSqFt(areaSqFt);
        dto.setBhk(bhk);
        dto.setAgeYears(ageYears);
        dto.setCondition(condition);
        dto.setBaseRateSqFt(BigDecimal.valueOf(Math.round(baseRate)));
        dto.setAdjustedRateSqFt(BigDecimal.valueOf(adjustedRateSqFt));
        dto.setEstimatedPrice(BigDecimal.valueOf(estimatedPrice));
        dto.setPriceRangeLow(BigDecimal.valueOf(priceRangeLow));
        dto.setPriceRangeHigh(BigDecimal.valueOf(priceRangeHigh));
        dto.setConfidenceScore(confidenceScore);
        dto.setBreakdown(breakdownDto);
        dto.setBenchmark(benchmark);

        return dto;
    }

    @Transactional
    public ValuationDto saveValuation(SaveValuationRequest request, String userEmail) {
        User user = null;
        if (userEmail != null) {
            user = userRepository.findByEmailIgnoreCase(userEmail).orElse(null);
        }

        Valuation val = new Valuation();
        val.setId("val_" + System.currentTimeMillis());
        val.setPropertyId(request.getPropertyId());
        val.setPropertyTitle(request.getPropertyTitle() != null ? request.getPropertyTitle() : "Property Valuation");
        val.setClientName(request.getClientName() != null ? request.getClientName() : "Standard Appraisal");
        val.setCity(request.getCity());
        val.setLocality(request.getLocality());
        val.setPropertyType(request.getPropertyType() != null ? request.getPropertyType() : "Apartment");
        val.setAreaSqFt(request.getAreaSqFt());
        val.setBhk(request.getBhk() != null ? request.getBhk() : 0);
        val.setAgeYears(request.getAgeYears() != null ? request.getAgeYears() : 0);
        val.setConditionType(request.getCondition() != null ? request.getCondition() : "Good");
        val.setAmenitiesScore(request.getAmenitiesScore() != null ? request.getAmenitiesScore() : 5);
        val.setBaseRateSqFt(request.getBaseRateSqFt());
        val.setAdjustedRateSqFt(request.getAdjustedRateSqFt());
        val.setEstimatedPrice(request.getEstimatedPrice());
        val.setPriceRangeLow(request.getPriceRangeLow());
        val.setPriceRangeHigh(request.getPriceRangeHigh());
        val.setConfidenceScore(request.getConfidenceScore() != null ? request.getConfidenceScore() : 85);
        val.setStatus("COMPLETED");
        val.setNotes(request.getNotes());
        val.setDate(LocalDateTime.now());

        if (user == null) {
            throw new AccessDeniedException("A valid authenticated user is required to save a valuation.");
        }
        val.setAssessorId(user.getId());
        val.setAssessorName(user.getName());
        user.setValuationsConducted(user.getValuationsConducted() + 1);
        userRepository.save(user);

        if (request.getBreakdown() != null) {
            ValuationBreakdown breakdown = new ValuationBreakdown();
            breakdown.setValuationId(val.getId());
            breakdown.setBaseRatePerSqFt(request.getBreakdown().getBaseRatePerSqFt());
            breakdown.setBaseValue(request.getBreakdown().getBaseValue());
            breakdown.setConditionAdjustment(request.getBreakdown().getConditionAdjustment());
            breakdown.setAmenitiesAdjustment(request.getBreakdown().getAmenitiesAdjustment());
            breakdown.setDepreciationDeduction(request.getBreakdown().getDepreciationDeduction());
            breakdown.setFloorAdjustment(request.getBreakdown().getFloorAdjustment());
            val.setBreakdown(breakdown);
        }

        Valuation saved = valuationRepository.save(val);
        return toDto(saved);
    }

    public PageResponse<ValuationDto> getValuations(String search, String city, int page, int pageSize) {
        int pageIndex = Math.max(0, page - 1);
        Pageable pageable = PageRequest.of(pageIndex, pageSize, Sort.by(Sort.Direction.DESC, "date"));

        Specification<Valuation> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String p = "%" + search.trim().toLowerCase() + "%";
                Predicate propP = cb.like(cb.lower(root.get("propertyTitle")), p);
                Predicate clientP = cb.like(cb.lower(root.get("clientName")), p);
                Predicate locP = cb.like(cb.lower(root.get("locality")), p);
                Predicate cityP = cb.like(cb.lower(root.get("city")), p);
                predicates.add(cb.or(propP, clientP, locP, cityP));
            }

            if (city != null && !city.trim().isEmpty() && !"ALL".equalsIgnoreCase(city)) {
                predicates.add(cb.equal(cb.lower(root.get("city")), city.trim().toLowerCase()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Valuation> valPage = valuationRepository.findAll(spec, pageable);

        List<ValuationDto> content = valPage.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                valPage.getTotalElements(),
                valPage.getTotalPages(),
                page,
                pageSize
        );
    }

    public ValuationDto getValuationById(String id) {
        Valuation valuation = valuationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Valuation not found with id: " + id));
        return toDto(valuation);
    }

    @Transactional
    public void deleteValuation(String id, String currentUserId) {
        Valuation valuation = valuationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Valuation not found with id: " + id));
        if (currentUserId == null || valuation.getAssessorId() == null
                || !valuation.getAssessorId().equals(currentUserId)) {
            throw new AccessDeniedException("You can only delete valuations that you created.");
        }
        valuationRepository.delete(valuation);
    }

    public ValuationDto toDto(Valuation val) {
        ValuationDto dto = new ValuationDto();
        dto.setId(val.getId());
        dto.setPropertyId(val.getPropertyId());
        dto.setPropertyTitle(val.getPropertyTitle());
        dto.setClientName(val.getClientName());
        dto.setCity(val.getCity());
        dto.setLocality(val.getLocality());
        dto.setPropertyType(val.getPropertyType());
        dto.setAreaSqFt(val.getAreaSqFt());
        dto.setBhk(val.getBhk());
        dto.setAgeYears(val.getAgeYears());
        dto.setCondition(val.getConditionType());
        dto.setAmenitiesScore(val.getAmenitiesScore());
        dto.setBaseRateSqFt(val.getBaseRateSqFt());
        dto.setAdjustedRateSqFt(val.getAdjustedRateSqFt());
        dto.setEstimatedPrice(val.getEstimatedPrice());
        dto.setPriceRangeLow(val.getPriceRangeLow());
        dto.setPriceRangeHigh(val.getPriceRangeHigh());
        dto.setConfidenceScore(val.getConfidenceScore());
        dto.setAssessorId(val.getAssessorId());
        dto.setAssessorName(val.getAssessorName());
        dto.setStatus(val.getStatus());
        dto.setNotes(val.getNotes());
        dto.setDate(val.getDate());

        if (val.getBreakdown() != null) {
            ValuationBreakdownDto bDto = new ValuationBreakdownDto();
            bDto.setBaseRatePerSqFt(val.getBreakdown().getBaseRatePerSqFt());
            bDto.setBaseValue(val.getBreakdown().getBaseValue());
            bDto.setConditionAdjustment(val.getBreakdown().getConditionAdjustment());
            bDto.setAmenitiesAdjustment(val.getBreakdown().getAmenitiesAdjustment());
            bDto.setDepreciationDeduction(val.getBreakdown().getDepreciationDeduction());
            bDto.setFloorAdjustment(val.getBreakdown().getFloorAdjustment());
            dto.setBreakdown(bDto);
        }

        benchmarkRepository.findByLocalityIgnoreCaseAndCityIgnoreCase(val.getLocality(), val.getCity())
                .ifPresent(dto::setBenchmark);

        return dto;
    }
}
