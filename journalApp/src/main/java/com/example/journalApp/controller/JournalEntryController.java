package com.example.journalApp.controller;

import com.example.journalApp.entity.JournalEntry;
import com.example.journalApp.service.JournalEntryService;
import com.example.journalApp.util.JwtTokenProvider;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/journals")
@CrossOrigin(origins = "*")
public class JournalEntryController {

    private static final Logger logger = LoggerFactory.getLogger(JournalEntryController.class);

    @Autowired
    private JournalEntryService journalEntryService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String extractUserIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                return jwtTokenProvider.getUserIdFromToken(token);
            } catch (Exception e) {
                logger.error("Error extracting userId from token", e);
            }
        }
        return null;
    }

        @GetMapping
        public ResponseEntity<?> getAllEntries(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "q", required = false) String q
        ) {
        try {
            String userId = extractUserIdFromToken(token);
            if (userId == null) {
                logger.warn("Unauthorized: No valid token provided");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized: No valid token provided"));
            }
            
            logger.info("Fetching entries for userId: {}", userId);

            org.springframework.data.domain.Page<com.example.journalApp.entity.JournalEntry> pageResult;
            if (q != null && !q.isBlank()) {
                pageResult = journalEntryService.searchByUserId(userId, q, page, size);
            } else {
                pageResult = journalEntryService.getAllByUserId(userId, page, size);
            }

            List<com.example.journalApp.dto.JournalEntryDTO> dtoList = pageResult.getContent().stream().map(e -> {
                com.example.journalApp.dto.JournalEntryDTO d = new com.example.journalApp.dto.JournalEntryDTO();
                d.setId(e.getId() != null ? e.getId().toString() : null);
                d.setTitle(e.getTitle());
                d.setContent(e.getContent());
                d.setUserId(e.getUserId());
                d.setCreatedAt(e.getCreatedAt());
                d.setUpdatedAt(e.getUpdatedAt());
                return d;
            }).toList();

            Map<String, Object> meta = new HashMap<>();
            meta.put("page", pageResult.getNumber());
            meta.put("size", pageResult.getSize());
            meta.put("totalElements", pageResult.getTotalElements());
            meta.put("totalPages", pageResult.getTotalPages());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("data", dtoList);
            response.put("meta", meta);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching entries", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> createEntry(@jakarta.validation.Valid @RequestBody com.example.journalApp.dto.JournalEntryDTO myJournalDto, 
                                          @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String userId = extractUserIdFromToken(token);
            if (userId == null) {
                logger.warn("Unauthorized: No valid token provided for entry creation");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized: No valid token provided"));
            }
            logger.info("Creating entry for userId: {}", userId);
            JournalEntry myJournal = new JournalEntry(myJournalDto.getTitle(), myJournalDto.getContent(), userId);
            myJournal.setDate(LocalDateTime.now());
            myJournal.setCreatedAt(LocalDateTime.now());
            journalEntryService.saveEntry(myJournal);

            com.example.journalApp.dto.JournalEntryDTO d = new com.example.journalApp.dto.JournalEntryDTO();
            d.setId(myJournal.getId() != null ? myJournal.getId().toString() : null);
            d.setTitle(myJournal.getTitle());
            d.setContent(myJournal.getContent());
            d.setUserId(myJournal.getUserId());
            d.setCreatedAt(myJournal.getCreatedAt());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("data", d);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            logger.error("Error creating entry", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJournalEntryById(@PathVariable ObjectId id, 
                                                  @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String userId = extractUserIdFromToken(token);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized: No valid token provided"));
            }
            
            Optional<JournalEntry> entry = journalEntryService.findById(id);
            if (entry.isPresent()) {
                // Verify the entry belongs to the authenticated user
                if (!entry.get().getUserId().equals(userId)) {
                    logger.warn("User {} attempted to access entry {} owned by {}", 
                        userId, id, entry.get().getUserId());
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied: Entry belongs to another user"));
                }
                
                com.example.journalApp.dto.JournalEntryDTO d = new com.example.journalApp.dto.JournalEntryDTO();
                d.setId(entry.get().getId() != null ? entry.get().getId().toString() : null);
                d.setTitle(entry.get().getTitle());
                d.setContent(entry.get().getContent());
                d.setUserId(entry.get().getUserId());
                d.setCreatedAt(entry.get().getCreatedAt());

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", d);
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Entry not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            logger.error("Error fetching entry", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJournalEntryById(@PathVariable ObjectId id, 
                                                     @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String userId = extractUserIdFromToken(token);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized: No valid token provided"));
            }
            
            Optional<JournalEntry> entry = journalEntryService.findById(id);
            if (!entry.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Entry not found"));
            }
            
            // Verify the entry belongs to the authenticated user
            if (!entry.get().getUserId().equals(userId)) {
                logger.warn("User {} attempted to delete entry {} owned by {}", 
                    userId, id, entry.get().getUserId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Entry belongs to another user"));
            }
            
            logger.info("Deleting entry {} for userId: {}", id, userId);
            journalEntryService.deleteById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Entry deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting entry", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJournalEntryById(@PathVariable ObjectId id, @jakarta.validation.Valid @RequestBody com.example.journalApp.dto.JournalEntryDTO newJournal, @RequestHeader("Authorization") String token) {
        try {
            Optional<JournalEntry> optionalEntry = journalEntryService.findById(id);
            if (!optionalEntry.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Entry not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            JournalEntry old = optionalEntry.get();

            if (newJournal.getTitle() != null && !newJournal.getTitle().isEmpty()) {
                old.setTitle(newJournal.getTitle());
            }
            if (newJournal.getContent() != null && !newJournal.getContent().isEmpty()) {
                old.setContent(newJournal.getContent());
            }

            journalEntryService.saveEntry(old);

            com.example.journalApp.dto.JournalEntryDTO d = new com.example.journalApp.dto.JournalEntryDTO();
            d.setId(old.getId() != null ? old.getId().toString() : null);
            d.setTitle(old.getTitle());
            d.setContent(old.getContent());
            d.setUserId(old.getUserId());
            d.setUpdatedAt(old.getUpdatedAt());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", d);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
