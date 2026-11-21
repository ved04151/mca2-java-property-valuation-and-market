package com.propval.report.controller;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.propval.market.service.MarketAnalysisService;
import com.propval.valuation.dto.ValuationDto;
import com.propval.valuation.service.ValuationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ValuationService valuationService;
    private final MarketAnalysisService marketAnalysisService;

    public ReportController(ValuationService valuationService, MarketAnalysisService marketAnalysisService) {
        this.valuationService = valuationService;
        this.marketAnalysisService = marketAnalysisService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getReportsSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("valuations", valuationService.getValuations("", "ALL", 1, 20).getContent());
        summary.put("marketOverview", marketAnalysisService.getMarketOverview());
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateReport(@RequestBody Map<String, Object> criteria) {
        Map<String, Object> result = new HashMap<>();
        result.put("reportId", "rep_" + System.currentTimeMillis());
        result.put("generatedAt", java.time.LocalDateTime.now());
        result.put("status", "SUCCESS");
        result.put("criteria", criteria);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/market-analysis")
    public ResponseEntity<Map<String, Object>> getMarketAnalysisReport() {
        return ResponseEntity.ok(marketAnalysisService.getMarketOverview());
    }

    @GetMapping(value = "/valuations/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadValuationPdf(@PathVariable String id) {
        ValuationDto val = valuationService.getValuationById(id);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header Banner
            Paragraph title = new Paragraph("PROPVALUATE NCR ENTERPRISE")
                    .setFontSize(18)
                    .setBold()
                    .setFontColor(new DeviceRgb(37, 99, 235));
            document.add(title);

            Paragraph subtitle = new Paragraph("Official Real Estate Valuation & Appraisal Certificate\n" +
                    "Certificate Ref: " + val.getId() + " | Date: " + val.getDate().toLocalDate())
                    .setFontSize(10)
                    .setFontColor(ColorConstants.DARK_GRAY);
            document.add(subtitle);

            document.add(new Paragraph("\n"));

            // Summary Table
            Table table = new Table(UnitValue.createPercentArray(new float[]{40, 60}))
                    .useAllAvailableWidth();

            table.addCell("Property Title:");
            table.addCell(val.getPropertyTitle());
            table.addCell("Sector / Locality:");
            table.addCell(val.getLocality() + ", " + val.getCity());
            table.addCell("Super Area:");
            table.addCell(val.getAreaSqFt() + " sq.ft");
            table.addCell("Assessed Fair Market Value:");
            table.addCell("INR " + val.getEstimatedPrice());
            table.addCell("Effective Rate / Sq.Ft:");
            table.addCell("INR " + val.getAdjustedRateSqFt());
            table.addCell("Confidence Score:");
            table.addCell(val.getConfidenceScore() + "% (High Reliability)");
            table.addCell("Appraising Surveyor:");
            table.addCell(val.getAssessorName());
            table.addCell("Client / Underwriter:");
            table.addCell(val.getClientName());

            document.add(table);

            document.add(new Paragraph("\nSurveyor Notes: " + (val.getNotes() != null ? val.getNotes() : "Standard inspection."))
                    .setFontSize(9)
                    .setFontColor(ColorConstants.GRAY));

            document.close();

            byte[] pdfBytes = baos.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Valuation-Report-" + id + ".pdf");

            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}
