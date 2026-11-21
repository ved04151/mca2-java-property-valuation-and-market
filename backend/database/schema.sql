-- =========================================================================
-- PROPVALUATE NCR - ENTERPRISE REAL ESTATE VALUATION & MARKET ANALYSIS
-- MySQL 8.0 Normalized Relational Database Schema
-- Compatible with Spring Boot 3.x, Hibernate / JPA & Spring Security
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `propval_db` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `propval_db`;

-- -------------------------------------------------------------------------
-- 1. Table: users
-- Core personnel, assessors, appraisers, and administrative users
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
  `avatar` VARCHAR(500) NULL,
  `title` VARCHAR(150) NULL,
  `location` VARCHAR(150) NULL,
  `phone` VARCHAR(50) NULL,
  `status` ENUM('ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `valuations_conducted` INT UNSIGNED NOT NULL DEFAULT 0,
  `last_login` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 2. Table: properties
-- Complete real estate inventory records across NCR
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `properties` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `property_type` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `locality` VARCHAR(150) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `pincode` VARCHAR(10) NOT NULL,
  `bhk` INT UNSIGNED NOT NULL DEFAULT 0,
  `bathrooms` INT UNSIGNED NOT NULL DEFAULT 1,
  `area_sq_ft` DECIMAL(12,2) NOT NULL,
  `price` DECIMAL(15,2) NOT NULL,
  `price_per_sq_ft` DECIMAL(12,2) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Ready to Move',
  `furnishing` VARCHAR(50) NOT NULL DEFAULT 'Semi-Furnished',
  `floor` VARCHAR(50) NULL,
  `age_of_property_years` INT UNSIGNED NOT NULL DEFAULT 0,
  `facing` VARCHAR(50) NULL,
  `parking` VARCHAR(100) NULL,
  `description` TEXT NULL,
  `verified` BOOLEAN NOT NULL DEFAULT TRUE,
  `added_by` VARCHAR(64) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_prop_city` (`city`),
  KEY `idx_prop_locality` (`locality`),
  KEY `idx_prop_type` (`property_type`),
  KEY `idx_prop_price` (`price`),
  KEY `idx_prop_created` (`created_at`),
  CONSTRAINT `fk_properties_added_by` FOREIGN KEY (`added_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 3. Table: property_images
-- Multiple photo gallery URLs or base64 storage per property
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `property_images` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `property_id` VARCHAR(64) NOT NULL,
  `image_url` LONGTEXT NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_prop_img_prop_id` (`property_id`),
  CONSTRAINT `fk_prop_images_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 4. Table: property_amenities
-- Amenity flags and features linked to properties
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `property_amenities` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `property_id` VARCHAR(64) NOT NULL,
  `amenity` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_prop_amenity_prop_id` (`property_id`),
  CONSTRAINT `fk_prop_amenities_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 5. Table: locality_benchmarks
-- Sector & corridor intelligence, average capital rates, yields, demand index
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `locality_benchmarks` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `locality` VARCHAR(150) NOT NULL,
  `average_rate_sq_ft` DECIMAL(12,2) NOT NULL,
  `yoy_growth_pct` DECIMAL(6,2) NOT NULL,
  `quarterly_growth_pct` DECIMAL(6,2) NOT NULL,
  `rental_yield_pct` DECIMAL(6,2) NOT NULL,
  `inventory_months` DECIMAL(6,2) NOT NULL,
  `demand_index` INT UNSIGNED NOT NULL DEFAULT 80,
  `trend_direction` VARCHAR(20) NOT NULL DEFAULT 'up',
  `top_driver` TEXT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_benchmark_city_locality` (`city`, `locality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 6. Table: property_price_history
-- Multi-quarter macro trends across cities
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `property_price_history` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `year_quarter` VARCHAR(20) NOT NULL,
  `gurugram_rate` DECIMAL(12,2) NOT NULL,
  `noida_rate` DECIMAL(12,2) NOT NULL,
  `ghaziabad_rate` DECIMAL(12,2) NOT NULL,
  `delhi_ncr_rate` DECIMAL(12,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_price_history_quarter` (`year_quarter`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 7. Table: valuations
-- Historical appraisals, calculated fair values, confidence brackets
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `valuations` (
  `id` VARCHAR(64) NOT NULL,
  `property_id` VARCHAR(64) NULL,
  `property_title` VARCHAR(255) NOT NULL,
  `client_name` VARCHAR(150) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `locality` VARCHAR(150) NOT NULL,
  `property_type` VARCHAR(100) NOT NULL,
  `area_sq_ft` DECIMAL(12,2) NOT NULL,
  `bhk` INT UNSIGNED NOT NULL DEFAULT 0,
  `age_years` INT UNSIGNED NOT NULL DEFAULT 0,
  `condition_type` VARCHAR(50) NOT NULL DEFAULT 'Good',
  `amenities_score` INT UNSIGNED NOT NULL DEFAULT 5,
  `base_rate_sq_ft` DECIMAL(12,2) NOT NULL,
  `adjusted_rate_sq_ft` DECIMAL(12,2) NOT NULL,
  `estimated_price` DECIMAL(15,2) NOT NULL,
  `price_range_low` DECIMAL(15,2) NOT NULL,
  `price_range_high` DECIMAL(15,2) NOT NULL,
  `confidence_score` INT UNSIGNED NOT NULL DEFAULT 85,
  `assessor_id` VARCHAR(64) NULL,
  `assessor_name` VARCHAR(150) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
  `notes` TEXT NULL,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_val_city` (`city`),
  KEY `idx_val_locality` (`locality`),
  KEY `idx_val_date` (`date`),
  CONSTRAINT `fk_valuations_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_valuations_assessor` FOREIGN KEY (`assessor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 8. Table: valuation_breakdowns
-- Financial line items calculated by the valuation model
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `valuation_breakdowns` (
  `valuation_id` VARCHAR(64) NOT NULL,
  `base_rate_per_sq_ft` DECIMAL(12,2) NOT NULL,
  `base_value` DECIMAL(15,2) NOT NULL,
  `condition_adjustment` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `amenities_adjustment` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `depreciation_deduction` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `floor_adjustment` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`valuation_id`),
  CONSTRAINT `fk_val_breakdown_val` FOREIGN KEY (`valuation_id`) REFERENCES `valuations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
