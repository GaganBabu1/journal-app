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
    public ResponseEntity<?> getAllEntries(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String userId = extractUserIdFromToken(token);
            if (userId == null) {
                logger.warn("Unauthorized: No valid token provided");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized: No valid token provided"));
            }
            
            logger.info("Fetching entries for userId: {}", userId);
            List<JournalEntry> entries = journalEntryService.getAllByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("data", entries);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching entries", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> createEntry(@RequestBody JournalEntry myJournal, 
                                          @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String userId = extractUserIdFromToken(token);
            if (userId == null) {
                logger.warn("Unauthorized: No valid token provided for entry creation");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized: No valid token provided"));
            }
            
            if (myJournal.getTitle() == null || myJournal.getContent() == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Title and content are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            logger.info("Creating entry for userId: {}", userId);
            myJournal.setUserId(userId);
            myJournal.setDate(LocalDateTime.now());
            myJournal.setCreatedAt(LocalDateTime.now());
            myJournal.setUpdatedAt(LocalDateTime.now());
            journalEntryService.saveEntry(myJournal);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("data", myJournal);
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
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", entry.get());
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
    public ResponseEntity<?> updateJournalEntryById(@PathVariable ObjectId id, @RequestBody JournalEntry newJournal, @RequestHeader("Authorization") String token) {
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

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", old);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
