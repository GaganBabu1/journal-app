package com.example.journalApp.repository;

import com.example.journalApp.entity.JournalEntry;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JournalEntryRepository extends MongoRepository<JournalEntry, ObjectId> {

    List<JournalEntry> findByUserId(String userId);

    Page<JournalEntry> findByUserId(String userId, Pageable pageable);

    Page<JournalEntry> findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndContentContainingIgnoreCase(
            String userId1, String title, String userId2, String content, Pageable pageable);

}
