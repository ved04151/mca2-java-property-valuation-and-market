package com.propval.valuation.repository;

import com.propval.valuation.entity.Valuation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ValuationRepository extends JpaRepository<Valuation, String>, JpaSpecificationExecutor<Valuation> {
}
