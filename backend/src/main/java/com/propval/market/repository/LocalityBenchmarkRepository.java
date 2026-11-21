package com.propval.market.repository;

import com.propval.market.entity.LocalityBenchmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocalityBenchmarkRepository extends JpaRepository<LocalityBenchmark, Long> {
    Optional<LocalityBenchmark> findByLocalityIgnoreCaseAndCityIgnoreCase(String locality, String city);
    List<LocalityBenchmark> findByCityIgnoreCase(String city);
}
