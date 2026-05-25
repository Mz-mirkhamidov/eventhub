package uz.eventhub.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.eventhub.backend.dto.CategoryRequest;
import uz.eventhub.backend.dto.CategoryResponse;
import uz.eventhub.backend.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> getAll(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "false") boolean admin) {
        if (admin) {
            return categoryService.getAllForAdmin();
        }
        return categoryService.getAll(type);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CategoryResponse create(@Valid @RequestBody CategoryRequest request) {
        return categoryService.create(request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
