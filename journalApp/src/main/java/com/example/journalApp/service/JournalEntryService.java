package com.example.journalApp.service;

import com.example.journalApp.entity.JournalEntry;
import com.example.journalApp.repository.JournalEntryRepository;
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

    public Optional<JournalEntry> findById(ObjectId id)
    {
        return journalEntryRepository.findById(id);
    }

    public void deleteById(ObjectId id)
    {
        journalEntryRepository.deleteById(id);
    }


    

}
