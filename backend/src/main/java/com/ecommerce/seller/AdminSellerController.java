package com.ecommerce.seller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.common.ApiException;
import com.ecommerce.user.User;
import com.ecommerce.user.UserRepository;

@RestController
@RequestMapping("/api/v1/admin/sellers")
public class AdminSellerController {

    private final SellerRepository sellers;
    private final UserRepository users;

    public AdminSellerController(
            SellerRepository sellers,
            UserRepository users) {
        this.sellers = sellers;
        this.users = users;
    }

    @GetMapping
    public List<SellerProfile> list(Authentication authentication) {
        requireAdmin(authentication);
        return sellers.findAll();
    }

    @PutMapping("/{id}/approve")
    public SellerProfile approve(
            @PathVariable UUID id,
            Authentication authentication) {

        requireAdmin(authentication);

        SellerProfile seller = sellers.findById(id)
                .orElseThrow(() -> new ApiException("Seller not found"));

        seller.setStatus(SellerProfile.Status.APPROVED);

        return sellers.save(seller);
    }

    @PutMapping("/{id}/suspend")
    public SellerProfile suspend(
            @PathVariable UUID id,
            Authentication authentication) {

        requireAdmin(authentication);

        SellerProfile seller = sellers.findById(id)
                .orElseThrow(() -> new ApiException("Seller not found"));

        seller.setStatus(SellerProfile.Status.SUSPENDED);

        return sellers.save(seller);
    }

    private void requireAdmin(Authentication authentication) {

        User user = users
                .findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ApiException("User not found"));

        if (user.getRole() != User.Role.ADMIN) {
            throw new ApiException("Admin role required");
        }
    }
}