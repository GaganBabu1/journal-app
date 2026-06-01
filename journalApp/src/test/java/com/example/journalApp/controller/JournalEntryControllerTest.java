package com.example.journalApp.controller;

import com.example.journalApp.entity.JournalEntry;
import com.example.journalApp.service.JournalEntryService;
import com.example.journalApp.util.JwtTokenProvider;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JournalEntryControllerTest {

    @Mock
    private JournalEntryService journalEntryService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private JournalEntryController journalEntryController;

    @Test
    public void getAllEntries_ReturnsPagedResults() throws Exception {
        String userId = "user123";
        JournalEntry e = new JournalEntry("Title", "Content", userId);
        e.setId(new ObjectId());
        e.setCreatedAt(LocalDateTime.now());

        when(jwtTokenProvider.getUserIdFromToken(anyString())).thenReturn(userId);
        when(journalEntryService.getAllByUserId(userId, 0, 10)).thenReturn(new PageImpl<>(List.of(e)));

        var resp = journalEntryController.getAllEntries("Bearer mock-token", 0, 10, null);
        assertThat(resp.getStatusCode().value()).isEqualTo(200);
        var body = resp.getBody();
        assertThat(body).isNotNull();
    }
}
