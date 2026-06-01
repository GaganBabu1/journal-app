package com.example.journalApp.service;

import com.example.journalApp.entity.JournalEntry;
import com.example.journalApp.repository.JournalEntryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;


@Component
public class JournalEntryService {

    private static final Logger logger = LoggerFactory.getLogger(JournalEntryService.class);

    @Autowired
    private JournalEntryRepository journalEntryRepository;


    public void saveEntry(JournalEntry journalEntry)
    {
        logger.info("Saving entry for userId: {}", journalEntry.getUserId());
        journalEntryRepository.save(journalEntry);
    }

    public List<JournalEntry> getAll()
    {
        logger.info("Fetching all entries");
        return journalEntryRepository.findAll();
    }
    
    public List<JournalEntry> getAllByUserId(String userId)
    {
        logger.info("Fetching all entries for userId: {}", userId);
        return journalEntryRepository.findByUserId(userId);
    }

    public Page<JournalEntry> getAllByUserId(String userId, int page, int size) {
        logger.info("Fetching paged entries for userId: {} page:{} size:{}", userId, page, size);
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        return journalEntryRepository.findByUserId(userId, pageable);
    }

    public Page<JournalEntry> searchByUserId(String userId, String q, int page, int size) {
        logger.info("Searching entries for userId: {} query:{} page:{} size:{}", userId, q, page, size);
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        return journalEntryRepository.findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndContentContainingIgnoreCase(
                userId, q, userId, q, pageable);
    }

    public Optional<JournalEntry> findById(ObjectId id)
    {
        return journalEntryRepository.findById(id);
    }

    public void deleteById(ObjectId id)
    {
        journalEntryRepository.deleteById(id);
    }


    

}
