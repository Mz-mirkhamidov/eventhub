package uz.eventhub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.eventhub.backend.domain.entity.User;
import uz.eventhub.backend.dto.AuthResponse;
import uz.eventhub.backend.dto.LoginRequest;
import uz.eventhub.backend.dto.RegisterRequest;
import uz.eventhub.backend.dto.UserResponse;
import uz.eventhub.backend.exception.ApiException;
import uz.eventhub.backend.repository.UserRepository;
import uz.eventhub.backend.security.JwtUtil;
import uz.eventhub.backend.util.SecurityUtils;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already registered");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Phone already registered");
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .build();
        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .role(user.getRole())
                .fullName(user.getFullName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!user.isActive() || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .role(user.getRole())
                .fullName(user.getFullName())
                .build();
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return toUserResponse(user);
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
