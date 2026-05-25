package uz.eventhub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.eventhub.backend.domain.entity.Category;
import uz.eventhub.backend.dto.CategoryRequest;
import uz.eventhub.backend.dto.CategoryResponse;
import uz.eventhub.backend.exception.ApiException;
import uz.eventhub.backend.repository.CategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll(String type) {
        List<Category> categories;
        if (type != null && !type.isBlank()) {
            categories = categoryRepository.findByTypeIgnoreCaseAndIsActiveTrueOrderByNameAsc(normalizeType(type));
        } else {
            categories = categoryRepository.findByIsActiveTrueOrderByNameAsc();
        }
        return categories.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllForAdmin() {
        return categoryRepository.findAll().stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName().trim())
                .type(normalizeType(request.getType()))
                .isActive(true)
                .build();
        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));
        category.setName(request.getName().trim());
        category.setType(normalizeType(request.getType()));
        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Transactional
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));
        category.setActive(false);
        categoryRepository.save(category);
    }

    private String normalizeType(String type) {
        if (type == null || type.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Type is required");
        }
        return type.trim().toUpperCase();
    }

    public CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .isActive(category.isActive())
                .build();
    }
}
