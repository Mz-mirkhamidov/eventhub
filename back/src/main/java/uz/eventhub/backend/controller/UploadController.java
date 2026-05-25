package uz.eventhub.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uz.eventhub.backend.dto.UploadResponse;
import uz.eventhub.backend.service.FileStorageService;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping("/image")
    public UploadResponse uploadImage(@RequestParam("file") MultipartFile file) {
        return new UploadResponse(fileStorageService.storeImage(file));
    }
}
