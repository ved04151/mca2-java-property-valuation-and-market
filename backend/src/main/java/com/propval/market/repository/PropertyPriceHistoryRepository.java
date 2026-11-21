package com.propval.market.repository;

import com.propval.market.entity.PropertyPriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyPriceHistoryRepository extends JpaRepository<PropertyPriceHistory, Long> {
    List<PropertyPriceHistory> findAllByOrderByYearQuarterAsc();
}
