package com.example.journalApp.controller;

import com.example.journalApp.entity.JournalEntry;
import com.example.journalApp.service.JournalEntryService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/journal")
public class JournalEntryContorllerv2 {

    @Autowired
    private JournalEntryService journalEntryService;



    @GetMapping("/abc")
    public List<JournalEntry> getAll() {

        return journalEntryService.getAll();

    }

    @PostMapping
    public JournalEntry createEntry(@RequestBody JournalEntry myJournal)
    {
        myJournal.setDate(LocalDateTime.now());
        journalEntryService.saveEntry(myJournal);

        return myJournal;

    }

    @GetMapping("id/{myId}")
    public JournalEntry getJournalEntryById(@PathVariable ObjectId myId)
    {
        return journalEntryService.findById(myId).orElse(null);
    }

    @DeleteMapping("id/{myId}")
    public boolean  deleteJournalEntryById(@PathVariable ObjectId myId)
    {
        journalEntryService.deleteById(myId);
        return true;
    }

    @PutMapping ("/id {id}")
    public JournalEntry updateJournalEntryById(@PathVariable ObjectId id, @RequestBody JournalEntry newJournal)
    {
        JournalEntry old = journalEntryService.findById(id).orElse(null);
        if(old !=null)
        {
            old.setTitle(newJournal.getTitle() != null && !newJournal.getTitle().equals("")? newJournal.getTitle() : old.getTitle());
            old.setContent(newJournal.getContent() != null && newJournal.equals("")? newJournal.getContent(): old.getContent() );
        }
        journalEntryService.saveEntry(old);


        return old;
    }
}
