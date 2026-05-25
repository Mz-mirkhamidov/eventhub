package uz.eventhub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.eventhub.backend.domain.entity.Category;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByIsActiveTrueOrderByNameAsc();

    List<Category> findByTypeIgnoreCaseAndIsActiveTrueOrderByNameAsc(String type);
}
