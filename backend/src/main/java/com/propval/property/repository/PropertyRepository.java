package com.propval.property.repository;

import com.propval.property.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, String>, JpaSpecificationExecutor<Property> {

    @Query("SELECT DISTINCT p.city FROM Property p WHERE p.city IS NOT NULL ORDER BY p.city ASC")
    List<String> findDistinctCities();

    @Query("SELECT DISTINCT p.locality FROM Property p WHERE p.locality IS NOT NULL ORDER BY p.locality ASC")
    List<String> findDistinctLocalities();

    @Query("SELECT DISTINCT p.propertyType FROM Property p WHERE p.propertyType IS NOT NULL ORDER BY p.propertyType ASC")
    List<String> findDistinctPropertyTypes();
}
